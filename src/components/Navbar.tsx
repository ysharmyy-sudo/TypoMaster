import { Link, useNavigate } from 'react-router-dom';
import { Keyboard, Gamepad2, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="bg-sky-500 p-2 rounded-lg group-hover:bg-sky-400 transition-colors">
          <Keyboard size={24} className="text-black" />
        </div>
        <span className="text-2xl font-bold tracking-tighter">PARIKSHA<span className="text-sky-400">TUTOR</span></span>
      </Link>

      <div className="hidden md:flex items-center space-x-8 font-medium">
        <Link to="/exams" className="hover:text-sky-400 transition-colors">Exams</Link>
        <Link to="/tests" className="hover:text-sky-400 transition-colors">Test</Link>
        <Link to="/games" className="hover:text-sky-400 transition-colors flex items-center gap-2">
          <Gamepad2 size={18} /> Games
        </Link>
        <Link to="/pricing" className="bg-sky-500 hover:bg-sky-400 text-black px-4 py-1.5 rounded-full transition-colors text-sm font-bold shadow-lg shadow-sky-500/20">
          Go Premium
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors">
              <User size={18} />
              <span className="text-sm">{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-sky-400 transition-colors">Login</Link>
            <Link to="/signup" className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-sky-100 transition-colors">
              Join Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
