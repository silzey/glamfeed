'use client';
import { useState } from 'react';
import { useAuth, useFirestore, initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/page-loader';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import '../login/styles.css'; 
import { doc, setDoc, getDoc } from 'firebase/firestore';


const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !auth) return;
    if (password.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: 'Password must be at least 6 characters long.',
        });
        return;
    }
    setIsActionLoading(true);
    try {
      const userCredential = await initiateEmailSignUp(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        username: username,
        name: username,
        email: user.email,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.uid}`,
        createdAt: new Date(),
      });
      router.push('/');
    } catch (error: any) {
      console.error("Sign up failed", error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.code === 'auth/email-already-in-use' 
          ? 'An account already exists with this email.'
          : 'An unexpected error occurred.',
      });
    } finally {
        setIsActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!firestore || !auth) return;
    if (!termsAccepted) {
        toast({
            variant: 'destructive',
            title: 'Agreement Required',
            description: 'You must agree to the terms of service to continue.',
        });
        return;
    }
    setIsActionLoading(true);
    try {
      const userCredential = await initiateGoogleSignIn(auth);
      const user = userCredential.user;
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
            id: user.uid,
            username: user.displayName,
            name: user.displayName,
            email: user.email,
            avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            createdAt: new Date(),
        });
      }
      router.push('/');
    } catch (error) {
      console.error("Google Sign-In failed", error);
       toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
    } finally {
        setIsActionLoading(false);
    }
  };

  return (
    <>
    {isActionLoading && <PageLoader />}
    <div className="login-wrap">
      <div className="login-html">
        <div className="login-form-container">
            <div className="login-header">
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-sm text-white/70">Already have an account? <span><Link href="/login" className="text-primary hover:underline">Sign In</Link></span>
              </p>
            </div>
            <form name="signup" className="form" onSubmit={handleSignup}>
              <div className="input-control">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-control">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-control">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="input"
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
               <div className="flex items-center space-x-2 my-4">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                <label htmlFor="terms" className="text-sm text-white/70">
                    I agree to the{' '}
                    <Link href="/terms" className="underline text-primary hover:text-primary/80" target="_blank">
                        Terms of Service
                    </Link>
                    .
                </label>
              </div>
              <div className="input-control">
                <div/> 
                <input type="submit" name="submit" className="button" value="Sign Up" disabled={!termsAccepted}/>
              </div>
            </form>
            <div className="hr"></div>
            <div className="method">
               <div className="method-control">
                    <Button variant="outline" className="w-full button flex items-center justify-center gap-2" onClick={handleGoogleSignIn}>
                        <GoogleIcon />
                        <span>Sign up with Google</span>
                    </Button>
                </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    </>
  );
}
