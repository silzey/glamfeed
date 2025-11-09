
'use client';
import { useState } from 'react';
import './styles.css';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthError = (error: any) => {
    let description = 'An unexpected error occurred. Please try again.';
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                description = 'Invalid email or password. Please check your credentials or sign up.';
                break;
            case 'auth/email-already-in-use':
                description = 'An account already exists with this email address. Please sign in.';
                break;
            default:
                description = error.message;
                break;
        }
    }
    toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: description,
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await signInWithEmail(email, password);
        router.push('/');
    } catch (error) {
        handleAuthError(error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      handleAuthError(error);
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="login-body">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h1 className="text text-large">Sign In</h1>
              <p className="text text-normal">
                Don't have an account?{' '}
                <Link href="/signup" className="text text-links">
                  Sign Up
                </Link>
              </p>
            </div>
            <form name="signin" className="form" onSubmit={handleSignIn}>
              <div className="input-control">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input-field"
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
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-control">
                <input type="submit" name="submit" className="input-submit" value="Sign In" />
              </div>
            </form>
            <div className="striped">
              <span className="striped-line"></span>
              <span className="striped-text">Or</span>
              <span className="striped-line"></span>
            </div>
            <div className="method">
               <div className="method-control">
                    <Button variant="outline" className="w-full method-action" onClick={handleGoogleSignIn}>
                        <GoogleIcon />
                        <span>Sign in with Google</span>
                    </Button>
                </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
