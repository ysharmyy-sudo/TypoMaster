import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, User, ShieldCheck, Lock, Phone } from 'lucide-react';
import { apiPost } from '../utils/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMail = email.trim().toLowerCase();
    const ph = phone.trim();
    const nm = name.trim();

    if (!eMail) return setError('Please enter your email address.');
    if (!ph) return setError('Please enter your phone number.');
    if (!password || password.length < 6) return setError('Password must be at least 6 characters.');

    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);

      const res = await apiPost<{ success: boolean; message?: string }>('/api/auth/signup', {
        email: eMail,
        phone: ph,
        password,
        name: nm,
      });

      if (!res?.success) throw new Error(res?.message || 'Signup failed');
      setInfo('Verification code sent to your email. Please verify to finish signup.');
      navigate(`/verify?email=${encodeURIComponent(eMail)}`);
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.');
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name (optional)</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="tel"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">We will email you a 6-digit verification code.</p>
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
