import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Hash, RefreshCw, ArrowRight } from 'lucide-react';
import { apiPost } from '../utils/api';
import { useAppContext } from '../context/AppContext';

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setPremium } = useAppContext();

  const initialEmail = useMemo(() => (searchParams.get('email') || '').trim().toLowerCase(), [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMail = email.trim().toLowerCase();
    const otp = code.trim();
    if (!eMail) return setError('Please enter your email.');
    if (!otp) return setError('Please enter the 6-digit code.');

    try {
      setError('');
      setInfo('');
      setIsSubmitting(true);

      const res = await apiPost<{
        success: boolean;
        token?: string;
        user?: any;
        message?: string;
      }>('/api/auth/verify-otp', { email: eMail, code: otp });

      if (!res?.success || !res?.token) throw new Error(res?.message || 'Verification failed');

      localStorage.setItem('ptt_token', res.token);
      if (res?.user) {
        setUser(res.user);
        setPremium(!!res.user.isPremium);
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    const eMail = email.trim().toLowerCase();
    if (!eMail) return setError('Please enter your email.');
    try {
      setError('');
      setInfo('');
      setIsResending(true);
      const res = await apiPost<{ success: boolean; message?: string }>('/api/auth/resend-otp', { email: eMail });
      if (!res?.success) throw new Error(res?.message || 'Unable to resend code');
      setInfo(res?.message || 'Verification code resent. Please check your email.');
    } catch (err: any) {
      setError(err?.message || 'Unable to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-black p-8 text-center">
          <div className="bg-sky-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-black" />
          </div>
          <h1 className="text-white text-2xl font-bold">Verify Email</h1>
          <p className="text-slate-400 text-sm mt-2">Enter the 6-digit code sent to your Gmail</p>
        </div>

        <form onSubmit={handleVerify} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}
          {info && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3">{info}</div>
          )}

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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none tracking-widest font-bold"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Code expires in 10 minutes (default).</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-black text-white hover:bg-slate-900'
            }`}
          >
            {isSubmitting ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={20} />
          </button>

          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={isResending}
            className={`w-full py-3 rounded-xl font-bold transition-all border flex items-center justify-center gap-2 ${
              isResending
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <RefreshCw size={18} />
            {isResending ? 'Resending...' : 'Resend Code'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-colors"
          >
            Skip for now (Login)
          </button>

          <p className="text-center text-slate-600 text-sm">
            Back to <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
