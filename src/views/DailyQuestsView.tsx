import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { getQuestForDay, completeQuest } from '../services/hunterStore';
import { QuestItem } from '../types/hunter';
import { Swords, CheckCircle, Clock, Award, Send, Sparkles, AlertCircle } from 'lucide-react';
import { DAILY_QUESTS_30_DAYS } from '../data/questsData';
import { apiFetch } from '../utils/api';

export const DailyQuestsView: React.FC = () => {
  const { currentUser, userProfile, refreshUserData } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number>(userProfile?.currentDay || 1);
  const [quest, setQuest] = useState<QuestItem | null>(null);
  const [reflection, setReflection] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadQuestData(selectedDay);
    }
  }, [currentUser, selectedDay]);

  const loadQuestData = async (dayNum: number) => {
    if (!currentUser) return;
    try {
      const q = await getQuestForDay(currentUser.uid, dayNum);
      setQuest(q);
      setReflection(q.reflectionAnswer || '');
    } catch (err) {
      console.error('Error loading quest:', err);
      const fallback = DAILY_QUESTS_30_DAYS.find(item => item.dayNumber === dayNum) || DAILY_QUESTS_30_DAYS[0];
      setQuest(fallback);
    }
  };

  const handleComplete = async () => {
    if (!currentUser || !quest || !reflection.trim() || evaluating) return;
    setEvaluating(true);

    try {
      const res = await apiFetch('/api/quest-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questTitle: quest.title,
          category: quest.category,
          reflectionAnswer: reflection.trim(),
          dayNumber: selectedDay
        })
      });

      const data = await res.json();
      const aiEval = data.evaluation || 'Mission reflection recorded.';

      if (userProfile) {
        await completeQuest(currentUser.uid, quest.questId, reflection.trim(), aiEval, userProfile);
        await refreshUserData();
        await loadQuestData(selectedDay);
      }
    } catch (err) {
      console.error('Error completing quest:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-[#101525] border border-[#1E293B] rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase font-bold">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>30-DAY MONARCH TRAINING CRUCIBLE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Daily Quests & Missions</h2>
          <p className="text-xs text-slate-400">
            Progressive cognitive, emotional, physical and strategic missions.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs font-mono text-slate-400 shrink-0">Day:</span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="px-3 py-1.5 bg-[#080B14] border border-blue-500/40 text-blue-300 rounded-xl text-sm font-mono font-bold focus:outline-none"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                Day {d} {d === userProfile?.currentDay ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quest Spec Card */}
      {quest && (
        <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 space-y-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          {/* Top Bar Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-blue-950 border border-blue-500/50 text-blue-300 font-mono text-xs font-bold rounded-lg">
                DAY {quest.dayNumber}
              </span>
              <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-lg">
                {quest.difficulty}
              </span>
              <span className="text-xs font-mono text-slate-400">{quest.category}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {quest.duration}
              </span>
              <span className={`px-2.5 py-0.5 rounded font-bold ${
                quest.status === 'completed'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {quest.status === 'completed' ? 'CLEARED' : 'IN PROGRESS'}
              </span>
            </div>
          </div>

          {/* Title & Objective */}
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-100">{quest.title}</h3>
            <p className="text-xs md:text-sm text-blue-200/90 font-medium bg-[#080B14] p-4 rounded-xl border border-[#1E293B]">
              <strong className="text-slate-200">Objective:</strong> {quest.objective}
            </p>
          </div>

          {/* Instructions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Step-by-Step Directives:
            </h4>
            <div className="space-y-2">
              {quest.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[#131C31] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Criteria */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Completion Criteria:</strong> {quest.criteria}
            </div>
          </div>

          {/* Reflection Section */}
          <div className="space-y-3 pt-4 border-t border-[#1E293B]">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Mission Reflection & Verification</span>
            </h4>
            <label className="block text-xs font-mono text-blue-300">
              Question: {quest.reflectionQuestion}
            </label>

            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              disabled={quest.status === 'completed' && !!quest.reflectionAnswer}
              placeholder="Write your honest mission observations and answer here..."
              className="w-full p-3.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />

            {quest.status !== 'completed' ? (
              <button
                onClick={handleComplete}
                disabled={evaluating || !reflection.trim()}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs md:text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
              >
                {evaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Jin-Woo AI Evaluating Reflection...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT MISSION REFLECTION</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Mission Cleared · AI Evaluation Received</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{quest.aiEvaluation || 'Mission completed successfully. Hunter attributes increased.'}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
