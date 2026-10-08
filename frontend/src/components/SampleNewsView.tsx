import React, { useState } from 'react';
import { Copy, Check, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { NewsSample } from '../data/samples';

interface SampleNewsViewProps {
  type: 'real' | 'fake';
  samples: NewsSample[];
  onUseSample: (text: string) => void;
}

export const SampleNewsView: React.FC<SampleNewsViewProps> = ({
  type,
  samples,
  onUseSample,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (sample: NewsSample) => {
    navigator.clipboard.writeText(sample.text);
    setCopiedId(sample.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const isReal = type === 'real';

  return (
    <div className="flex flex-col gap-3.5 flex-1 min-h-0">
      {/* Top Banner Bar */}
      <div
        className={`border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          isReal ? 'bg-[#bbf7d0]' : 'bg-[#fecaca]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white border-2 border-black flex items-center justify-center">
            {isReal ? (
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#dc2626]" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-black tracking-tight">
              {isReal ? '5 Authentic Real News Samples' : '5 Misinformation / Fake News Samples'}
            </h2>
          </div>
        </div>

        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-white border-2 border-black text-black self-start sm:self-center">
          5 Horizontal Samples
        </span>
      </div>

      {/* Vertical List of Horizontal Bars */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-3 flex-1 min-h-0">
        {samples.map((sample, idx) => {
          const isCopied = copiedId === sample.id;

          return (
            <div
              key={sample.id}
              className="w-full bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] rounded-xl p-3.5 sm:p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
            >
              {/* Left Details & Text Preview */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#f3e8ff] border border-black font-mono text-black">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700">
                    {sample.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-black tracking-tight line-clamp-1">
                    {sample.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-2 bg-[#faf7ff] border border-black rounded-lg p-2.5">
                  {sample.text}
                </p>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-center pt-1 lg:pt-0">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(sample)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-extrabold transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-[#86efac] text-black shadow-none'
                      : 'bg-white hover:bg-[#faf5ff] text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" strokeWidth={2} />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Test in Detector Button */}
                <button
                  type="button"
                  onClick={() => onUseSample(sample.text)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs font-extrabold text-black transition-all cursor-pointer ${
                    isReal
                      ? 'bg-[#86efac] hover:bg-[#4ade80]'
                      : 'bg-[#fca5a5] hover:bg-[#f87171]'
                  }`}
                >
                  <span>Test in Detector</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
