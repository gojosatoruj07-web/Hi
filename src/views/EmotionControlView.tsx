import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { HeartPulse, Shield, Sparkles, Send, Clock } from 'lucide-react';
import { saveEmotionalCheckIn, getTodayDateString } from '../services/hunterStore';
import { apiFetch } from '../utils/api';

export const EmotionControlView: React.FC = () => {
  const { currentUser } = useAuth();

  const [feeling, setFeeling] = useState('');
  const [trigger, setTrigger] = useState('');
  const [reaction, setReaction] = useState('');
  const [betterResponse, setBetterResponse] = useState('');
  const [tomorrowImprovement, setTomorrowImprovement] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Breathing Exercise Timer State
  const [breathPhase, setBreathPhase] = useState<'idle' | 'in' | 'hold' | 'out'>('idle');
  const [breathSeconds, setBreathSeconds] = useState(5);

  const startBreathing = () => {
    setBreathPhase('in');
    setBreathSeconds(5);

    let sec = 5;
    const interval = setInterval(() => {
      sec -= 1;
      setBreathSeconds(sec);
      if (sec === 0) {
        clearInterval(interval);
        setBreathPhase('idle');
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !feeling.trim() || analyzing) return;
    setAnalyzing(true);

    try {
      const res = await apiFetch('/api/emotion-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling,
          trigger,
          reaction,
          betterResponse
        })
      });

      const data = await res.json();
      const feedback = data.feedback || 'Trigger analyze ho gaya. Response dene se pehle 5 seconds pause karo.';
      setAiFeedback(feedback);

      const todayStr = getTodayDateString();
      await saveEmotionalCheckIn(currentUser.uid, todayStr, {
        date: todayStr,
        feeling,
        trigger,
        reaction,
        betterResponse,
        tomorrowImprovement,
        aiFeedback: feedback,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Emotion check-in error:', err);
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
      {/* Header */}
      <div className="p-5 md:p-6 bg-[#101525] border border-[#1E293B] rounded-2xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
          <HeartPulse className="w-4 h-4 text-cyan-400" />
          <span>STOIC CONTROL & EMOTIONAL AUDIT PROTOCOL</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">Emotion Control System</h2>
        <p className="text-xs text-slate-400">
          Identify triggers, practice the 5-second pause protocol, and eliminate impulse reactions.
        </p>
      </div>

      {/* 5-Second Pause Breathing Exercise Card */}
      <div className="bg-[#101525] border border-cyan-500/30 rounded-2xl p-6 text-center space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-100 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>The 5-Second Pause Protocol</span>
          </h3>
          <p className="text-xs text-slate-400">
            When triggered, execute this 5-second breath pause before speaking or reacting.
          </p>
        </div>

        <div className="py-6 flex flex-col items-center justify-center">
          <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
            breathPhase === 'in' 
              ? 'scale-125 border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.5)]' 
              : 'border-slate-700 bg-[#080B14]'
          }`}>
            <span className="text-3xl font-black font-mono text-cyan-300">
              {breathPhase === 'idle' ? '5s' : `${breathSeconds}s`}
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-300 mt-4 uppercase font-bold">
            {breathPhase === 'in' ? 'Inhale & Pause Mind...' : 'Press Start Before Reacting'}
          </span>
        </div>

        <button
          onClick={startBreathing}
          disabled={breathPhase !== 'idle'}
          className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          Execute 5-Second Pause
        </button>
      </div>

      {/* 5-Question Daily Emotional Check-In Form */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 space-y-6">
        <div className="border-b border-[#1E293B] pb-4">
          <h3 className="text-lg font-bold text-slate-100">Daily 5-Question Emotional Check-In</h3>
          <p className="text-xs text-slate-400">
            Log your emotional reactions for Jin-Woo AI stoic feedback.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              1. What did I feel today?
            </label>
            <input
              type="text"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="e.g. Irritated, anxious, motivated, exhausted..."
              className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              2. What triggered that emotion?
            </label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. Disruption during study session..."
              className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              3. How did I react?
            </label>
            <input
              type="text"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="e.g. Reacted angrily, checked phone immediately..."
              className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              4. Could I have responded better?
            </label>
            <input
              type="text"
              value={betterResponse}
              onChange={(e) => setBetterResponse(e.target.value)}
              placeholder="e.g. Paused for 5 seconds and stayed silent..."
              className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              5. What will I improve tomorrow?
            </label>
            <input
              type="text"
              value={tomorrowImprovement}
              onChange={(e) => setTomorrowImprovement(e.target.value)}
              placeholder="e.g. Maintain 5-second buffer before responding..."
              className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs md:text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Jin-Woo AI Analyzing Trigger...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Emotional Audit</span>
              </>
            )}
          </button>
        </form>

        {aiFeedback && (
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono">
              <Shield className="w-4 h-4" />
              <span>Jin-Woo Emotional Control Analysis</span>
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{aiFeedback}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
