import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { getPersonalMemories, savePersonalMemory, deletePersonalMemory } from '../services/hunterStore';
import { PersonalMemory } from '../types/hunter';
import { Brain, Plus, Trash2, Edit2, CheckCircle2, Shield, Tag } from 'lucide-react';

export const PersonalMemoryView: React.FC = () => {
  const { currentUser } = useAuth();
  const [memories, setMemories] = useState<PersonalMemory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState<PersonalMemory['category']>('Goals');
  const [fact, setFact] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadMemories();
    }
  }, [currentUser]);

  const loadMemories = async () => {
    if (!currentUser) return;
    setLoading(true);
    const data = await getPersonalMemories(currentUser.uid);
    setMemories(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !fact.trim()) return;

    const memoryId = editingId || `mem-${Date.now()}`;
    const newMemory: PersonalMemory = {
      memoryId,
      category,
      fact: fact.trim(),
      source: 'User Input',
      updatedAt: new Date().toISOString()
    };

    await savePersonalMemory(currentUser.uid, newMemory);
    setFact('');
    setEditingId(null);
    await loadMemories();
  };

  const handleDelete = async (memoryId: string) => {
    if (!currentUser) return;
    await deletePersonalMemory(currentUser.uid, memoryId);
    await loadMemories();
  };

  const startEdit = (m: PersonalMemory) => {
    setEditingId(m.memoryId);
    setCategory(m.category);
    setFact(m.fact);
  };

  const CATEGORIES: PersonalMemory['category'][] = [
    'Profile', 'Goals', 'Habits', 'Strengths', 'Weaknesses', 'Preferences', 'Problems', 'Experiences'
  ];

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
          <Brain className="w-4 h-4 text-cyan-400" />
          <span>PERSONAL TRAIT & MEMORY RETRIEVAL BANK</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">Personal Memory System</h2>
        <p className="text-xs text-slate-400">
          Saved facts, goals, habits, and traits retrieved by Jin-Woo AI during conversations.
        </p>
      </div>

      {/* Add / Edit Form */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
        <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-400" />
          <span>{editingId ? 'Edit Saved Personal Memory' : 'Add New Personal Fact / Trait'}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-48">
              <label className="block text-xs font-mono text-slate-400 mb-1">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-[#080B14] border border-[#1E293B] text-blue-300 font-mono text-xs font-bold rounded-xl focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-mono text-slate-400 mb-1">Fact / Thought / Habit:</label>
              <input
                type="text"
                value={fact}
                onChange={(e) => setFact(e.target.value)}
                placeholder="e.g. I get easily distracted during 4 PM revision sessions..."
                className="w-full p-2.5 bg-[#080B14] border border-[#1E293B] rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              {editingId ? 'Update Memory' : 'Save Fact to System'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFact('');
                }}
                className="py-2.5 px-4 bg-[#131C31] text-slate-400 hover:text-slate-200 rounded-xl text-xs font-mono"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Memory List by Categories */}
      <div className="bg-[#101525] border border-[#1E293B] rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" />
            <span>Saved Memory Records ({memories.length})</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Context active for System Chat</span>
        </div>

        {memories.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Shield className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              No personal memories saved yet. Add your habits, goals or problems above to personalize Jin-Woo AI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {memories.map((m) => (
              <div 
                key={m.memoryId}
                className="p-3.5 bg-[#131C31] border border-[#1E293B] rounded-xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <span className="inline-block px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-500/30 rounded text-[9px] font-mono font-bold uppercase">
                    {m.category}
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">{m.fact}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(m)}
                    className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-[#101525] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.memoryId)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#101525] rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
