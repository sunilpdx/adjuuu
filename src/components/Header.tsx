import React from 'react';
import { ActiveTab } from '../types';
import { Plus, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNavigateHome: () => void;
  onOpenHowItWorks: () => void;
  dropsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onNavigateHome,
  onOpenHowItWorks,
  dropsCount
}) => {
  return (
    <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-40 bg-[#0c0d0e]/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          <span className="font-extrabold tracking-tight text-xl text-white">
            DROP<span className="text-amber-400">FIND</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline tabular-nums">
            v1.0
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400 shrink-0">
          <button
            onClick={() => {
              onTabChange('visitor');
              onNavigateHome();
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'visitor' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Video Drops ({dropsCount})
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="whitespace-nowrap transition-colors hover:text-white"
          >
            How it Works
          </button>
          <button
            onClick={() => onTabChange('admin')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'admin' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Creator Dashboard
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab === 'visitor' ? (
            <button
              onClick={() => onTabChange('admin')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl transition duration-150 active:scale-95 shadow-md shadow-amber-400/10 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Creator Mode</span>
            </button>
          ) : (
            <button
              onClick={() => onTabChange('visitor')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition duration-150 active:scale-95 border border-white/10 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Visitor Store</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
