export interface PredictionResponse {
  prediction: 'Fake' | 'Real';
  confidence: number;
}

export interface HealthResponse {
  status: string;
  model: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Checks if the backend Flask API is active and reachable.
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(`Backend returned status ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Backend server is currently offline or unreachable at ' + API_BASE_URL);
  }
}

/**
 * Sends news text to the backend BiLSTM NLP model for classification.
 */
export async function predictNews(text: string): Promise<PredictionResponse> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new ApiError('Please enter some news text or an article statement to analyze.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text: trimmed }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || `Server responded with error code ${response.status}`;
      throw new ApiError(errorMessage, response.status);
    }

    if (!data || typeof data.prediction !== 'string' || typeof data.confidence !== 'number') {
      throw new ApiError('Received invalid response format from backend server.');
    }

    return {
      prediction: data.prediction === 'Real' ? 'Real' : 'Fake',
      confidence: data.confidence,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Unable to reach backend service. Please make sure the Flask server is running on ' + API_BASE_URL
    );
  }
}
