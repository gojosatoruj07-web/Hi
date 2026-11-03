import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  Shield, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Swords, 
  BrainCircuit, 
  HeartPulse, 
  ArrowRight, 
  MessageSquare,
  Zap,
  Activity
} from 'lucide-react';
import { ROUTINE_PROFILES } from '../data/routineData';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { userProfile, dailyProgress } = useAuth();

  const currentDay = userProfile?.currentDay || 1;
  const hunterIndex = (userProfile?.currentHunterIndex || 0.0001) * 100;
  const routineProfileId = userProfile?.selectedRoutineProfile || 'normal';
  const activeProfile = ROUTINE_PROFILES[routineProfileId] || ROUTINE_PROFILES.normal;

  const routineTasks = dailyProgress?.routineTasks || activeProfile.tasks;
  const completedTasks = routineTasks.filter(t => t.completed).length;
  const totalTasks = routineTasks.length;
  const routineScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Welcome & Directive Hero Banner */}
      <div className="relative overflow-hidden bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-xs font-mono text-blue-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>SYSTEM ONLINE · DAY {currentDay} / 30</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome Back, <span className="text-blue-400">{userProfile?.displayName || 'Hunter'}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-200 font-medium leading-relaxed bg-[#080B14]/80 p-4 rounded-xl border border-[#1E293B]">
              "System Online. Aaj ka objective clear hai. Apni weaknesses identify karo aur unhe improve karo. Action se hi progress aayegi."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="bg-[#080B14] border border-blue-500/40 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(59,130,246,0.2)] system-blue-glow">
              <span className="text-[10px] font-mono tracking-wider text-blue-400 uppercase block mb-1">
                HUNTER PROGRESS INDEX
              </span>
              <span className="text-2xl md:text-3xl font-black font-mono text-blue-200 tracking-tight">
                {hunterIndex.toFixed(4)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Starting Baseline: 0.0001%</span>
            </div>

            <button
              onClick={() => onNavigate('chat')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Consult Jin-Woo AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Hunter Level */}
        <div className="bg-[#131C31] border border-[#1E293B] rounded-xl p-3.5 md:p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] md:text-[11px] font-mono text-slate-400 uppercase block">Rank</span>
            <div className="text-base md:text-lg font-extrabold text-slate-100">
              E-Rank
            </div>
            <span className="text-[10px] text-blue-400 font-mono block">Day {currentDay} Protocol</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Streak */}
        <div className="bg-[#131C31] border border-[#1E293B] rounded-xl p-3.5 md:p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] md:text-[11px] font-mono text-slate-400 uppercase block">Streak</span>
            <div className="text-base md:text-lg font-extrabold text-slate-100 flex items-center gap-1">
              <span>{userProfile?.streak || 1} Days</span>
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Daily Consistency</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Routine Progress */}
        <div className="bg-[#131C31] border border-[#1E293B] rounded-xl p-3.5 md:p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] md:text-[11px] font-mono text-slate-400 uppercase block">Routine</span>
            <div className="text-base md:text-lg font-extrabold text-slate-100">
              {routineScore}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">{completedTasks} / {totalTasks} Tasks</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Quest Status */}
        <div className="bg-[#131C31] border border-[#1E293B] rounded-xl p-3.5 md:p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] md:text-[11px] font-mono text-slate-400 uppercase block">Mission</span>
            <div className="text-xs md:text-sm font-bold text-slate-100 truncate max-w-[100px]">
              {dailyProgress?.questCompleted ? 'Cleared' : 'Pending'}
            </div>
            <span className="text-[10px] text-blue-400 font-mono block">Daily Quest</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Swords className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Main Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Schedule Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div>
                <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Routine Checklist ({activeProfile.name})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{activeProfile.subtitle}</p>
              </div>
              <button
                onClick={() => onNavigate('routine')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {routineTasks.slice(0, 6).map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                    task.completed 
                      ? 'bg-blue-950/20 border-blue-500/30 text-slate-300' 
                      : 'bg-[#131C31] border-[#1E293B] text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-blue-400 min-w-[70px]">{task.time}</span>
                    <span className={task.completed ? 'line-through text-slate-400' : 'font-medium'}>
                      {task.objective}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                    task.completed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {task.completed ? 'DONE' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive & Emotional Quick Access */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('mind')}
              className="bg-[#101525] border border-[#1E293B] hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-300">Mind Training</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Observation, Memory, Logic, Problem-Solving & Deep Focus modules.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
                <span>Start Training</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('emotion')}
              className="bg-[#101525] border border-[#1E293B] hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-300">Emotion Control</h4>
                <p className="text-xs text-slate-400 mt-1">
                  5-second pause protocol, trigger logger & stoic breathing timer.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
                <span>Emotional Check-In</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Companion & Journal Quick Access */}
        <div className="space-y-6">
          <div className="bg-[#101525] border border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/60 border border-blue-400 flex items-center justify-center text-blue-200 font-extrabold font-mono">
                JW
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Jin-Woo System AI</h4>
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Active System Companion
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 bg-[#080B14] p-3.5 rounded-xl border border-[#1E293B] italic leading-relaxed">
              "System tumhare real actions track kar raha hai. Daily quests aur routine complete karo index advance karne ke liye."
            </p>

            <button
              onClick={() => onNavigate('chat')}
              className="w-full py-2.5 bg-[#131C31] hover:bg-[#1a2542] border border-blue-500/40 text-blue-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open System Chat</span>
            </button>
          </div>

          <div 
            onClick={() => onNavigate('diary')}
            className="bg-[#101525] border border-[#1E293B] hover:border-blue-500/40 rounded-2xl p-5 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100">Day {currentDay} Daily Journal</h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                dailyProgress?.diaryCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {dailyProgress?.diaryCompleted ? 'LOGGED' : 'PENDING'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Log accomplishments, mistakes, and learnings to trigger AI analysis.
            </p>
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
              <span>Open Journal Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
