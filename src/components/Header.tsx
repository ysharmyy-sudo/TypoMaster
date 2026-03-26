import { User } from '../types';

interface HeaderProps {
  user: User;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ user, onNavigate, currentPage }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'lessons', label: 'Lessons', icon: '📚' },
    { id: 'practice', label: 'Practice', icon: '⌨️' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'pricing', label: user.isPremium ? 'Pro' : 'Go Pro', icon: '⭐' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M10 4v4" />
                  <path d="M2 8h20" />
                  <path d="M6 4v4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TypeMaster Pro</h1>
                <p className="text-xs text-slate-500">Learn Touch Typing</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <p className="text-xs text-slate-500">Streak</p>
                  <p className="text-sm font-bold text-orange-600">{user.streak} days</p>
                </div>
              </div>
              <div className="h-8 w-px bg-orange-200" />
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <div>
                  <p className="text-xs text-slate-500">XP</p>
                  <p className="text-sm font-bold text-amber-600">{user.xp}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">Level {user.level}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-slate-200 md:hidden">
        <nav className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
