import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { BrainCircuit, Eye, Hash, Binary, Lightbulb, Play, RotateCcw, CheckCircle2, Award } from 'lucide-react';

export const MindTrainingView: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeModule, setActiveModule] = useState<'obs' | 'mem' | 'logic' | 'prob' | 'focus'>('obs');

  // Observation Module State
  const [obsStarted, setObsStarted] = useState(false);
  const [obsCountdown, setObsCountdown] = useState(15);
  const [obsRecallItems, setObsRecallItems] = useState<string[]>([]);
  const [obsInput, setObsInput] = useState('');
  const [obsScore, setObsScore] = useState<number | null>(null);

  const OBS_ITEMS = ['Shadow Blade', 'Mana Crystal', 'Key of Monarch', 'System Terminal', 'Rune Stone', 'Black Cloak', 'Dagger', 'Gate Portal', 'Magic Ring', 'Dungeon Map'];

  useEffect(() => {
    let timer: any;
    if (obsStarted && obsCountdown > 0) {
      timer = setInterval(() => setObsCountdown(prev => prev - 1), 1000);
    } else if (obsCountdown === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [obsStarted, obsCountdown]);

  const startObs = () => {
    setObsStarted(true);
    setObsCountdown(15);
    setObsScore(null);
    setObsRecallItems([]);
    setObsInput('');
  };

  const submitObs = () => {
    const entered = obsInput.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const correct = OBS_ITEMS.filter(item => entered.includes(item.toLowerCase())).length;
    const accuracy = Math.round((correct / OBS_ITEMS.length) * 100);
    setObsScore(accuracy);
  };

  // Memory Sequence Module State
  const [memSequence, setMemSequence] = useState<number[]>([]);
  const [memShowing, setMemShowing] = useState(false);
  const [memInput, setMemInput] = useState('');
  const [memScore, setMemScore] = useState<number | null>(null);

  const startMem = () => {
    const seq = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setMemSequence(seq);
    setMemShowing(true);
    setMemScore(null);
    setMemInput('');
    setTimeout(() => {
      setMemShowing(false);
    }, 5000);
  };

  const submitMem = () => {
    const entered = memInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    let correct = 0;
    for (let i = 0; i < memSequence.length; i++) {
      if (entered[i] === memSequence[i]) correct++;
    }
    const accuracy = Math.round((correct / memSequence.length) * 100);
    setMemScore(accuracy);
  };

  // Focus Timer Module State
  const [focusSeconds, setFocusSeconds] = useState(1500); // 25 mins
  const [focusActive, setFocusActive] = useState(false);
  const [distractions, setDistractions] = useState(0);

  useEffect(() => {
    let timer: any;
    if (focusActive && focusSeconds > 0) {
      timer = setInterval(() => setFocusSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [focusActive, focusSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>COGNITIVE ENHANCEMENT LABORATORY</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">Mind Training Protocols</h2>
        <p className="text-xs text-slate-400">
          5 independent modules to sharpen observation, memory, logic, problem-solving and deep focus.
        </p>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'obs', label: '1. Observation', icon: Eye },
          { id: 'mem', label: '2. Memory', icon: Hash },
          { id: 'logic', label: '3. Logical Thinking', icon: Binary },
          { id: 'prob', label: '4. Problem Solving', icon: Lightbulb },
          { id: 'focus', label: '5. Deep Focus', icon: Play },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'bg-[#101525] border border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 text-blue-300" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Module 1: Observation */}
      {activeModule === 'obs' && (
        <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 space-y-6">
          <div className="space-y-1 border-b border-[#1E293B] pb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span>Visual Observation & Detail Recall</span>
            </h3>
            <p className="text-xs text-slate-400">
              Memorize the 10 items shown below within 15 seconds. Then enter all items from memory.
            </p>
          </div>

          {!obsStarted ? (
            <button
              onClick={startObs}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs md:text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              Start 15s Observation Test
            </button>
          ) : obsCountdown > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-blue-400 font-bold">Memorize Items:</span>
                <span className="text-sm font-mono font-black text-amber-400">{obsCountdown}s remaining</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {OBS_ITEMS.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#131C31] border border-blue-500/40 rounded-xl text-center text-xs font-bold text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-mono text-emerald-400 font-bold">Time Up! Recalled Items Input:</div>
              <p className="text-xs text-slate-400">Enter items separated by commas:</p>
              <input
                type="text"
                value={obsInput}
                onChange={(e) => setObsInput(e.target.value)}
                placeholder="Shadow Blade, Key of Monarch, Dungeon Map..."
                className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={submitObs}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all"
              >
                Calculate Accuracy Score
              </button>

              {obsScore !== null && (
                <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-blue-300 font-bold block">Observation Score Result:</span>
                  <div className="text-2xl font-black font-mono text-blue-200">{obsScore}% Accuracy</div>
                  <p className="text-xs text-slate-400">Verified and updated in System records.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Module 2: Memory */}
      {activeModule === 'mem' && (
        <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 space-y-6">
          <div className="space-y-1 border-b border-[#1E293B] pb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" />
              <span>Number Sequence Retention</span>
            </h3>
            <p className="text-xs text-slate-400">
              8 random numbers will flash for 5 seconds. Re-enter the exact sequence in order.
            </p>
          </div>

          {!memShowing && memSequence.length === 0 ? (
            <button
              onClick={startMem}
              className="py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs md:text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Flash Number Sequence
            </button>
          ) : memShowing ? (
            <div className="space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold">Memorize Sequence (5s):</span>
              <div className="flex flex-wrap items-center justify-center gap-3 p-6 bg-[#080B14] rounded-2xl border border-cyan-500/40">
                {memSequence.map((num, idx) => (
                  <span key={idx} className="text-2xl md:text-3xl font-black font-mono text-cyan-300 px-3 py-1 bg-[#131C31] rounded-lg">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold">Enter Sequence (separated by commas):</span>
              <input
                type="text"
                value={memInput}
                onChange={(e) => setMemInput(e.target.value)}
                placeholder="42, 87, 12, 95..."
                className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitMem}
                  className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs transition-all"
                >
                  Verify Accuracy
                </button>
                <button
                  onClick={startMem}
                  className="py-2.5 px-4 bg-[#131C31] hover:bg-[#1a2542] border border-[#1E293B] text-slate-300 rounded-xl text-xs font-bold"
                >
                  New Sequence
                </button>
              </div>

              {memScore !== null && (
                <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-cyan-300 font-bold block">Memory Score Result:</span>
                  <div className="text-2xl font-black font-mono text-cyan-200">{memScore}% Accuracy</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Module 5: Focus Timer */}
      {activeModule === 'focus' && (
        <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-8 space-y-6 text-center">
          <div className="space-y-1 border-b border-[#1E293B] pb-4 text-left">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              <span>Deep Focus & Distraction Tracker</span>
            </h3>
            <p className="text-xs text-slate-400">
              25-minute Pomodoro deep work sprint. Record every impulse distraction.
            </p>
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            <div className="text-5xl md:text-6xl font-black font-mono text-blue-300 tracking-tight bg-[#080B14] py-8 px-6 rounded-2xl border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] system-blue-glow">
              {formatTime(focusSeconds)}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setFocusActive(!focusActive)}
                className={`py-3 px-8 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  focusActive 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                }`}
              >
                {focusActive ? 'Pause Session' : 'Start Focus Session'}
              </button>

              <button
                onClick={() => {
                  setFocusActive(false);
                  setFocusSeconds(1500);
                  setDistractions(0);
                }}
                className="p-3 bg-[#131C31] border border-[#1E293B] text-slate-400 hover:text-slate-200 rounded-xl"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-[#080B14] border border-[#1E293B] rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Distractions Logged:</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-amber-400">{distractions}</span>
                <button
                  onClick={() => setDistractions(prev => prev + 1)}
                  className="px-2.5 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-lg"
                >
                  + Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module 3 & 4 */}
      {(activeModule === 'logic' || activeModule === 'prob') && (
        <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase font-mono text-blue-400">
            {activeModule === 'logic' ? 'Logical Deduction Scenario' : 'Scenario Consequence Decision Tree'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-[#080B14] p-4 rounded-xl border border-[#1E293B]">
            {activeModule === 'logic' 
              ? 'Problem: Five subjects sit in a row. Subject A is left of B, C is right of D, B is adjacent to D. Find exact order without trial-and-error.'
              : 'Scenario: Exam is in 3 days. Subject A needs 6 hours revision, Subject B needs 8 hours. You have 10 hours available. How do you divide time for maximum score yield?'}
          </p>
          <textarea
            rows={3}
            placeholder="Enter your logical reasoning and step-by-step solution..."
            className="w-full p-3 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
            Submit Solution
          </button>
        </div>
      )}
    </motion.div>
  );
};
