import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: email.split('@')[0], email });
    navigate('/');
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
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
          >
            Sign In <ArrowRight size={20} />
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
