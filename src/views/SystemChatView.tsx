import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { getChatHistory, saveChatMessage, getQuestForDay, getDiaryForDate, getTodayDateString } from '../services/hunterStore';
import { ChatMessage } from '../types/hunter';
import { Send, Bot, RefreshCw, Sparkles, User as UserIcon } from 'lucide-react';
import { apiFetch } from '../utils/api';

export const SystemChatView: React.FC = () => {
  const { currentUser, userProfile, dailyProgress } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const effectiveUid = currentUser?.uid || 'guest-hunter';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadHistory();
  }, [effectiveUid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = async () => {
    const history = await getChatHistory(effectiveUid);
    if (history.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: `System Online. Welcome, ${userProfile?.displayName || 'Hunter'}.\nMain tumhara System AI companion hoon. Direct action aur daily discipline se tumhara Hunter Progress Index advance hoga. What do you need a report or advice on?`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
      await saveChatMessage(effectiveUid, welcomeMsg);
    } else {
      setMessages(history);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      await saveChatMessage(effectiveUid, userMsg);

      const todayStr = getTodayDateString();
      const currentDay = userProfile?.currentDay || 1;
      const currentQuest = await getQuestForDay(effectiveUid, currentDay);
      const diary = await getDiaryForDate(effectiveUid, todayStr, currentDay);

      const contextState = {
        userProfile,
        dailyProgress,
        currentQuest,
        diary
      };

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText.trim(),
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          contextState
        })
      });

      const data = await response.json();
      const replyContent = data.response || 'System online. Question clear nahi tha, repeat karo.';

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      await saveChatMessage(effectiveUid, assistantMsg);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'System temporarily offline. Data integrity maintained locally.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    "Abhi mera routine kitna complete hua?",
    "Main kitne % Jin-Woo jaisa bana?",
    "Aaj ka next quest kya hai?",
    "Meri sabse badi weakness kya hai?"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-135px)] md:h-[calc(100vh-110px)] bg-[#101525] border border-[#1E293B] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#080B14] border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <span>Jin-Woo System AI Companion</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </h3>
            <p className="text-[10px] font-mono text-blue-400">
              Real Data Sync Active · Electric Blue Persona
            </p>
          </div>
        </div>
        <button
          onClick={loadHistory}
          className="p-2 text-slate-400 hover:text-blue-300 hover:bg-[#131C31] rounded-lg transition-colors"
          title="Reload History"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser 
                    ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' 
                    : 'bg-blue-950 border border-blue-500/40 text-blue-300'
                }`}>
                  {isUser ? <UserIcon className="w-4 h-4" /> : 'JW'}
                </div>

                <div className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                    : 'bg-[#131C31] border border-[#1E293B] text-slate-200 rounded-tl-none shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                }`}>
                  {msg.content}
                  <span className={`block text-[9px] mt-1.5 text-right font-mono ${
                    isUser ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-300 text-xs font-bold">
              JW
            </div>
            <div className="bg-[#131C31] border border-[#1E293B] p-3 rounded-xl rounded-tl-none text-xs text-blue-400 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing live database state...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-[#080B14]/90 border-t border-[#1E293B] flex items-center gap-2 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1.5 bg-[#131C31] hover:bg-blue-950/80 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#080B14] border-t border-[#1E293B] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Consult Jin-Woo AI regarding routine, stats or weaknesses..."
          className="flex-1 px-4 py-2.5 bg-[#101525] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};
