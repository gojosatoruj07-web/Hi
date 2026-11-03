import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { 
  getUserProfile, 
  createUserProfile, 
  getOrCreateDailyProgress, 
  getTodayDateString,
  resetSystemToDay0
} from '../services/hunterStore';
import { UserProfile, DailyProgress } from '../types/hunter';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  dailyProgress: DailyProgress | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setSelectedRoutineProfile: (profileId: 'normal' | 'exam' | 'school' | 'extended') => Promise<void>;
  resetProgressTo0Percent: (profileId?: 'normal' | 'exam' | 'school' | 'extended') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserData = async (user: User) => {
    try {
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = await createUserProfile(
          user.uid, 
          user.displayName || user.email?.split('@')[0] || 'Hunter', 
          user.email || ''
        );
      }
      setUserProfile(profile);

      const todayStr = getTodayDateString();
      const progress = await getOrCreateDailyProgress(user.uid, todayStr, profile.selectedRoutineProfile || 'normal');
      setDailyProgress(progress);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserData(user);
      } else {
        setUserProfile(null);
        setDailyProgress(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
      await loadUserData(currentUser);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await createUserProfile(cred.user.uid, name, email);
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setDailyProgress(null);
  };

  const setSelectedRoutineProfile = async (profileId: 'normal' | 'exam' | 'school' | 'extended') => {
    if (!currentUser || !userProfile) return;
    const todayStr = getTodayDateString();
    const updatedProfile = { ...userProfile, selectedRoutineProfile: profileId };
    setUserProfile(updatedProfile);

    // Get or create progress for new profile
    const progress = await getOrCreateDailyProgress(currentUser.uid, todayStr, profileId);
    setDailyProgress(progress);
  };

  const resetProgressTo0Percent = async (profileId: 'normal' | 'exam' | 'school' | 'extended' = 'normal') => {
    if (!currentUser) return;
    const freshProfile = await resetSystemToDay0(currentUser.uid, profileId);
    setUserProfile(freshProfile);
    const todayStr = getTodayDateString();
    const progress = await getOrCreateDailyProgress(currentUser.uid, todayStr, profileId);
    setDailyProgress(progress);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      dailyProgress,
      loading,
      refreshUserData,
      loginWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      logout,
      setSelectedRoutineProfile,
      resetProgressTo0Percent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
