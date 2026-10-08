import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Loader2, BarChart3 } from 'lucide-react';
import type { PredictionResponse } from '../services/api';

interface AnalysisPanelProps {
  result: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  wordCount: number;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  result,
  isLoading,
  error,
  wordCount,
}) => {
  return (
    <div className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] rounded-xl p-5 flex flex-col h-full">
      {/* Header bar */}
      <div className="pb-3 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#c084fc] border border-black flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-black" />
          </div>
          <h2 className="text-sm font-extrabold text-black tracking-tight">Analysis Result</h2>
        </div>

        {result && !isLoading && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#86efac] border border-black text-black uppercase">
            Complete
          </span>
        )}
      </div>

      {/* Main Content State */}
      <div className="flex-1 flex flex-col justify-center py-4 min-h-[220px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#e9d5ff] border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-black">Processing tokens...</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">BiLSTM model inference running</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-[#fecaca] border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl">
            <AlertTriangle className="w-6 h-6 text-black mb-1.5" />
            <p className="text-sm font-extrabold text-black">Analysis Failed</p>
            <p className="text-xs font-medium text-slate-800 mt-1">{error}</p>
          </div>
        ) : result ? (
          <div className="flex flex-col justify-between h-full gap-4">
            {/* Verdict Card */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                Verdict
              </span>

              {result.prediction === 'Real' ? (
                <div className="bg-[#86efac] border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-4 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-black mb-1.5">
                    <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-black tracking-tight">REAL NEWS</h3>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    Credible journalistic structure verified
                  </p>
                </div>
              ) : (
                <div className="bg-[#fca5a5] border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-4 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-black mb-1.5">
                    <AlertTriangle className="w-5 h-5 text-black" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-black tracking-tight">FAKE NEWS</h3>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    Misleading signals or rhetoric detected
                  </p>
                </div>
              )}
            </div>

            {/* Confidence Gauge */}
            <div className="bg-[#faf5ff] border-2 border-black rounded-lg p-3">
              <div className="flex items-center justify-between text-xs font-black text-black mb-1.5">
                <span>Model Confidence</span>
                <span className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-black">
                  {result.confidence.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-white border-2 border-black rounded-full h-3.5 p-[2px] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.prediction === 'Real' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, result.confidence))}%` }}
                />
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f5eeff] border border-black rounded-md p-2 flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Input</span>
                <span className="font-black text-black font-mono">{wordCount} words</span>
              </div>
              <div className="bg-[#f5eeff] border border-black rounded-md p-2 flex flex-col">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Architecture</span>
                <span className="font-black text-black font-mono">2L-BiLSTM</span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-black mb-3">
              <Sparkles className="w-6 h-6 text-[#9333ea]" />
            </div>
            <p className="text-sm font-extrabold text-black">Ready to analyze</p>
            <p className="text-xs font-semibold text-slate-600 mt-1 max-w-[200px]">
              Paste a news article on the left and click Analyze News.
            </p>
          </div>
        )}
      </div>

      {/* Subtle bottom disclaimer */}
      <div className="pt-2.5 border-t-2 border-black text-[10px] font-bold text-slate-500 text-center leading-tight">
        NLP BiLSTM model output • Cross-verify critical claims
      </div>
    </div>
  );
};
