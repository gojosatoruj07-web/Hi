import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { getDiaryForDate, saveDiaryEntry, getTodayDateString } from '../services/hunterStore';
import { DiaryEntry } from '../types/hunter';
import { BookOpen, Sparkles, Send, Shield } from 'lucide-react';
import { apiFetch } from '../utils/api';

export const DailyDiaryView: React.FC = () => {
  const { currentUser, userProfile, refreshUserData } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number>(userProfile?.currentDay || 1);
  const [diary, setDiary] = useState<DiaryEntry | null>(null);

  const [content, setContent] = useState('');
  const [accomplishments, setAccomplishments] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [learnings, setLearnings] = useState('');
  const [emotionNotes, setEmotionNotes] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const todayStr = getTodayDateString();

  useEffect(() => {
    if (currentUser) {
      loadDiaryData();
    }
  }, [currentUser, selectedDay]);

  const loadDiaryData = async () => {
    if (!currentUser) return;
    const existing = await getDiaryForDate(currentUser.uid, todayStr, selectedDay);
    if (existing) {
      setDiary(existing);
      setContent(existing.content || '');
      setAccomplishments(existing.accomplishments || '');
      setMistakes(existing.mistakes || '');
      setLearnings(existing.learnings || '');
      setEmotionNotes(existing.emotionNotes || '');
      if (existing.aiAnalysis) {
        setAnalysisResult({
          evaluation: existing.aiAnalysis,
          strengths: existing.strengths || [],
          weaknesses: existing.weaknesses || [],
          tomorrowObjective: existing.tomorrowPlan || ''
        });
      }
    } else {
      setDiary(null);
      setContent('');
      setAccomplishments('');
      setMistakes('');
      setLearnings('');
      setEmotionNotes('');
      setAnalysisResult(null);
    }
  };

  const handleCompleteDiary = async () => {
    if (!currentUser || !content.trim() || analyzing) return;
    setAnalyzing(true);

    try {
      const res = await apiFetch('/api/diary-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diaryContent: content,
          accomplishments,
          mistakes,
          learnings,
          emotionNotes,
          dayNumber: selectedDay
        })
      });

      const analysisData = await res.json();
      setAnalysisResult(analysisData);

      const saved = await saveDiaryEntry(currentUser.uid, todayStr, selectedDay, {
        content,
        accomplishments,
        mistakes,
        learnings,
        emotionNotes,
        aiAnalysis: analysisData.evaluation || 'Diary analyzed successfully.',
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        tomorrowPlan: analysisData.tomorrowObjective || ''
      });

      setDiary(saved);
      await refreshUserData();
    } catch (err) {
      console.error('Error completing diary:', err);
    } finally {
      setAnalyzing(false);
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
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>DAILY JOURNAL & BEHAVIOURAL AUDIT</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Day {selectedDay} Diary Entry</h2>
          <p className="text-xs text-slate-400">
            Write your honest daily reflections for Jin-Woo AI 8-attribute evaluation.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Day:</span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="px-3 py-1.5 bg-[#080B14] border border-blue-500/40 text-blue-300 rounded-xl text-sm font-mono font-bold focus:outline-none"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                Day {d} {d === userProfile?.currentDay ? '(Today)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor & Structured Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="text-sm md:text-base font-bold text-slate-100">Free Writing Journal Editor</h3>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened today? Describe your routines, focus level, interactions, challenges and thoughts..."
              className="w-full p-4 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
            />

            {/* Guided Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-blue-300 mb-1">What did I accomplish?</label>
                <input
                  type="text"
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  placeholder="e.g. Cleared 2 study blocks, ran 3km"
                  className="w-full p-2.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-red-300 mb-1">What mistakes did I make?</label>
                <input
                  type="text"
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  placeholder="e.g. Checked phone at 4 PM"
                  className="w-full p-2.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-emerald-300 mb-1">What did I learn?</label>
                <input
                  type="text"
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  placeholder="e.g. Active recall works best in AM"
                  className="w-full p-2.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-300 mb-1">How did I handle emotions?</label>
                <input
                  type="text"
                  value={emotionNotes}
                  onChange={(e) => setEmotionNotes(e.target.value)}
                  placeholder="e.g. Stayed calm during disagreement"
                  className="w-full p-2.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleCompleteDiary}
              disabled={analyzing || !content.trim()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs md:text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Jin-Woo AI Evaluating 8 Parameters...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>COMPLETE TODAY'S DIARY & TRIGGER ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: AI Analysis Card */}
        <div className="space-y-6">
          <div className="bg-[#101525] border border-blue-500/40 rounded-2xl p-5 md:p-6 space-y-4 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase pb-2 border-b border-[#1E293B]">
              <Shield className="w-4 h-4" />
              <span>Jin-Woo AI Behaviour Evaluation</span>
            </div>

            {analysisResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono text-blue-300 font-bold block mb-1">Evaluation Summary:</span>
                  <p className="text-slate-200 bg-[#080B14] p-3 rounded-xl border border-[#1E293B] italic leading-relaxed">
                    "{analysisResult.evaluation}"
                  </p>
                </div>

                {analysisResult.strengths?.length > 0 && (
                  <div>
                    <span className="font-mono text-emerald-400 font-bold block mb-1">Key Strengths Observed:</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {analysisResult.strengths.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.weaknesses?.length > 0 && (
                  <div>
                    <span className="font-mono text-amber-400 font-bold block mb-1">Weaknesses & Vulnerabilities:</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {analysisResult.weaknesses.map((w: string, idx: number) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.tomorrowObjective && (
                  <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl">
                    <span className="font-mono text-blue-300 font-bold block">Tomorrow Objective:</span>
                    <p className="text-slate-100 font-medium mt-1">{analysisResult.tomorrowObjective}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Write your journal entry and press "COMPLETE TODAY'S DIARY" to trigger AI analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
