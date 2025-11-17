import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile, InsertUserProfile } from '@shared/schema';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profile: InsertUserProfile) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileListenerRef = useRef<null | (() => void)>(null);

  const ensureUserProfileDocument = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const profileDoc = await getDoc(userDocRef);

    if (!profileDoc.exists()) {
      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: user.email ?? '',
        companyName: user.displayName || 'Admin Company',
        phoneNumber: user.phoneNumber || 'N/A',
        role: 'user',
        createdAt: Date.now(),
      };

      await setDoc(userDocRef, fallbackProfile);
      setUserProfile(fallbackProfile);
    }

    return userDocRef;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      profileListenerRef.current?.();
      setCurrentUser(user);

      if (user) {
        setLoading(true);
        try {
          const userDocRef = await ensureUserProfileDocument(user);

          profileListenerRef.current = onSnapshot(
            userDocRef,
            (snapshot) => {
              if (snapshot.exists()) {
                setUserProfile(snapshot.data() as UserProfile);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Failed to subscribe to user profile', error);
              setLoading(false);
            },
          );
        } catch (error) {
          console.error('Failed to load user profile', error);
          setUserProfile(null);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      profileListenerRef.current?.();
    };
  }, []);

  const signUp = async (email: string, password: string, profile: InsertUserProfile) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfileData: UserProfile = {
      uid: user.uid,
      email: user.email!,
      companyName: profile.companyName,
      phoneNumber: profile.phoneNumber,
      role: "user",
      createdAt: Date.now(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfileData);
    setUserProfile(userProfileData);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    profileListenerRef.current?.();
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
