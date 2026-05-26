import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, ArrowRight, Shield, KeyRound, Lock } from 'lucide-react';
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { apiGet } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setPremium } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailToComplete, setNeedsEmailToComplete] = useState(false);

  const actionCodeSettings = useMemo(
    () => ({
      // User returns here after clicking the "OTP link" email
      url: `${window.location.origin}/login`,
      handleCodeInApp: true,
    }),
    []
  );

  const friendlyFirebaseError = (err: any) => {
    const code = err?.code || '';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
    if (code === 'auth/user-disabled') return 'This account has been disabled. Please contact support.';
    if (code === 'auth/operation-not-allowed')
      return 'Email link sign-in is not enabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.';
    if (code === 'auth/expired-action-code' || code === 'auth/invalid-action-code')
      return 'This OTP link is invalid or has expired. Please request a new one.';
    return err?.message || 'Something went wrong. Please try again.';
  };

  const finishLogin = async () => {
    // ✅ Same post-login behavior as earlier: quick redirect + background /me sync
    const u = auth.currentUser;
    if (!u) return;
    const eMail = (u.email || email).trim().toLowerCase();
    setUser({
      name: u.displayName || (eMail ? eMail.split('@')[0] : 'User'),
      email: eMail,
      emailVerified: !!u.emailVerified,
    });
    setPremium(false);
    navigate('/');

    void (async () => {
      try {
        const res = await apiGet<{ success: boolean; user: any }>('/api/auth/me');
        if (res?.user) {
          setUser(res.user);
          setPremium(!!res.user.isPremium);
        }
      } catch {
        // ignore: app will still work with fallback user
      }
    })();
  };

  const handleSendOtp = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const eMail = email.trim().toLowerCase();
    if (!eMail) return;
    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);
      await sendSignInLinkToEmail(auth, eMail, actionCodeSettings);
      localStorage.setItem('ptt_emailForSignIn', eMail);
      // Optional (used if user came from signup)
      // localStorage.setItem('ptt_nameForSignIn', name)
      setInfo('OTP link sent. Please check your email (Inbox/Spam) and open the link on this same browser to sign in.');
    } catch (err: any) {
      setError(friendlyFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMail = email.trim().toLowerCase();
    const pass = password; // keep as-is; some users may have spaces
    if (!eMail) {
      setError('Please enter your email address.');
      return;
    }
    if (!pass) {
      setError('Please enter your password (or use OTP login).');
      return;
    }
    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);
      await signInWithEmailAndPassword(auth, eMail, pass);
      await finishLogin();
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a bit and try again.');
      } else if (code === 'auth/operation-not-allowed') {
        setError(
          'Email/password sign-in is not enabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.'
        );
      } else {
        setError(friendlyFirebaseError(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteFromLink = async () => {
    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);

      const storedEmail = (localStorage.getItem('ptt_emailForSignIn') || '').trim().toLowerCase();
      const eMail = (email || storedEmail).trim().toLowerCase();
      if (!eMail) {
        setNeedsEmailToComplete(true);
        setError('Please enter your email to complete sign in.');
        return;
      }

      const cred = await signInWithEmailLink(auth, eMail, window.location.href);
      localStorage.removeItem('ptt_emailForSignIn');

      // If user started from Signup page, we may have saved a name to apply once.
      const storedName = (localStorage.getItem('ptt_nameForSignIn') || '').trim();
      if (storedName && !cred.user.displayName) {
        try {
          await updateProfile(cred.user, { displayName: storedName });
        } catch {
          // ignore
        } finally {
          localStorage.removeItem('ptt_nameForSignIn');
        }
      }

      await finishLogin();
    } catch (err: any) {
      setError(friendlyFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // If user opened the OTP link, complete sign in automatically (or ask for email if missing)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const storedEmail = (localStorage.getItem('ptt_emailForSignIn') || '').trim().toLowerCase();
      if (storedEmail) setEmail(storedEmail);
      // Auto-complete (will ask for email if not available)
      void handleCompleteFromLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-black p-8 text-center">
          <div className="bg-sky-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-black" />
          </div>
          <h1 className="text-white text-2xl font-bold">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to Pariksha Typing Tutor</p>
        </div>
        
        <form onSubmit={handlePasswordLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">
              {info}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-black text-white hover:bg-slate-900'
            }`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-500 font-semibold">OR</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold transition-all border ${
              isSubmitting
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            {isSubmitting ? 'Sending OTP...' : 'Send OTP (Email)'}
          </button>

          {needsEmailToComplete && isSignInWithEmailLink(auth, window.location.href) && (
            <button
              type="button"
              onClick={handleCompleteFromLink}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <KeyRound size={18} />
              {isSubmitting ? 'Completing...' : 'Complete Sign In'}
            </button>
          )}

          <p className="text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-sky-600 font-bold hover:underline">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
