import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ROUTINE_PROFILES, SEVEN_DAY_ROTATION } from '../data/routineData';
import { updateDailyTasks, updatePhysicalLogged, getTodayDateString } from '../services/hunterStore';
import { RoutineTask } from '../types/hunter';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  Dumbbell, 
  Clock, 
  AlertTriangle, 
  Zap,
  Activity
} from 'lucide-react';

export const DailyRoutineView: React.FC = () => {
  const { currentUser, userProfile, dailyProgress, refreshUserData, setSelectedRoutineProfile } = useAuth();
  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const [saving, setSaving] = useState(false);

  const [pushups, setPushups] = useState<number>(0);
  const [squats, setSquats] = useState<number>(0);
  const [situps, setSitups] = useState<number>(0);
  const [runningKm, setRunningKm] = useState<number>(0);

  const selectedProfileId = userProfile?.selectedRoutineProfile || 'normal';
  const activeProfile = ROUTINE_PROFILES[selectedProfileId] || ROUTINE_PROFILES.normal;

  useEffect(() => {
    if (dailyProgress) {
      setTasks(dailyProgress.routineTasks || activeProfile.tasks);
      if (dailyProgress.physicalLogged) {
        setPushups(dailyProgress.physicalLogged.pushups || 0);
        setSquats(dailyProgress.physicalLogged.squats || 0);
        setSitups(dailyProgress.physicalLogged.situps || 0);
        setRunningKm(dailyProgress.physicalLogged.runningKm || 0);
      }
    } else {
      setTasks(activeProfile.tasks);
    }
  }, [dailyProgress, selectedProfileId]);

  const toggleTask = async (taskId: string) => {
    if (!currentUser || !userProfile) return;
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);

    const todayStr = getTodayDateString();
    setSaving(true);
    try {
      await updateDailyTasks(currentUser.uid, todayStr, newTasks, userProfile);
      await refreshUserData();
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePhysicalUpdate = async (type: string, val: number) => {
    if (!currentUser) return;
    const newPushups = type === 'pushups' ? val : pushups;
    const newSquats = type === 'squats' ? val : squats;
    const newSitups = type === 'situps' ? val : situps;
    const newRunning = type === 'running' ? val : runningKm;

    if (type === 'pushups') setPushups(val);
    if (type === 'squats') setSquats(val);
    if (type === 'situps') setSitups(val);
    if (type === 'running') setRunningKm(val);

    const todayStr = getTodayDateString();
    await updatePhysicalLogged(currentUser.uid, todayStr, {
      pushups: newPushups,
      squats: newSquats,
      situps: newSitups,
      runningKm: newRunning
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* 7-Day Training Rotation Banner */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>SUNG JIN-WOO 7-DAY ROTATION SYSTEM</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Midnight Reset at 12:00 AM IST</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin snap-x snap-mandatory sm:grid sm:grid-cols-7">
          {SEVEN_DAY_ROTATION.map((item, idx) => (
            <div 
              key={idx}
              className={`p-2.5 sm:p-2 rounded-xl text-center border transition-all min-w-[85px] sm:min-w-0 shrink-0 snap-start flex-1 ${
                item.focus === 'RECOVER'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : item.focus === 'STRENGTH'
                  ? 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                  : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
              }`}
            >
              <span className="block text-xs sm:text-[10px] font-mono font-bold tracking-wider">{item.day}</span>
              <span className="block text-xs sm:text-[11px] font-extrabold mt-0.5 whitespace-nowrap">{item.focus}</span>
              <span className="block text-[9px] text-slate-400 mt-0.5 whitespace-nowrap">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Routine Profile Selector */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Active Schedule Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact schedules reproduced from Daily Quest Log PDF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 font-bold">{percentage}% Cleared</span>
            <div className="w-24 h-2 bg-[#080B14] rounded-full overflow-hidden border border-[#1E293B]">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
          {Object.values(ROUTINE_PROFILES).map((p) => {
            const isSelected = selectedProfileId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedRoutineProfile(p.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.25)] font-semibold'
                    : 'bg-[#131C31] border-[#1E293B] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400">{p.rank}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                </div>
                <div className="text-xs md:text-sm font-bold truncate">{p.name}</div>
                <div className="text-[9px] text-slate-400 mt-1 line-clamp-1">{p.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Workout Directive Notice */}
        <div className="p-3.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-300 font-mono">Directive:</strong> {activeProfile.workoutDirective}
          </div>
        </div>
      </div>

      {/* PDF Physical Target Tracker */}
      <div className="bg-[#101525] border border-amber-500/30 rounded-2xl p-5 md:p-6 space-y-4 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm md:text-base font-bold text-slate-100">Daily Quest: 100 Reps & 10KM Target</h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300">Configurable Targets · Safety First</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-[#080B14] p-3 rounded-xl border border-[#1E293B] space-y-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Push-Ups [100]</span>
            <input
              type="number"
              value={pushups}
              onChange={(e) => handlePhysicalUpdate('pushups', Number(e.target.value))}
              className="w-full bg-[#131C31] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs md:text-sm font-mono text-amber-300 font-bold focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 block">Reps Logged</span>
          </div>

          <div className="bg-[#080B14] p-3 rounded-xl border border-[#1E293B] space-y-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Squats [100]</span>
            <input
              type="number"
              value={squats}
              onChange={(e) => handlePhysicalUpdate('squats', Number(e.target.value))}
              className="w-full bg-[#131C31] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs md:text-sm font-mono text-amber-300 font-bold focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 block">Reps Logged</span>
          </div>

          <div className="bg-[#080B14] p-3 rounded-xl border border-[#1E293B] space-y-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Sit-Ups [100]</span>
            <input
              type="number"
              value={situps}
              onChange={(e) => handlePhysicalUpdate('situps', Number(e.target.value))}
              className="w-full bg-[#131C31] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs md:text-sm font-mono text-amber-300 font-bold focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 block">Reps Logged</span>
          </div>

          <div className="bg-[#080B14] p-3 rounded-xl border border-[#1E293B] space-y-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Running [10KM]</span>
            <input
              type="number"
              step="0.5"
              value={runningKm}
              onChange={(e) => handlePhysicalUpdate('running', Number(e.target.value))}
              className="w-full bg-[#131C31] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs md:text-sm font-mono text-amber-300 font-bold focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 block">KM Logged</span>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-[10px] md:text-[11px] text-red-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>
            <strong>Physical Safety Directive:</strong> Do not force 100 reps / 10KM immediately. Progress gradually with proper warm-up. Stop if experiencing pain or dizziness.
          </span>
        </div>
      </div>

      {/* Timetable Checklist */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Timetable Checklist ({completedCount}/{totalCount} Cleared)</span>
          </h3>
          {saving && <span className="text-xs font-mono text-blue-400 animate-pulse">Syncing...</span>}
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center justify-between p-3 md:p-3.5 rounded-xl border cursor-pointer transition-all ${
                task.completed
                  ? 'bg-blue-950/20 border-blue-500/40 text-slate-300'
                  : 'bg-[#131C31] border-[#1E293B] text-slate-100 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <button type="button" className="text-blue-400 shrink-0">
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </button>
                <span className="text-xs font-mono font-bold text-blue-300 min-w-[75px] md:min-w-[85px]">
                  {task.time}
                </span>
                <span className={`text-xs md:text-sm ${task.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                  {task.objective}
                </span>
              </div>

              <span className={`text-[9px] md:text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                task.completed 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {task.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
