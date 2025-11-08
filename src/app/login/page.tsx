'use client';
import { useState } from 'react';
import './styles.css';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  const auth = useAuth();
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      initiateEmailSignIn(auth, email, password);
      router.push('/');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Passwords don't match");
      return;
    }
    if (auth) {
      initiateEmailSignUp(auth, email, password);
      // Here you would typically also create a user document in Firestore
      // with the username, but that requires more setup.
      router.push('/');
    }
  };

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
