'use client';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  Auth,
} from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initiateGoogleSignIn } from './non-blocking-login';

// The shape of the user object, extending the base Firebase User
export type AppUser = User & {
    username?: string;
    avatarUrl?: string;
    name?: string;
    postCount?: number;
    totalLikes?: number;
    totalComments?: number;
    totalShares?: number;
    coins?: number;
    isAdmin?: boolean;
};

interface AuthContextType {
  user: AppUser | null;
  isUserLoading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass:string, username:string) => Promise<any>;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  auth: Auth;
  firestore: Firestore;
}

export function AuthProvider({ children, auth, firestore }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() } as AppUser);
        } else {
           // This case is important for Google Sign-In or if a user was deleted from Firestore but not Auth
           const username = firebaseUser.email?.split('@')[0] || `user_${Date.now()}`;
           const newUser: Omit<AppUser, keyof User> = {
              name: firebaseUser.displayName || 'New User',
              username: username,
              avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
              postCount: 0,
              totalLikes: 0,
              totalComments: 0,
              totalShares: 0,
              coins: 100, // Welcome bonus
              isAdmin: false, // Default isAdmin to false for new users
              // @ts-ignore
              createdAt: serverTimestamp(),
           };
           await setDoc(userDocRef, { ...newUser, email: firebaseUser.email, id: firebaseUser.uid });
           setUser({ ...firebaseUser, ...newUser} as AppUser);
        }
      } else {
        setUser(null);
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [router, auth, firestore]);


  const signInWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signUpWithEmail = async (email: string, pass: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    const userDocRef = doc(firestore, 'users', firebaseUser.uid);
    const newUser: Omit<AppUser, keyof User> = {
      name: username,
      username: username,
      avatarUrl: `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      postCount: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      coins: 100, // Welcome bonus
      isAdmin: false, // Default isAdmin to false for new users
      // @ts-ignore
      createdAt: serverTimestamp(),
    };
    await setDoc(userDocRef, { ...newUser, email: firebaseUser.email, id: firebaseUser.uid });
    setUser({ ...firebaseUser, ...newUser} as AppUser);
    return userCredential;
  };
  

  const signInWithGoogle = async () => {
    return initiateGoogleSignIn(auth);
  };

  const signOut = () => {
    firebaseSignOut(auth).then(() => {
      router.push('/');
    });
  };

  const value = {
    user,
    isUserLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
