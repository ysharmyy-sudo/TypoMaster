import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, ArrowRight, Shield, Lock } from 'lucide-react';
import { apiPost } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setPremium } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMail = email.trim().toLowerCase();
    const pass = password; // keep as-is; some users may have spaces
    if (!eMail) {
      setError('Please enter your email address.');
      return;
    }
    if (!pass) {
      setError('Please enter your password.');
      return;
    }
    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);
      const res = await apiPost<{
        success: boolean;
        token?: string;
        user?: any;
        message?: string;
      }>('/api/auth/login', { email: eMail, password: pass });

      if (!res?.success || !res?.token) throw new Error(res?.message || 'Login failed');

      localStorage.setItem('ptt_token', res.token);
      if (res?.user) {
        setUser(res.user);
        setPremium(!!res.user.isPremium);
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
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

          <p className="text-center text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-sky-600 font-bold hover:underline">Create Account</Link>
          </p>
          <p className="text-center text-slate-500 text-xs">
            If you just signed up, verify your email code on the{' '}
            <Link to={`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`} className="text-sky-600 font-bold hover:underline">
              Verify page
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
