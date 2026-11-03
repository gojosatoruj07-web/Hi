import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, Flame, Zap } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onOpenAuth }) => {
  const { currentUser, userProfile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3 bg-[#080B14]/95 backdrop-blur-xl border-b border-[#1E293B]">
      {/* Zone 1: Brand Wordmark with Blue Glowing Emblem */}
      <div 
        onClick={() => onTabChange('dashboard')}
        className="flex items-center gap-2.5 cursor-pointer shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/60 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] system-blue-glow">
          <Shield className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight text-slate-100 whitespace-nowrap shrink-0">
            SHADOW SYSTEM
          </span>
          <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase whitespace-nowrap shrink-0">
            The Path to Jin-Woo
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Desktop) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button 
          onClick={() => onTabChange('dashboard')} 
          className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'dashboard' ? 'text-blue-400 font-semibold border-b-2 border-blue-500 pb-0.5' : ''}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => onTabChange('chat')} 
          className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'chat' ? 'text-blue-400 font-semibold border-b-2 border-blue-500 pb-0.5' : ''}`}
        >
          System Chat
        </button>
        <button 
          onClick={() => onTabChange('quests')} 
          className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'quests' ? 'text-blue-400 font-semibold border-b-2 border-blue-500 pb-0.5' : ''}`}
        >
          Daily Quests
        </button>
        <button 
          onClick={() => onTabChange('routine')} 
          className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'routine' ? 'text-blue-400 font-semibold border-b-2 border-blue-500 pb-0.5' : ''}`}
        >
          Daily Routine
        </button>
        <button 
          onClick={() => onTabChange('analysis')} 
          className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'analysis' ? 'text-blue-400 font-semibold border-b-2 border-blue-500 pb-0.5' : ''}`}
        >
          AI Analysis
        </button>
      </nav>

      {/* Zone 3: User Level / Auth Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {currentUser && userProfile ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#131C31] border border-blue-500/40 rounded-lg text-xs font-mono text-blue-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>D-{userProfile.currentDay}</span>
              <span className="text-slate-600">|</span>
              <span className="text-blue-400">{((userProfile.currentHunterIndex || 0.0001) * 100).toFixed(4)}%</span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#131C31] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span>Initialize</span>
          </button>
        )}
      </div>
    </header>
  );
};
