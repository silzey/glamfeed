'use client';
import { useState } from 'react';
import './styles.css';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { setDoc, doc } from 'firebase/firestore';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.94C34.331 4.791 29.333 2 24 2C11.822 2 2 11.822 2 24s9.822 22 22 22c11.133 0 20.21-8.526 21.611-19.389l-1.012-.528z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.331 4.791 29.333 2 24 2C16.318 2 9.656 6.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 46c5.952 0 11.133-2.543 14.897-6.584l-6.522-5.027C30.594 36.686 27.536 38 24 38c-5.22 0-9.641-3.336-11.283-7.946l-6.571 4.819C9.656 41.663 16.318 46 24 46z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-0.792 2.237-2.231 4.16-4.087 5.571l6.522 5.027C41.468 35.931 44 30.291 44 24c0-1.932-0.317-3.786-0.889-5.492l-1.012-.528z" />
    </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      initiateEmailSignIn(auth, email, password);
      router.push('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Passwords don't match");
      return;
    }
    if (auth && firestore) {
      try {
        const userCredential = await initiateEmailSignUp(auth, email, password);
        if (userCredential && userCredential.user) {
          const user = userCredential.user;
          // Create a user document in Firestore
          const userRef = doc(firestore, 'users', user.uid);
          await setDoc(userRef, {
            id: user.uid,
            username: username,
            email: user.email,
            name: username, // Using username as name for simplicity
            avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`
          });
          router.push('/');
        }
      } catch (error) {
        console.error("Sign up error:", error);
        alert("Could not sign up. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = () => {
    if (auth) {
      initiateGoogleSignIn(auth);
      router.push('/');
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-html">
        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked /><label htmlFor="tab-1" className="tab">Sign In</label>
        <input id="tab-2" type="radio" name="tab" className="sign-up" /><label htmlFor="tab-2" className="tab">Sign Up</label>
        <div className="login-form">
          <form className="sign-in-htm" onSubmit={handleSignIn}>
            <div className="group">
              <label htmlFor="user" className="label">Email Address</label>
              <input 
                id="user" 
                type="text" 
                className="input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="group">
              <label htmlFor="pass" className="label">Password</label>
              <input 
                id="pass" 
                type="password" 
                className="input" 
                data-type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="group">
              <input id="check" type="checkbox" className="check" />
              <label htmlFor="check"><span className="icon"></span> Keep me Signed in</label>
            </div>
            <div className="group">
              <input type="submit" className="button" value="Sign In" />
            </div>
            <div className="hr"></div>
             <div className="group">
                <button type="button" onClick={handleGoogleSignIn} className="button flex items-center justify-center gap-2">
                    <GoogleIcon />
                    Sign In with Google
                </button>
            </div>
            <div className="foot-lnk">
              <a href="#forgot">Forgot Password?</a>
            </div>
          </form>
          <form className="sign-up-htm" onSubmit={handleSignUp}>
            <div className="group">
              <label htmlFor="user-up" className="label">Username</label>
              <input 
                id="user-up" 
                type="text" 
                className="input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="group">
              <label htmlFor="pass-up-email" className="label">Email Address</label>
              <input 
                id="pass-up-email" 
                type="text" 
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="group">
              <label htmlFor="pass-up" className="label">Password</label>
              <input 
                id="pass-up" 
                type="password" 
                className="input" 
                data-type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="group">
              <label htmlFor="pass-up-repeat" className="label">Repeat Password</label>
              <input 
                id="pass-up-repeat" 
                type="password" 
                className="input" 
                data-type="password" 
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                />
            </div>
            <div className="group">
              <input type="submit" className="button" value="Sign Up" />
            </div>
            <div className="hr"></div>
            <div className="foot-lnk">
              <label htmlFor="tab-1">Already Member?</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}