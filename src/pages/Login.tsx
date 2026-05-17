import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
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
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async () => {
    const e = email.trim().toLowerCase();
    if (!e) {
      setError('Pehle apna email address daalo, phir Reset Password dabao.');
      return;
    }
    try {
      setError('');
      setInfo('');
      setIsResetting(true);
      await sendPasswordResetEmail(auth, e);
      setInfo('Password reset mail send ho gaya hai. Gmail me inbox/spam check karo.');
    } catch (err: any) {
      setError(err?.message || 'Reset password failed');
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);
      const eMail = email.trim().toLowerCase();
      const pass = password; // keep as-is; some users may have spaces
      const cred = await signInWithEmailAndPassword(auth, eMail, pass);
      // NOTE: Email verification ko login-blocker mat banao (deadline-friendly).
      // Agar user verify nahi hai, to bhi login allow karein; bas info dikha dein.
      if (!cred.user.emailVerified) {
        setInfo('Note: Aapka email abhi verify nahi hai. Login ho jayega, lekin security ke liye verification recommended hai.');
        // Best-effort: resend verification email (agar Firebase allow kare).
        try { await sendEmailVerification(cred.user); } catch { /* ignore */ }
      }

      // ✅ Deadline-friendly: redirect immediately after Firebase login.
      // Backend profile fetch ko background me run karo taaki Render cold start / network delay se login block na ho.
      setUser({
        name: cred.user.displayName || email.split('@')[0],
        email: eMail,
        emailVerified: !!cred.user.emailVerified,
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
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Email ya password galat hai (ya account exist nahi karta). “Reset Password” try karo.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Firebase me Email/Password sign-in enable nahi hai. Firebase Console → Authentication → Sign-in method me enable karo.');
      } else {
        setError(err?.message || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
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
                required
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

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isResetting}
            className={`w-full py-3 rounded-xl font-bold transition-all border ${
              isResetting
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            {isResetting ? 'Sending reset mail...' : 'Reset Password'}
          </button>

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
