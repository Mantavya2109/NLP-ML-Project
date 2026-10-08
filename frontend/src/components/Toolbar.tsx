import React from 'react';
import { Newspaper, Sparkles, AlertTriangle } from 'lucide-react';

export type ActiveTab = 'detector' | 'real_samples' | 'fake_samples';

interface ToolbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:flex md:flex-row md:items-center md:gap-3 w-full md:w-auto pb-3.5 md:pb-4">
      {/* 1st Button: Detector Workspace */}
      <button
        type="button"
        onClick={() => onSelectTab('detector')}
        className={`w-full md:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-1 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg sm:rounded-xl border-[2px] md:border-[2.5px] border-black text-[11px] sm:text-xs md:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
          activeTab === 'detector'
            ? 'bg-[#c084fc] text-black shadow-[1.5px_1.5px_0px_0px_#000] md:shadow-[3px_3px_0px_0px_#000] translate-x-[-0.5px] translate-y-[-0.5px]'
            : 'bg-white hover:bg-[#faf5ff] text-slate-800 shadow-[1.5px_1.5px_0px_0px_#000] md:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
        }`}
      >
        <Newspaper className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-black flex-shrink-0" strokeWidth={2.5} />
        <span className="hidden md:inline">Detector Workspace</span>
        <span className="md:hidden truncate">Detector</span>
      </button>

      {/* 2nd Button: Real News Samples */}
      <button
        type="button"
        onClick={() => onSelectTab('real_samples')}
        className={`w-full md:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-1 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg sm:rounded-xl border-[2px] md:border-[2.5px] border-black text-[11px] sm:text-xs md:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
          activeTab === 'real_samples'
            ? 'bg-[#86efac] text-black shadow-[1.5px_1.5px_0px_0px_#000] md:shadow-[3px_3px_0px_0px_#000] translate-x-[-0.5px] translate-y-[-0.5px]'
            : 'bg-white hover:bg-[#faf5ff] text-slate-800 shadow-[1.5px_1.5px_0px_0px_#000] md:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
        }`}
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#16a34a] flex-shrink-0" strokeWidth={2.5} />
        <span className="hidden md:inline">Real News Samples</span>
        <span className="md:hidden truncate">Real</span>
        <span className="bg-black text-white text-[8px] sm:text-[9px] md:text-[10px] px-1 sm:px-1.5 md:px-2 py-0 md:py-0.2 rounded-full font-mono flex-shrink-0">
          5
        </span>
      </button>

      {/* 3rd Button: Fake News Samples */}
      <button
        type="button"
        onClick={() => onSelectTab('fake_samples')}
        className={`w-full md:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-1 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg sm:rounded-xl border-[2px] md:border-[2.5px] border-black text-[11px] sm:text-xs md:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
          activeTab === 'fake_samples'
            ? 'bg-[#fca5a5] text-black shadow-[1.5px_1.5px_0px_0px_#000] md:shadow-[3px_3px_0px_0px_#000] translate-x-[-0.5px] translate-y-[-0.5px]'
            : 'bg-white hover:bg-[#faf5ff] text-slate-800 shadow-[1.5px_1.5px_0px_0px_#000] md:shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
        }`}
      >
        <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#dc2626] flex-shrink-0" strokeWidth={2.5} />
        <span className="hidden md:inline">Fake News Samples</span>
        <span className="md:hidden truncate">Fake</span>
        <span className="bg-black text-white text-[8px] sm:text-[9px] md:text-[10px] px-1 sm:px-1.5 md:px-2 py-0 md:py-0.2 rounded-full font-mono flex-shrink-0">
          5
        </span>
      </button>
    </div>
  );
};
