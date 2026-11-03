import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Settings, User, Shield, LogOut, CheckCircle2, RotateCcw, AlertTriangle, Key, ExternalLink } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, userProfile, logout, setSelectedRoutineProfile, resetProgressTo0Percent } = useAuth();
  const [saved, setSaved] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [keyStatusMsg, setKeyStatusMsg] = useState('');

  useEffect(() => {
    const existingKey = localStorage.getItem('shadow_custom_gemini_key') || '';
    if (existingKey) {
      setApiKey(existingKey);
      setApiKeySaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem('shadow_custom_gemini_key', apiKey.trim());
    setApiKeySaved(true);
    setKeyStatusMsg('Custom Gemini API Key saved successfully! System AI is now using your key.');
    setTimeout(() => setKeyStatusMsg(''), 3500);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('shadow_custom_gemini_key');
    setApiKey('');
    setApiKeySaved(false);
    setKeyStatusMsg('Custom API key removed. Reverted to system default.');
    setTimeout(() => setKeyStatusMsg(''), 3500);
  };

  const selectedProfileId = userProfile?.selectedRoutineProfile || 'normal';

  const handleProfileChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as any;
    await setSelectedRoutineProfile(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetSystem = async () => {
    setResetting(true);
    try {
      await resetProgressTo0Percent(selectedProfileId);
      setResetSuccess(true);
      setShowConfirmReset(false);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div className="p-5 md:p-6 bg-[#101525] border border-[#1E293B] rounded-2xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>SYSTEM CONFIGURATION & PREFERENCES</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">Settings & Parameters</h2>
        <p className="text-xs text-slate-400">
          Configure default routine schedule profile, AI API key integration, physical goals, and system baseline.
        </p>
      </div>

      {/* Gemini AI API Key Integration */}
      <div className="bg-[#101525] border border-blue-500/30 rounded-2xl p-5 md:p-6 space-y-4 relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Gemini AI API Key Integration</span>
          </h3>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
            apiKeySaved ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-blue-950 text-blue-300 border border-blue-500/30'
          }`}>
            {apiKeySaved ? 'Custom Key Active' : 'System Key In Use'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Provide your personal Google Gemini API key to power all Jin-Woo AI features (System Chat, Daily Quest Evaluation, Diary Analysis, Emotion Coaching, and Reports).
        </p>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key (e.g. AIzaSy...)"
              className="w-full p-3 pr-20 bg-[#080B14] border border-[#1E293B] text-cyan-300 font-mono text-xs md:text-sm rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveApiKey}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Save API Key</span>
            </button>

            {apiKeySaved && (
              <button
                onClick={handleClearApiKey}
                className="py-2.5 px-4 bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-bold text-xs rounded-xl transition-colors"
              >
                Clear Key
              </button>
            )}

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:underline font-mono flex items-center gap-1 ml-auto"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {keyStatusMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{keyStatusMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Routine Profile Preference */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Default Schedule Routine Profile</span>
        </h3>

        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-400">Select Active Profile:</label>
          <select
            value={selectedProfileId}
            onChange={handleProfileChange}
            className="w-full sm:w-80 p-3 bg-[#080B14] border border-[#1E293B] text-blue-300 font-mono text-xs md:text-sm font-bold rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="normal">PROFILE 1: NORMAL DAY (RUNNING)</option>
            <option value="exam">PROFILE 2: EXAM DAY (PYQ FOCUS)</option>
            <option value="school">PROFILE 3: SCHOOL DAY (MON / WED / FRI)</option>
            <option value="extended">PROFILE 4: EXTENDED CRAM (TUE / THU / SAT)</option>
          </select>
          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Routine Profile updated!</span>
            </span>
          )}
        </div>
      </div>

      {/* System Baseline & Reset */}
      <div className="bg-[#101525] border border-cyan-900/40 rounded-2xl p-5 md:p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl pointer-events-none" />
        
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>System Reset & Hunter Baseline</span>
        </h3>

        <div className="p-4 bg-[#080B14] border border-blue-900/30 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">Current Hunter Progress Index:</span>
            <span className="text-cyan-300 font-bold text-sm">{(userProfile?.currentHunterIndex || 0).toFixed(4)}%</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">Current Awakening Status:</span>
            <span className="text-blue-400 font-bold">DAY {userProfile?.currentDay || 1} / 30</span>
          </div>
          <p className="text-slate-400 text-[11px] pt-1">
            If you wish to restart your journey from Day 1 at baseline <strong className="text-cyan-400">0.0000%</strong>, trigger a System Reset below.
          </p>
        </div>

        {resetSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SHADOW SYSTEM RESET COMPLETE! Progress baseline set to 0.0000% (Day 1).</span>
          </div>
        )}

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="py-2.5 px-5 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset System to Day 1 (0.0000%)</span>
          </button>
        ) : (
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-400 font-bold">CONFIRM SYSTEM RESET?</strong>
                This will reset today&apos;s progress snapshot and set your Hunter Progress Index back to 0.0000% baseline.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetSystem}
                disabled={resetting}
                className="py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset to 0%'}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                disabled={resetting}
                className="py-2 px-4 bg-[#080B14] hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Hunter Identity & Credentials</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#080B14] border border-[#1E293B] rounded-xl space-y-1">
            <span className="text-slate-500 block">Codename:</span>
            <span className="text-slate-200 font-bold text-sm">{userProfile?.displayName || 'Hunter'}</span>
          </div>

          <div className="p-3 bg-[#080B14] border border-[#1E293B] rounded-xl space-y-1">
            <span className="text-slate-500 block">Email:</span>
            <span className="text-slate-200 font-bold text-sm truncate block">{currentUser?.email || 'Guest'}</span>
          </div>

          <div className="p-3 bg-[#080B14] border border-[#1E293B] rounded-xl space-y-1">
            <span className="text-slate-500 block">System Timezone:</span>
            <span className="text-blue-300 font-bold text-sm">Asia/Kolkata (IST)</span>
          </div>

          <div className="p-3 bg-[#080B14] border border-[#1E293B] rounded-xl space-y-1">
            <span className="text-slate-500 block">Current Day:</span>
            <span className="text-blue-300 font-bold text-sm">Day {userProfile?.currentDay || 1} / 30</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="py-2.5 px-5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session / Logout</span>
        </button>
      </div>
    </motion.div>
  );
};
