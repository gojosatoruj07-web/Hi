import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { 
  UserProfile, 
  DailyProgress, 
  QuestItem, 
  DiaryEntry, 
  ChatMessage, 
  RoutineTask, 
  AttributeScores, 
  PersonalMemory,
  DailyReport,
  EmotionalCheckIn
} from '../types/hunter';
import { ROUTINE_PROFILES, DAILY_PHYSICAL_PDF_GOALS } from '../data/routineData';
import { DAILY_QUESTS_30_DAYS } from '../data/questsData';

// Local Storage Helper Utilities for Instant Offline Persistence
const LOCAL_STORAGE_KEYS = {
  PROFILE: 'shadow_user_profile',
  PROGRESS_PREFIX: 'shadow_daily_progress_',
  QUEST_PREFIX: 'shadow_quest_',
  DIARY_PREFIX: 'shadow_diary_',
  MEMORIES: 'shadow_personal_memories',
  CHAT: 'shadow_chat_messages',
  EMOTION_PREFIX: 'shadow_emotion_',
  REPORT_PREFIX: 'shadow_report_'
};

function getLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  return new Intl.DateTimeFormat('en-CA', options).format(now);
}

export function getCurrentISTTime(): { hours: number; minutes: number; totalMinutes: number; timeString: string } {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
  let hours = 0;
  let minutes = 0;
  parts.forEach(p => {
    if (p.type === 'hour') hours = parseInt(p.value, 10);
    if (p.type === 'minute') minutes = parseInt(p.value, 10);
  });
  const totalMinutes = hours * 60 + minutes;
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return { hours, minutes, totalMinutes, timeString };
}

export const INITIAL_SCORES: AttributeScores = {
  mentalStrength: 15,
  physicalFitness: 12,
  discipline: 10,
  emotionalControl: 14,
  observation: 15,
  memory: 12,
  logicalThinking: 14,
  problemSolving: 12,
  focus: 10,
  confidence: 11,
  communication: 13,
  strategicThinking: 12,
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  // Check local storage first
  const localProf = getLocal<UserProfile>(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`);
  if (localProf) {
    // Attempt background Firestore sync
    getDoc(doc(db, 'users', uid)).then(snap => {
      if (snap.exists()) setLocal(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`, snap.data());
    }).catch(() => {});
    return localProf;
  }

  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      setLocal(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`, data);
      return data;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function createUserProfile(uid: string, displayName: string, email: string): Promise<UserProfile> {
  const newProfile: UserProfile = {
    uid,
    displayName: displayName || 'Hunter',
    email,
    createdAt: new Date().toISOString(),
    timezone: 'Asia/Kolkata',
    currentDay: 1,
    currentHunterIndex: 0.0000,
    streak: 1,
    selectedRoutineProfile: 'normal',
    physicalTargets: { ...DAILY_PHYSICAL_PDF_GOALS }
  };

  setLocal(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`, newProfile);

  try {
    await setDoc(doc(db, 'users', uid), newProfile);
  } catch (err) {
    // Firestore optional
  }
  return newProfile;
}

export async function resetSystemToDay0(uid: string, profileId: string = 'normal'): Promise<UserProfile> {
  const todayStr = getTodayDateString();

  const resetProfileData: UserProfile = {
    uid,
    displayName: 'Hunter',
    email: '',
    createdAt: new Date().toISOString(),
    timezone: 'Asia/Kolkata',
    currentDay: 1,
    currentHunterIndex: 0.0000,
    streak: 1,
    selectedRoutineProfile: profileId as any,
    physicalTargets: { ...DAILY_PHYSICAL_PDF_GOALS }
  };

  setLocal(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`, resetProfileData);

  const profile = ROUTINE_PROFILES[profileId] || ROUTINE_PROFILES.normal;
  const resetProgress: DailyProgress = {
    date: todayStr,
    routineProfile: profileId,
    routineTasks: profile.tasks.map(t => ({ ...t, completed: false })),
    completedCount: 0,
    pendingCount: profile.tasks.length,
    routineScore: 0,
    questCompleted: false,
    mindTrainingScore: 0,
    emotionalCheckInDone: false,
    diaryCompleted: false,
    hunterIndexSnapshot: 0.0000,
    physicalLogged: {
      pushups: 0,
      squats: 0,
      situps: 0,
      runningKm: 0,
    }
  };

  setLocal(`${LOCAL_STORAGE_KEYS.PROGRESS_PREFIX}${uid}_${todayStr}`, resetProgress);

  try {
    await updateDoc(doc(db, 'users', uid), {
      currentDay: 1,
      currentHunterIndex: 0.0000,
      streak: 1,
      selectedRoutineProfile: profileId
    });
    await setDoc(doc(db, 'users', uid, 'dailyProgress', todayStr), resetProgress);
  } catch (err) {
    // Local fallback maintained
  }

  return resetProfileData;
}

export async function getOrCreateDailyProgress(uid: string, dateStr: string, profileId: string = 'normal'): Promise<DailyProgress> {
  const localKey = `${LOCAL_STORAGE_KEYS.PROGRESS_PREFIX}${uid}_${dateStr}`;
  const localProg = getLocal<DailyProgress>(localKey);
  if (localProg) {
    return localProg;
  }

  const profile = ROUTINE_PROFILES[profileId] || ROUTINE_PROFILES.normal;
  const initialProgress: DailyProgress = {
    date: dateStr,
    routineProfile: profileId,
    routineTasks: profile.tasks.map(t => ({ ...t, completed: false })),
    completedCount: 0,
    pendingCount: profile.tasks.length,
    routineScore: 0,
    questCompleted: false,
    mindTrainingScore: 0,
    emotionalCheckInDone: false,
    diaryCompleted: false,
    hunterIndexSnapshot: 0.0000,
    physicalLogged: {
      pushups: 0,
      squats: 0,
      situps: 0,
      runningKm: 0,
    }
  };

  setLocal(localKey, initialProgress);

  try {
    const ref = doc(db, 'users', uid, 'dailyProgress', dateStr);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as DailyProgress;
      setLocal(localKey, data);
      return data;
    }
    await setDoc(ref, initialProgress);
  } catch (err) {
    // Local storage fallback
  }

  return initialProgress;
}

export async function updateDailyTasks(
  uid: string, 
  dateStr: string, 
  tasks: RoutineTask[],
  userProfile: UserProfile
): Promise<{ progress: DailyProgress; newHunterIndex: number }> {
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const routineScore = Math.round((completedCount / (tasks.length || 1)) * 100);

  const taskDelta = completedCount * 0.00005;
  const newHunterIndex = parseFloat((userProfile.currentHunterIndex + taskDelta).toFixed(6));

  const localKey = `${LOCAL_STORAGE_KEYS.PROGRESS_PREFIX}${uid}_${dateStr}`;
  const currentLocal = getLocal<DailyProgress>(localKey) || {
    date: dateStr,
    routineProfile: userProfile.selectedRoutineProfile || 'normal',
    routineTasks: tasks,
    completedCount,
    pendingCount,
    routineScore,
    questCompleted: false,
    mindTrainingScore: 0,
    emotionalCheckInDone: false,
    diaryCompleted: false,
    hunterIndexSnapshot: newHunterIndex,
    physicalLogged: { pushups: 0, squats: 0, situps: 0, runningKm: 0 }
  };

  const updatedProgress: DailyProgress = {
    ...currentLocal,
    routineTasks: tasks,
    completedCount,
    pendingCount,
    routineScore,
    hunterIndexSnapshot: newHunterIndex
  };

  setLocal(localKey, updatedProgress);

  const updatedProfile: UserProfile = {
    ...userProfile,
    currentHunterIndex: newHunterIndex
  };
  setLocal(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`, updatedProfile);

  try {
    const ref = doc(db, 'users', uid, 'dailyProgress', dateStr);
    await updateDoc(ref, {
      routineTasks: tasks,
      completedCount,
      pendingCount,
      routineScore,
      hunterIndexSnapshot: newHunterIndex,
    });

    await updateDoc(doc(db, 'users', uid), {
      currentHunterIndex: newHunterIndex
    });
  } catch (err) {
    // Local update succeeds
  }

  return {
    progress: updatedProgress,
    newHunterIndex
  };
}

export async function updatePhysicalLogged(
  uid: string,
  dateStr: string,
  logged: { pushups: number; squats: number; situps: number; runningKm: number }
) {
  const localKey = `${LOCAL_STORAGE_KEYS.PROGRESS_PREFIX}${uid}_${dateStr}`;
  const currentLocal = getLocal<DailyProgress>(localKey);
  if (currentLocal) {
    currentLocal.physicalLogged = logged;
    setLocal(localKey, currentLocal);
  }

  try {
    const ref = doc(db, 'users', uid, 'dailyProgress', dateStr);
    await updateDoc(ref, { physicalLogged: logged });
  } catch (err) {
    // Local fallback
  }
}

export async function getQuestForDay(uid: string, dayNumber: number): Promise<QuestItem> {
  const questId = `q-day-${dayNumber}`;
  const localKey = `${LOCAL_STORAGE_KEYS.QUEST_PREFIX}${uid}_${questId}`;
  const localQuest = getLocal<QuestItem>(localKey);
  if (localQuest) return localQuest;

  const defaultQuest = DAILY_QUESTS_30_DAYS.find(q => q.dayNumber === dayNumber) || DAILY_QUESTS_30_DAYS[0];
  setLocal(localKey, defaultQuest);

  try {
    const ref = doc(db, 'users', uid, 'quests', questId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as QuestItem;
      setLocal(localKey, data);
      return data;
    }
    await setDoc(ref, defaultQuest);
  } catch (err) {
    // Local fallback
  }

  return defaultQuest;
}

export async function completeQuest(
  uid: string,
  questId: string,
  answer: string,
  aiEvaluation: string,
  userProfile: UserProfile
): Promise<number> {
  const newIndex = parseFloat((userProfile.currentHunterIndex + 0.0001).toFixed(6));
  const localKey = `${LOCAL_STORAGE_KEYS.QUEST_PREFIX}${uid}_${questId}`;
  
  const quest = getLocal<QuestItem>(localKey) || DAILY_QUESTS_30_DAYS[0];
  const updatedQuest: QuestItem = {
    ...quest,
    status: 'completed',
    reflectionAnswer: answer,
    aiEvaluation: aiEvaluation,
    completedAt: new Date().toISOString()
  };
  setLocal(localKey, updatedQuest);

  const updatedProfile: UserProfile = { ...userProfile, currentHunterIndex: newIndex };
  setLocal(`${LOCAL_STORAGE_KEYS.PROFILE}_${uid}`, updatedProfile);

  try {
    await updateDoc(doc(db, 'users', uid, 'quests', questId), {
      status: 'completed',
      reflectionAnswer: answer,
      aiEvaluation: aiEvaluation,
      completedAt: new Date().toISOString()
    });

    await updateDoc(doc(db, 'users', uid), {
      currentHunterIndex: newIndex
    });
  } catch (err) {
    // Local fallback
  }

  return newIndex;
}

export async function getDiaryForDate(uid: string, dateStr: string, dayNumber: number): Promise<DiaryEntry | null> {
  const localKey = `${LOCAL_STORAGE_KEYS.DIARY_PREFIX}${uid}_${dateStr}`;
  const localEntry = getLocal<DiaryEntry>(localKey);
  if (localEntry) return localEntry;

  try {
    const ref = doc(db, 'users', uid, 'diaries', dateStr);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as DiaryEntry;
      setLocal(localKey, data);
      return data;
    }
  } catch (err) {
    // Local fallback
  }
  return null;
}

export async function saveDiaryEntry(
  uid: string,
  dateStr: string,
  dayNumber: number,
  entryData: Partial<DiaryEntry>
): Promise<DiaryEntry> {
  const localKey = `${LOCAL_STORAGE_KEYS.DIARY_PREFIX}${uid}_${dateStr}`;
  const existing = getLocal<DiaryEntry>(localKey);

  const fullEntry: DiaryEntry = {
    date: dateStr,
    dayNumber,
    content: entryData.content || existing?.content || '',
    accomplishments: entryData.accomplishments || existing?.accomplishments || '',
    mistakes: entryData.mistakes || existing?.mistakes || '',
    learnings: entryData.learnings || existing?.learnings || '',
    emotionNotes: entryData.emotionNotes || existing?.emotionNotes || '',
    aiAnalysis: entryData.aiAnalysis || existing?.aiAnalysis || '',
    strengths: entryData.strengths || existing?.strengths || [],
    weaknesses: entryData.weaknesses || existing?.weaknesses || [],
    tomorrowPlan: entryData.tomorrowPlan || existing?.tomorrowPlan || '',
    updatedAt: new Date().toISOString()
  };

  setLocal(localKey, fullEntry);

  try {
    const ref = doc(db, 'users', uid, 'diaries', dateStr);
    await setDoc(ref, fullEntry);
  } catch (err) {
    // Local fallback
  }

  return fullEntry;
}

// Personal Memory Management
export async function getPersonalMemories(uid: string): Promise<PersonalMemory[]> {
  const localKey = `${LOCAL_STORAGE_KEYS.MEMORIES}_${uid}`;
  const localList = getLocal<PersonalMemory[]>(localKey);
  if (localList) return localList;

  try {
    const colRef = collection(db, 'users', uid, 'personalMemory');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => d.data() as PersonalMemory);
    setLocal(localKey, list);
    return list;
  } catch (err) {
    return [];
  }
}

export async function savePersonalMemory(uid: string, memory: PersonalMemory): Promise<void> {
  const localKey = `${LOCAL_STORAGE_KEYS.MEMORIES}_${uid}`;
  const current = getLocal<PersonalMemory[]>(localKey) || [];
  const updated = [memory, ...current.filter(m => m.memoryId !== memory.memoryId)];
  setLocal(localKey, updated);

  try {
    const docRef = doc(db, 'users', uid, 'personalMemory', memory.memoryId);
    await setDoc(docRef, memory);
  } catch (err) {
    // Local fallback
  }
}

export async function deletePersonalMemory(uid: string, memoryId: string): Promise<void> {
  const localKey = `${LOCAL_STORAGE_KEYS.MEMORIES}_${uid}`;
  const current = getLocal<PersonalMemory[]>(localKey) || [];
  const updated = current.filter(m => m.memoryId !== memoryId);
  setLocal(localKey, updated);

  try {
    const docRef = doc(db, 'users', uid, 'personalMemory', memoryId);
    await deleteDoc(docRef);
  } catch (err) {
    // Local fallback
  }
}

// Daily Combined Development Report Management
export async function getDailyReport(uid: string, dateStr: string): Promise<DailyReport | null> {
  const localKey = `${LOCAL_STORAGE_KEYS.REPORT_PREFIX}${uid}_${dateStr}`;
  const localRep = getLocal<DailyReport>(localKey);
  if (localRep) return localRep;

  try {
    const ref = doc(db, 'users', uid, 'dailyReports', dateStr);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as DailyReport;
      setLocal(localKey, data);
      return data;
    }
  } catch (err) {
    // Local fallback
  }
  return null;
}

export async function saveDailyReport(uid: string, report: DailyReport): Promise<void> {
  const localKey = `${LOCAL_STORAGE_KEYS.REPORT_PREFIX}${uid}_${report.date}`;
  setLocal(localKey, report);

  try {
    const ref = doc(db, 'users', uid, 'dailyReports', report.date);
    await setDoc(ref, report);
  } catch (err) {
    // Local fallback
  }
}

export async function getChatHistory(uid: string): Promise<ChatMessage[]> {
  const localKey = `${LOCAL_STORAGE_KEYS.CHAT}_${uid}`;
  const localMsgs = getLocal<ChatMessage[]>(localKey);
  if (localMsgs) return localMsgs;

  try {
    const colRef = collection(db, 'users', uid, 'conversations', 'default', 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'), limit(50));
    const snap = await getDocs(q);
    const list = snap.docs.map(docSnap => docSnap.data() as ChatMessage);
    setLocal(localKey, list);
    return list;
  } catch (err) {
    return [];
  }
}

export async function saveChatMessage(uid: string, msg: ChatMessage): Promise<void> {
  const localKey = `${LOCAL_STORAGE_KEYS.CHAT}_${uid}`;
  const current = getLocal<ChatMessage[]>(localKey) || [];
  const updated = [...current, msg];
  setLocal(localKey, updated);

  try {
    const docRef = doc(db, 'users', uid, 'conversations', 'default', 'messages', msg.id);
    await setDoc(docRef, msg);
  } catch (err) {
    // Local fallback
  }
}

export async function saveEmotionalCheckIn(uid: string, dateStr: string, data: EmotionalCheckIn): Promise<void> {
  const localKey = `${LOCAL_STORAGE_KEYS.EMOTION_PREFIX}${uid}_${dateStr}`;
  setLocal(localKey, data);

  try {
    const docRef = doc(db, 'users', uid, 'emotionalCheckIns', dateStr);
    await setDoc(docRef, data);
  } catch (err) {
    // Local fallback
  }
}
