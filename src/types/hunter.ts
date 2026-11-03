export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  timezone: string;
  currentDay: number;
  currentHunterIndex: number;
  streak: number;
  selectedRoutineProfile: 'normal' | 'exam' | 'school' | 'extended';
  physicalTargets?: {
    pushups: number;
    squats: number;
    situps: number;
    runningKm: number;
  };
}

export interface RoutineTask {
  id: string;
  time: string;
  objective: string;
  completed: boolean;
  category?: 'study' | 'training' | 'rest' | 'meal' | 'routine';
  notes?: string;
}

export interface RoutineProfile {
  id: 'normal' | 'exam' | 'school' | 'extended';
  name: string;
  rank: string;
  subtitle: string;
  breakfastTime: string;
  lunchTime: string;
  workoutDirective: string;
  tasks: RoutineTask[];
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  routineProfile: string;
  routineTasks: RoutineTask[];
  completedCount: number;
  pendingCount: number;
  routineScore: number;
  questCompleted: boolean;
  mindTrainingScore: number;
  emotionalCheckInDone: boolean;
  diaryCompleted: boolean;
  hunterIndexSnapshot: number;
  physicalLogged?: {
    pushups: number;
    squats: number;
    situps: number;
    runningKm: number;
  };
}

export interface QuestItem {
  questId: string;
  dayNumber: number;
  title: string;
  category: string;
  instructions: string[];
  difficulty: 'E-RANK' | 'D-RANK' | 'C-RANK' | 'B-RANK' | 'A-RANK' | 'S-RANK';
  objective: string;
  duration: string;
  criteria: string;
  reflectionQuestion: string;
  reflectionAnswer?: string;
  aiEvaluation?: string;
  status: 'pending' | 'completed' | 'postponed';
  scheduledTimeIST?: string; // e.g. "17:30"
  deliveredAt?: string;
  completedAt?: string;
  isDelivered?: boolean;
}

export interface PersonalMemory {
  memoryId: string;
  category: 'Profile' | 'Goals' | 'Habits' | 'Strengths' | 'Weaknesses' | 'Preferences' | 'Problems' | 'Experiences';
  fact: string;
  source?: string;
  updatedAt: string;
}

export interface DailyReport {
  date: string;
  dayNumber: number;
  evaluation: string;
  strengths: string[];
  weaknesses: string[];
  mistakes: string[];
  tomorrowObjective: string;
  createdAt: string;
  hunterIndexSnapshot: number;
}

export interface DiaryEntry {
  date: string;
  dayNumber: number;
  content: string;
  accomplishments?: string;
  mistakes?: string;
  learnings?: string;
  emotionNotes?: string;
  aiAnalysis?: string;
  strengths?: string[];
  weaknesses?: string[];
  tomorrowPlan?: string;
  updatedAt?: string;
  scoreImpact?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AttributeScores {
  mentalStrength: number;
  physicalFitness: number;
  discipline: number;
  emotionalControl: number;
  observation: number;
  memory: number;
  logicalThinking: number;
  problemSolving: number;
  focus: number;
  confidence: number;
  communication: number;
  strategicThinking: number;
}

export interface WeeklyReport {
  weekId: string;
  weekNumber: number;
  summary: string;
  scores: AttributeScores;
  recommendations: string[];
  createdAt: string;
}

export interface EmotionalCheckIn {
  date: string;
  feeling: string;
  trigger: string;
  reaction: string;
  betterResponse: string;
  tomorrowImprovement: string;
  aiFeedback?: string;
  createdAt: string;
}
