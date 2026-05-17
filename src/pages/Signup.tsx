import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { apiGet } from '../utils/api';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
=======
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { apiRegister } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, ArrowRight, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const { setUser, setPremium } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setInfo('');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);

      // Sync / load user profile from backend (will show emailVerified=false until user verifies)
      const res = await apiGet<{ success: boolean; user: any }>('/api/auth/me');
      if (res?.user) {
        setUser(res.user);
        setPremium(!!res.user?.isPremium);
      }

      setInfo('Signup successful. Please verify your email from Gmail, then login again.');
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
=======
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Set display name in Firebase
      await updateProfile(credential.user, { displayName: name });

      // 3. Create user document in MongoDB
      const { user: mongoUser } = await apiRegister(name);
      setUser(mongoUser);

      navigate('/');
    } catch (err: any) {
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your connection.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
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
          <p className="text-slate-400 text-sm mt-2">Join Pariksha Typing Tutor today</p>
        </div>
<<<<<<< HEAD
        
        <form onSubmit={handleSignup} className="p-8 space-y-5">
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
=======

        <form onSubmit={handleSignup} className="p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              <AlertCircle size={18} className="flex-shrink-0" />
              {error}
            </div>
          )}

>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
<<<<<<< HEAD
              <input 
                type="text" 
=======
              <input
                type="text"
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
                required
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
<<<<<<< HEAD
              <input 
                type="email" 
=======
              <input
                type="email"
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
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
<<<<<<< HEAD
              <input 
                type="password" 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
=======
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="Min. 6 characters"
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

<<<<<<< HEAD
          <button 
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
          >
            Create Account <ArrowRight size={20} />
=======
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Creating account...</>
            ) : (
              <>Create Account <ArrowRight size={20} /></>
            )}
>>>>>>> 39a96ac736ae2ec4b42279a20571ac014a6a46eb
          </button>

          <p className="text-center text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
