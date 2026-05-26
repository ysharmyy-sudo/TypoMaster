import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, User, ShieldCheck, Lock } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification, sendSignInLinkToEmail, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignupWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMail = email.trim().toLowerCase();
    if (!eMail) return;

    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);

      if (!password) {
        setError('Please enter a password (or use OTP signup).');
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, eMail, password);
      if (name.trim()) {
        try {
          await updateProfile(cred.user, { displayName: name.trim() });
        } catch {
          // ignore
        }
      }
      // Verification is recommended, but we do not block access.
      try {
        await sendEmailVerification(cred.user);
      } catch {
        // ignore
      }

      setInfo('Account created successfully. You can sign in now.');
      navigate('/login');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else if (code === 'auth/email-already-in-use') setError('An account with this email already exists. Please sign in.');
      else if (code === 'auth/weak-password') setError('Password is too weak. Please use a stronger password.');
      else if (code === 'auth/operation-not-allowed')
        setError('This sign-in method is not enabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.');
      else setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupWithOtp = async () => {
    const eMail = email.trim().toLowerCase();
    if (!eMail) {
      setError('Please enter your email address.');
      return;
    }
    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);

      // Save details to apply after OTP sign-in completes on /login
      localStorage.setItem('ptt_emailForSignIn', eMail);
      if (name.trim()) localStorage.setItem('ptt_nameForSignIn', name.trim());

      await sendSignInLinkToEmail(auth, eMail, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      });

      setInfo('OTP link sent. Please check your email and open the link to finish signup.');
      navigate('/login');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else if (code === 'auth/operation-not-allowed')
        setError('Email link sign-in is not enabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.');
      else setError(err?.message || 'OTP signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-black p-8 text-center">
          <div className="bg-sky-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-black" />
          </div>
          <h1 className="text-white text-2xl font-bold">Get Started</h1>
          <p className="text-slate-400 text-sm mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSignupWithPassword} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl px-4 py-3">
              {info}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
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
            {isSubmitting ? 'Creating...' : 'Create Account'} <ArrowRight size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-500 font-semibold">OR</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <button
            type="button"
            onClick={() => void handleSignupWithOtp()}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold transition-all border ${
              isSubmitting
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            {isSubmitting ? 'Sending OTP...' : 'Sign Up with OTP (Email)'}
          </button>

          <p className="text-center text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
