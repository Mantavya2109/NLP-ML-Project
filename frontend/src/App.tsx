import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import type { ActiveTab } from './components/Toolbar';
import { NewsInput } from './components/NewsInput';
import { AnalysisPanel } from './components/AnalysisPanel';
import { SampleNewsView } from './components/SampleNewsView';
import { REAL_NEWS_SAMPLES, FAKE_NEWS_SAMPLES } from './data/samples';
import { predictNews, checkBackendHealth } from './services/api';
import type { PredictionResponse } from './services/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detector');
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const checkHealth = async () => {
    setBackendStatus('checking');
    try {
      await checkBackendHealth();
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await predictNews(inputText);
      setResult(response);
      setBackendStatus('online');
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze text. Please ensure backend is running.');
      setResult(null);
      setBackendStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = (text: string) => {
    setInputText(text);
    setResult(null);
    setError(null);
    setActiveTab('detector');
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#f5eeff] text-black overflow-x-hidden font-sans">
      <Navbar />

      {/* Offline Alert Strip */}
      {backendStatus === 'offline' && (
        <div className="bg-[#fef08a] border-b-2 border-black px-4 py-2 text-xs font-bold text-black flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-black flex-shrink-0" />
            <span>
              Backend server is offline. Run{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-black font-mono text-[11px]">
                python app.py
              </code>{' '}
              inside the <code className="font-mono">backend/</code> directory.
            </span>
            <button
              onClick={checkHealth}
              className="ml-auto inline-flex items-center gap-1 font-black underline hover:text-slate-800 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col min-h-0">
        {/* 3-Button Navigation Toolbar */}
        <Toolbar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Tab 1: Normal / Detector Workspace (Active by default) */}
        {activeTab === 'detector' && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 flex-1 min-h-0">
            {/* Left 70% Input */}
            <div className="lg:col-span-7 flex flex-col min-h-0">
              <NewsInput
                inputText={inputText}
                onChange={setInputText}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />
            </div>

            {/* Right 30% Analysis Panel */}
            <div className="lg:col-span-3 flex flex-col min-h-0">
              <AnalysisPanel
                result={result}
                isLoading={isLoading}
                error={error}
                wordCount={wordCount}
              />
            </div>
          </div>
        )}

        {/* Tab 2: 5 Real News Samples (Copyable, no text box) */}
        {activeTab === 'real_samples' && (
          <SampleNewsView
            type="real"
            samples={REAL_NEWS_SAMPLES}
            onUseSample={handleUseSample}
          />
        )}

        {/* Tab 3: 5 Fake News Samples */}
        {activeTab === 'fake_samples' && (
          <SampleNewsView
            type="fake"
            samples={FAKE_NEWS_SAMPLES}
            onUseSample={handleUseSample}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-[2px] border-black bg-[#f5eeff] py-2.5 px-4 text-center text-xs font-bold text-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 flex-wrap">
          <span>© 2026</span>
          <a
            href="https://www.linkedin.com/in/mantavya-patel-53b49932b"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline decoration-2 hover:text-[#9333ea] transition-colors"
          >
            Mantavya Patel
          </a>
          <span>and</span>
          <a
            href="https://www.linkedin.com/in/ritwiz-hota-773405275/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline decoration-2 hover:text-[#9333ea] transition-colors"
          >
            Ritwiz Hota
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
