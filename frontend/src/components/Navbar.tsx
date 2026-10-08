import React from 'react';
import { Newspaper, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b-[2.5px] border-black bg-[#f5eeff] sticky top-0 z-50 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c084fc] border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-black text-base flex-shrink-0">
            <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="text-base sm:text-xl font-extrabold tracking-tight whitespace-nowrap">
            <span>Fake</span>
            <span className="text-[#9333ea]">Detector</span>
          </div>
        </div>

        {/* Right Label: ML LAB Project CSE 2019 */}
        <div className="flex items-center flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-white border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2.5px_2.5px_0px_0px_#000] text-[10px] sm:text-xs md:text-sm font-extrabold text-black whitespace-nowrap">
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9333ea] flex-shrink-0" strokeWidth={2.5} />
            <span className="hidden md:inline">ML LAB Project CSE 2019</span>
            <span className="hidden xs:inline md:hidden">ML LAB CSE 2019</span>
            <span className="xs:hidden">CSE 2019</span>
          </div>
        </div>
      </div>
    </header>
  );
};
