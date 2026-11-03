import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Swords, 
  CalendarCheck, 
  BrainCircuit, 
  HeartPulse, 
  BookOpen, 
  LineChart, 
  Settings,
  Brain,
  Grid,
  X
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'System Chat', icon: MessageSquare },
  { id: 'quests', label: 'Daily Quests', icon: Swords },
  { id: 'routine', label: 'Daily Routine', icon: CalendarCheck },
  { id: 'mind', label: 'Mind Training', icon: BrainCircuit },
  { id: 'emotion', label: 'Emotion Control', icon: HeartPulse },
  { id: 'diary', label: 'Daily Diary', icon: BookOpen },
  { id: 'memory', label: 'Personal Memory', icon: Brain },
  { id: 'analysis', label: 'Analysis', icon: LineChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DesktopSidebar: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#080B14] border-r border-[#1E293B] min-h-[calc(100vh-57px)] p-4 space-y-1">
      <div className="px-3 py-2 text-[11px] font-mono tracking-wider text-blue-400 uppercase font-bold">
        Hunter Modules
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-950/70 text-blue-200 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131C31]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const PRIMARY_MOBILE_ITEMS = NAV_ITEMS.slice(0, 4);
  const MORE_MOBILE_ITEMS = NAV_ITEMS.slice(4);

  return (
    <>
      {/* Mobile Popover Menu for Additional Modules */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end p-4">
          <div className="bg-[#101525] border border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">
                All System Modules
              </span>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {MORE_MOBILE_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'bg-[#131C31] border border-[#1E293B] text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-300" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B14]/95 backdrop-blur-xl border-t border-[#1E293B] px-3 py-2 flex items-center justify-between">
        {PRIMARY_MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setShowMoreMenu(false);
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive 
                  ? 'text-blue-400 bg-blue-950/60 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate max-w-[65px]">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
            MORE_MOBILE_ITEMS.some(i => i.id === currentTab)
              ? 'text-blue-400 bg-blue-950/60 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
