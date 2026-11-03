import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCurrentISTTime } from '../services/hunterStore';
import { Clock, Zap, Swords, Bell, ShieldCheck } from 'lucide-react';

interface QuestSchedulerBannerProps {
  onOpenQuest: () => void;
}

export const QuestSchedulerBanner: React.FC<QuestSchedulerBannerProps> = ({ onOpenQuest }) => {
  const [istTime, setIstTime] = useState(getCurrentISTTime());
  const [secondsToNextSlot, setSecondsToNextSlot] = useState<number>(0);
  const [inWindow, setInWindow] = useState<boolean>(false);
  const [newQuestAlert, setNewQuestAlert] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const timeData = getCurrentISTTime();
      setIstTime(timeData);

      const h = timeData.hours;
      const m = timeData.minutes;
      const totalM = timeData.totalMinutes;

      // Delivery window: 17:00 (5 PM) to 21:00 (9 PM) IST
      const is5PMto9PM = totalM >= 1020 && totalM <= 1260;
      setInWindow(is5PMto9PM);

      // Calculate next 30m slot (e.g., if m is 12, next slot is at 30m. If m is 40, next slot is at 60m)
      const minutesToNext = 30 - (m % 30);
      const nowSecs = new Date().getSeconds();
      const secs = minutesToNext * 60 - nowSecs;
      setSecondsToNextSlot(secs > 0 ? secs : 0);

      // Trigger alert on slot boundary
      if (m % 30 === 0 && nowSecs < 5 && is5PMto9PM) {
        setNewQuestAlert(true);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {/* Incoming Quest Alert Pop-up */}
      <AnimatePresence>
        {newQuestAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="p-4 bg-gradient-to-r from-blue-900/90 via-cyan-950/90 to-blue-900/90 border-2 border-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center animate-bounce">
                <Swords className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase block">SYSTEM NOTIFICATION</span>
                <h4 className="text-sm font-extrabold text-white">30-Minute Quest Dispatch Arrived!</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNewQuestAlert(false);
                  onOpenQuest();
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.6)]"
              >
                Accept Mission
              </button>
              <button
                onClick={() => setNewQuestAlert(false)}
                className="px-2.5 py-2 text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dynamic Scheduler Status Bar */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-bold">IST Time: {istTime.timeString}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                inWindow 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-blue-950 text-blue-300 border border-blue-500/30'
              }`}>
                {inWindow ? '5 PM - 9 PM WINDOW ACTIVE' : 'PROTECTED SCHEDULE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {inWindow 
                ? '30-minute delivery interval active · Non-conflicting dispatch' 
                : 'School/Cram school non-interrupt mode active · Next window 5:00 PM IST'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 bg-[#080B14] px-3.5 py-2 rounded-xl border border-[#1E293B]">
          <span className="text-slate-400 text-[10px]">Next 30M Dispatch:</span>
          <span className="text-blue-300 font-bold font-mono text-sm tracking-wider">
            {formatCountdown(secondsToNextSlot)}
          </span>
        </div>
      </div>
    </div>
  );
};
