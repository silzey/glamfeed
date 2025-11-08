'use client';
import { useState } from 'react';
import './styles.css';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/page-loader';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.94C34.331 4.791 29.333 2 24 2C11.822 2 2 11.822 2 24s9.822 22 22 22c11.133 0 20.21-8.526 21.611-19.389l-1.012-.528z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.331 4.791 29.333 2 24 2C16.318 2 9.656 6.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 46c5.952 0 11.133-2.543 14.897-6.584l-6.522-5.027C30.594 36.686 27.536 38 24 38c-5.22 0-9.641-3.336-11.283-7.946l-6.571 4.819C9.656 41.663 16.318 46 24 46z" />
        <path fill="#1565C0" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-0.792 2.237-2.231 4.166-4.087 5.571l6.522 5.027C39.587 35.92 44 28.718 44 24c0-1.582-.158-3.116-.446-4.594l-0.035-.117L43.611 20.083z" />
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

  return (
    <>
      {isLoading && <PageLoader />}
      <div className="login-wrap">
        <div className="login-html">
          <div className="login-form-container">
            <div className="login-header">
              <h1 className="text-2xl font-bold text-white">Sign In</h1>
              <p className="text-sm text-white/70">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
            <div className="login-form">
              <form onSubmit={handleSignIn}>
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
                  <input type="submit" className="button" value="Sign In" disabled={isLoading} />
                </div>
                <div className="hr"></div>
                <div className="group">
                  <button type="button" onClick={handleGoogleSignIn} className="button flex items-center justify-center gap-2" disabled={isLoading}>
                    <GoogleIcon />
                    Sign In with Google
                  </button>
                </div>
                <div className="foot-lnk">
                  <a href="#forgot">Forgot Password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
