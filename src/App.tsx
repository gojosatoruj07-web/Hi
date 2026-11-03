import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { DesktopSidebar, MobileBottomNav } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { QuestSchedulerBanner } from './components/QuestSchedulerBanner';

import { DashboardView } from './views/DashboardView';
import { SystemChatView } from './views/SystemChatView';
import { DailyQuestsView } from './views/DailyQuestsView';
import { DailyRoutineView } from './views/DailyRoutineView';
import { MindTrainingView } from './views/MindTrainingView';
import { EmotionControlView } from './views/EmotionControlView';
import { DailyDiaryView } from './views/DailyDiaryView';
import { PersonalMemoryView } from './views/PersonalMemoryView';
import { AnalysisView } from './views/AnalysisView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B14] flex items-center justify-center text-blue-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-bold tracking-widest uppercase">INITIALIZING SHADOW SYSTEM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <div className="flex flex-1">
        <DesktopSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8 space-y-6">
          <QuestSchedulerBanner onOpenQuest={() => setCurrentTab('quests')} />

          {currentTab === 'dashboard' && <DashboardView onNavigate={setCurrentTab} />}
          {currentTab === 'chat' && <SystemChatView />}
          {currentTab === 'quests' && <DailyQuestsView />}
          {currentTab === 'routine' && <DailyRoutineView />}
          {currentTab === 'mind' && <MindTrainingView />}
          {currentTab === 'emotion' && <EmotionControlView />}
          {currentTab === 'diary' && <DailyDiaryView />}
          {currentTab === 'memory' && <PersonalMemoryView />}
          {currentTab === 'analysis' && <AnalysisView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
