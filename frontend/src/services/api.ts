export interface PredictionResponse {
  prediction: 'Fake' | 'Real';
  confidence: number;
}

export interface HealthResponse {
  status: string;
  model: string;
}

// Configurable API base URL:
// - If VITE_API_URL is set, use it (stripped of trailing slash).
// - If not set: in local dev, default to 'http://localhost:5000'.
// - In Vercel production: default to '' (same-origin relative calls to /api/*).
const rawEnvUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

export const API_BASE_URL: string = rawEnvUrl
  ? rawEnvUrl.replace(/\/+$/, '')
  : (isDev ? 'http://localhost:5000' : '');

export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Checks if the backend API is active and reachable.
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  // Try /api/ first, fallback to /
  const endpoints = [
    `${API_BASE_URL}/api/`,
    `${API_BASE_URL}/api`,
    `${API_BASE_URL}/`,
  ];

  let lastError: any = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError instanceof ApiError) {
    throw lastError;
  }
  throw new ApiError(
    'Backend API is currently offline or unreachable. Please verify server status.'
  );
}

/**
 * Sends news text to the BiLSTM NLP model for classification.
 */
export async function predictNews(text: string): Promise<PredictionResponse> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new ApiError('Please enter some news text or an article statement to analyze.');
  }

  // Primary endpoint: /api/predict (Vercel standard), fallback: /predict
  const primaryEndpoint = `${API_BASE_URL}/api/predict`;
  const fallbackEndpoint = `${API_BASE_URL}/predict`;

  let response: Response | null = null;
  let data: any = null;

  try {
    response = await fetch(primaryEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text: trimmed }),
    });

    data = await response.json().catch(() => null);
  } catch (error) {
    // If primary failed on network, attempt fallback
    try {
      response = await fetch(fallbackEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      });
      data = await response.json().catch(() => null);
    } catch {
      throw new ApiError('Unable to connect to the prediction API server.');
    }
  }

  if (!response || !response.ok) {
    const errorMessage = data?.error || `Server responded with error code ${response?.status || 500}`;
    throw new ApiError(errorMessage, response?.status);
  }

  if (!data || typeof data.prediction !== 'string' || typeof data.confidence !== 'number') {
    throw new ApiError('Received invalid response format from backend server.');
  }

  return {
    prediction: data.prediction === 'Real' ? 'Real' : 'Fake',
    confidence: data.confidence,
  };
}
