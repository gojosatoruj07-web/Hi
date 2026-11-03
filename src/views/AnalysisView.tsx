import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Shield, LineChart, Zap } from 'lucide-react';
import { INITIAL_SCORES } from '../services/hunterStore';

export const AnalysisView: React.FC = () => {
  const { userProfile, dailyProgress } = useAuth();

  const currentDay = userProfile?.currentDay || 1;
  const hunterIndex = (userProfile?.currentHunterIndex || 0.0001) * 100;

  const completedTasks = dailyProgress?.completedCount || 0;
  const questDone = dailyProgress?.questCompleted ? 1 : 0;
  const diaryDone = dailyProgress?.diaryCompleted ? 1 : 0;

  const baseBonus = Math.min(25, completedTasks * 2 + questDone * 5 + diaryDone * 5);

  const attributes = [
    { label: 'Mental Strength', val: INITIAL_SCORES.mentalStrength + baseBonus, color: 'bg-blue-500' },
    { label: 'Physical Fitness', val: INITIAL_SCORES.physicalFitness + Math.min(20, (dailyProgress?.physicalLogged?.pushups || 0) / 5), color: 'bg-cyan-500' },
    { label: 'Discipline', val: INITIAL_SCORES.discipline + baseBonus, color: 'bg-emerald-500' },
    { label: 'Emotional Control', val: INITIAL_SCORES.emotionalControl + (dailyProgress?.emotionalCheckInDone ? 8 : 0), color: 'bg-teal-500' },
    { label: 'Observation', val: INITIAL_SCORES.observation + baseBonus, color: 'bg-indigo-500' },
    { label: 'Memory', val: INITIAL_SCORES.memory + baseBonus, color: 'bg-blue-400' },
    { label: 'Logical Thinking', val: INITIAL_SCORES.logicalThinking + baseBonus, color: 'bg-sky-500' },
    { label: 'Problem-Solving', val: INITIAL_SCORES.problemSolving + baseBonus, color: 'bg-cyan-400' },
    { label: 'Focus', val: INITIAL_SCORES.focus + baseBonus, color: 'bg-blue-600' },
    { label: 'Confidence', val: INITIAL_SCORES.confidence + baseBonus, color: 'bg-amber-500' },
    { label: 'Communication', val: INITIAL_SCORES.communication + baseBonus, color: 'bg-indigo-400' },
    { label: 'Strategic Thinking', val: INITIAL_SCORES.strategicThinking + baseBonus, color: 'bg-blue-300' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="p-5 md:p-6 bg-[#101525] border border-[#1E293B] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
            <LineChart className="w-4 h-4 text-cyan-400" />
            <span>SYSTEM AI ANALYSIS & SNAPSHOT</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Hunter Progress Index & Attributes</h2>
          <p className="text-xs text-slate-400">
            Gradual percentage progression calculated strictly from verified database actions.
          </p>
        </div>

        <div className="bg-[#080B14] border border-blue-500/40 rounded-xl p-4 text-center min-w-[210px] shadow-[0_0_20px_rgba(59,130,246,0.2)] system-blue-glow">
          <span className="text-[10px] font-mono tracking-wider text-blue-400 uppercase block mb-0.5">
            CURRENT HUNTER INDEX
          </span>
          <span className="text-2xl font-black font-mono text-blue-200">
            {hunterIndex.toFixed(4)}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Starting Baseline: 0.0001%</span>
        </div>
      </div>

      {/* 12 Attributes Grid */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>12 Core Hunter Attributes</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Day {currentDay} / 30 Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {attributes.map((attr, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-200 font-bold">{attr.label}</span>
                <span className="font-mono text-blue-300 font-bold">{Math.min(100, attr.val)} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#080B14] border border-[#1E293B] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${attr.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, attr.val)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Scoring Algorithm Explanation Card */}
      <div className="bg-[#101525] border border-blue-500/30 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Transparent Index Scoring Algorithm</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-[#080B14] p-4 rounded-xl border border-[#1E293B]">
          The Hunter Progress Index starts at an exact baseline of <strong className="text-blue-300">0.0001%</strong> and increments through verified actions:<br />
          • <strong className="text-blue-300">+0.00005%</strong> per completed routine task.<br />
          • <strong className="text-blue-300">+0.00010%</strong> per cleared daily quest reflection.<br />
          • <strong className="text-blue-300">+0.00020%</strong> per analyzed daily diary entry.<br />
          Points are never awarded for unverified claims or empty text entries.
        </p>
      </div>
    </motion.div>
  );
};
