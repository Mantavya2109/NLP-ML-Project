import React from 'react';
import { Loader2, ArrowRight, FileText } from 'lucide-react';

interface NewsInputProps {
  inputText: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const NewsInput: React.FC<NewsInputProps> = ({
  inputText,
  onChange,
  onAnalyze,
  isLoading,
}) => {
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const isInputEmpty = !inputText.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isInputEmpty && !isLoading) {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <div className="bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] rounded-xl p-3.5 sm:p-5 flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-black">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#e9d5ff] border border-black flex items-center justify-center flex-shrink-0">
            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold text-black tracking-tight">Article Content</h2>
        </div>

        <span className="hidden xs:inline text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#f3e8ff] border border-black text-slate-800 font-mono">
          Input Workspace
        </span>
      </div>

      {/* Primary Textarea Area */}
      <div className="flex-1 min-h-[220px] sm:min-h-[280px] lg:min-h-0 py-2.5 sm:py-3 flex flex-col">
        <textarea
          id="news-input"
          value={inputText}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Paste news article, headline, or claim here..."
          className="w-full flex-1 bg-[#faf7ff] focus:bg-white text-black placeholder:text-slate-400 border-2 border-black rounded-lg p-3 sm:p-3.5 focus:outline-none focus:shadow-[1.5px_1.5px_0px_0px_#000] text-xs sm:text-sm leading-relaxed resize-none font-medium transition-all"
        />
      </div>

      {/* Footer bar with Stats & Primary Analyze Button */}
      <div className="pt-2.5 sm:pt-3 border-t-2 border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 justify-start">
          <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#f3e8ff] border border-black text-[11px] sm:text-xs font-bold text-slate-900 font-mono">
            {wordCount} words
          </span>
          <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#f3e8ff] border border-black text-[11px] sm:text-xs font-bold text-slate-900 font-mono">
            {charCount} chars
          </span>
          <span className="hidden md:inline text-[11px] text-slate-500 font-semibold ml-1">
            (Ctrl+Enter to run)
          </span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isInputEmpty || isLoading}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-xs sm:text-sm font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
            isInputEmpty || isLoading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-400 shadow-none'
              : 'bg-[#c084fc] hover:bg-[#b575f7] active:bg-[#a855f7] text-black'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-black" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze News</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
