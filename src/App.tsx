import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Trophy, 
  Target, 
  Zap, 
  Flame, 
  Award, 
  Lock, 
  ChevronRight, 
  Star, 
  BarChart2, 
  BookOpen, 
  Play,
  LogOut,
  Mail,
  Facebook,
  User as UserIcon,
  ShieldCheck,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
// --- Types ---
type View = 'auth' | 'username' | 'dashboard' | 'lesson' | 'pricing' | 'stats' | 'games';

interface User {
  id: string;
  email: string;
  username?: string;
  provider: 'google' | 'facebook' | 'email';
  xp: number;
  level: number;
  wpm: number;
  accuracy: number;
  streak: number;
  triesLeft: number;
  isPremium: boolean;
  unlockedLessons: number;
}

// --- Mock Lessons ---
const LESSONS = [
  { id: 1, title: 'Home Row: Left Hand', content: 'asdf asdf asdf asdf', xp: 50 },
  { id: 2, title: 'Home Row: Right Hand', content: 'jkl; jkl; jkl; jkl;', xp: 50 },
  { id: 3, title: 'Home Row: Both Hands', content: 'asdf jkl; asdf jkl;', xp: 100 },
  { id: 4, title: 'G & H Keys', content: 'asdfgh jkl; gh gh gh', xp: 100 },
  { id: 5, title: 'Top Row: QWERT', content: 'qwert qwert qwert qwert', xp: 150 },
];

const PRICING_PLANS = [
  { id: 'monthly', name: 'Monthly', price: 99, period: 'month', tag: null },
  { id: 'quarterly', name: 'Quarterly', price: 299, period: '3 months', tag: null },
  { id: 'semi-annual', name: 'Semi-Annual', price: 499, period: '6 months', tag: 'Most Valuable' },
  { id: 'annual', name: 'Annual', price: 999, period: '12 months', tag: 'Most Popular' },
];

// --- Main App Component ---
export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [user, setUser] = useState<User | null>(null);
  const [currentLesson, setCurrentLesson] = useState<typeof LESSONS[0] | null>(null);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('typomaster_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setView(parsed.username ? 'dashboard' : 'username');
    }
  }, []);

  // Save user to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('typomaster_user', JSON.stringify(user));
    }
  }, [user]);

 const handleAuth = async (email: string, password: string) => {
  try {
    if (authMode === 'signup') {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      alert("Verification email sent! Check your inbox.");
      setAuthMode('login');
    } else {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        alert("Please verify your email first!");
        return;
      }

      const newUser: User = {
        id: userCred.user.uid,
        email: userCred.user.email || "",
        provider: 'email',
        xp: 0,
        level: 1,
        wpm: 0,
        accuracy: 0,
        streak: 0,
        triesLeft: 3,
        isPremium: false,
        unlockedLessons: 1
      };

      await fetch("https://https://typomaster-backend.onrender.com/api/auth/save", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    uid: newUser.id,
    email: newUser.email,
  }),
});

setUser(newUser);
setView('username');
    }
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
  alert("Email already exists");
} else if (err.code === "auth/invalid-email") {
  alert("Invalid email");
} else {
  alert(err.message);
}
  }
};
  const handlePayment = (price: number) => {
 const options = {
  key: "rzp_test_SVl54zdp8hFeMa", // 🔥 apni test API key daal
  amount: price * 100, // ₹499 (paise me hota hai)
  currency: "INR",
  name: "TypoMaster Pro",
  description: "Premium Upgrade",

  handler: function (response: any) {
    alert("Payment Successful ✅");

    setUser((prev: any) => ({
      ...prev,
      isPremium: true
    }));
  },

  prefill: {
    email: user?.email || "",
  },

  theme: {
    color: "#3399cc",
  },
};

const rzp = new (window as any).Razorpay(options);
rzp.open();
};

  const handleSetUsername = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const username = formData.get('username') as string;

  if (user && username) {

    // 🔥 backend me save
    await fetch("https://https://typomaster-backend.onrender.com/api/auth/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.id,
        username: username,
      }),
    });

    setUser({ ...user, username });
    setView('dashboard');
  }
};

  const startLesson = (lesson: typeof LESSONS[0]) => {
    if (!user) return;
    if (user.triesLeft <= 0 && !user.isPremium) {
      setView('pricing');
      return;
    }
    setCurrentLesson(lesson);
    setTypedText('');
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 0 });
    setView('lesson');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    
    setTypedText(value);

    // Calculate accuracy
    const lessonText = currentLesson?.content || '';
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === lessonText[i]) correctChars++;
    }
    const accuracy = value.length > 0 ? (correctChars / value.length) * 100 : 100;

    // Calculate WPM
    const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
    const wpm = timeElapsed > 0 ? (value.length / 5) / timeElapsed : 0;

    setStats({ wpm: Math.round(wpm), accuracy: Math.round(accuracy) });

    if (value === lessonText) {
      completeLesson();
    }
  };

  const completeLesson = () => {
    if (!user || !currentLesson) return;
    
    const isNewUnlock = currentLesson.id === user.unlockedLessons;
    const updatedUser: User = {
      ...user,
      xp: user.xp + currentLesson.xp,
      level: Math.floor((user.xp + currentLesson.xp) / 500) + 1,
      triesLeft: user.isPremium ? user.triesLeft : Math.max(0, user.triesLeft - 1),
      unlockedLessons: isNewUnlock ? user.unlockedLessons + 1 : user.unlockedLessons,
      wpm: Math.max(user.wpm, stats.wpm),
      accuracy: Math.max(user.accuracy, stats.accuracy)
    };
    
    setUser(updatedUser);
    setTimeout(() => {
      setView('dashboard');
      setCurrentLesson(null);
    }, 1500);
  };

const handlePurchase = () => {
  if (!user) {
    alert("Please login first!");
    return;
  }

  alert("Processing payment...");

  setTimeout(() => {
    alert("🎉 Payment Successful! You are now Premium!");

    const updatedUser = {
      ...user,
      isPremium: true,
    };

    setUser(updatedUser);
    localStorage.setItem("typomaster_user", JSON.stringify(updatedUser));

    setView("dashboard");
  }, 1000);
};

  // --- Render Functions ---

  const renderAuth = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Keyboard className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">TypoMaster Pro</h1>
          <p className="text-slate-500 mt-2">
            {authMode === 'login' ? 'Welcome back! Please login.' : 'Create your account to start.'}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authMode === 'signup' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign Up
          </button>
          <button 
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authMode === 'login' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Login
          </button>
        </div>

        <div className="space-y-4">
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-slate-700"
          >
            <Mail className="w-5 h-5 text-red-500" />
            Continue with Google
          </button>
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-xl hover:bg-blue-600 transition-colors font-medium shadow-sm"
          >
            <Facebook className="w-5 h-5" />
            Continue with Facebook
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span>
          </div>
        </div>

        <form
  className="space-y-4"
  onSubmit={(e) => {
    e.preventDefault();
    handleAuth(email, password);
  }}
>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <input 
            required
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <input 
              required
              type="password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
          >
            {authMode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );

  const renderUsernameSetup = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-sky-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome to the Club!</h2>
          <p className="text-slate-500">Let's set up your profile</p>
        </div>

        <form onSubmit={handleSetUsername} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Unique Username</label>
            <input 
              name="username"
              required
              type="text" 
              placeholder="TypingNinja_24"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Account Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
            <p className="text-xs text-gray-400 mt-2">Create a secure password for your TypoMaster ID.</p>
          </div>
          <button 
            type="submit"
            className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
          >
            Start Typing!
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <Keyboard className="text-sky-600 w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-slate-900">TypoMaster</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {user?.level}</span>
                <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden border border-gray-200">
                  <div 
                    className="h-full bg-sky-500 rounded-full" 
                    style={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
                  ></div>
                </div>
              </div>
              {!user?.isPremium && (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
                  <Zap className="w-4 h-4" />
                  {user?.triesLeft} Free Tries
                </div>
              )}
              {user?.isPremium && (
                <div className="flex items-center gap-1 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  Pro Member
                </div>
              )}
            </div>
            <button 
              onClick={() => { localStorage.removeItem('typomaster_user'); setUser(null); setView('auth'); }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user?.username}!</h2>
            <p className="text-gray-500">Ready to improve your speed today?</p>
          </div>
          {!user?.isPremium && (
            <button 
              onClick={() => setView('pricing')}
              className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-700 transition-transform hover:scale-105 shadow-lg shadow-sky-200"
            >
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Top WPM', value: user?.wpm || 0, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { label: 'Accuracy', value: `${user?.accuracy || 0}%`, icon: Target, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'XP Points', value: user?.xp || 0, icon: Star, color: 'text-sky-500', bg: 'bg-sky-50' },
            { label: 'Day Streak', value: user?.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              Your Path
            </h3>
            {LESSONS.map((lesson) => {
              const isLocked = lesson.id > (user?.unlockedLessons || 1);
              return (
                <div 
                  key={lesson.id}
                  onClick={() => !isLocked && startLesson(lesson)}
                  className={`
                    group relative bg-white p-5 rounded-2xl border transition-all cursor-pointer
                    ${isLocked ? 'opacity-60 grayscale' : 'hover:border-sky-500 hover:shadow-md'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                        ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-sky-50 text-sky-600'}
                      `}>
                        {lesson.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-500">{lesson.xp} XP • Typing Practice</p>
                      </div>
                    </div>
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <div className="bg-gray-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-sky-600 fill-sky-600" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-600" />
                Achievements
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'First Steps', desc: 'Complete Lesson 1', done: (user?.unlockedLessons || 0) > 1 },
                  { name: 'Speedster', desc: 'Reach 40 WPM', done: (user?.wpm || 0) >= 40 },
                  { name: 'Perfect', desc: '100% Accuracy', done: (user?.accuracy || 0) === 100 },
                ].map((ach, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ach.done ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-300'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${ach.done ? 'text-slate-900' : 'text-gray-400'}`}>{ach.name}</p>
                      <p className="text-xs text-gray-400">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-600 to-sky-800 p-6 rounded-2xl text-white shadow-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Monthly Leaderboard
              </h3>
              <p className="text-sky-100 text-sm mb-4">You are currently in the top 15% of all typists.</p>
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg text-sm font-bold backdrop-blur-sm">
                View Ranking
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderLesson = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <button onClick={() => setView('dashboard')} className="text-gray-500 hover:text-slate-900 font-bold flex items-center gap-1">
          <ChevronRight className="rotate-180 w-5 h-5" /> Back
        </button>
        <h2 className="font-bold text-slate-900">{currentLesson?.title}</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-bold text-sky-600">{stats.wpm} WPM</span>
          <span className="font-bold text-green-600">{stats.accuracy}% ACC</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 mb-8 relative overflow-hidden">
            {/* Visual Text Rendering */}
            <div className="text-3xl font-mono tracking-widest text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
              {currentLesson?.content.split('').map((char, i) => {
                let color = 'text-gray-300';
                if (i < typedText.length) {
                  color = typedText[i] === char ? 'text-green-500' : 'text-red-500 bg-red-50';
                }
                return <span key={i} className={color}>{char}</span>;
              })}
            </div>

            <input 
              autoFocus
              value={typedText}
              onChange={handleTyping}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-slate-900">{stats.wpm}</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Words Per Min</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-slate-900">{stats.accuracy}%</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Accuracy</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <BarChart2 className="w-6 h-6 text-sky-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-slate-900">
                {Math.round((typedText.length / (currentLesson?.content.length || 1)) * 100)}%
              </p>
              <p className="text-xs font-bold text-gray-400 uppercase">Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-600 font-bold uppercase tracking-widest text-sm">TypoMaster Pro</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6">Unleash Your Full Potential</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            You've used all your free lessons. Upgrade now to unlock all levels, advanced games, and professional certifications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`
                bg-white rounded-3xl p-8 border-2 transition-all relative flex flex-col
                ${plan.tag ? 'border-sky-500 shadow-xl scale-105 z-10' : 'border-gray-100 hover:border-sky-200'}
              `}
            >
              {plan.tag && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap
                  ${plan.id === 'annual' ? 'bg-sky-600' : 'bg-emerald-500'}
                `}>
                  {plan.tag}
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-gray-400 font-medium">/{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Lessons', 'All 15 Typing Games', 'Certificate of Completion', 'Detailed Analytics'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handlePayment(plan.price)}
                className={`
                  w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                  ${plan.tag ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-200' : 'bg-gray-100 text-slate-900 hover:bg-gray-200'}
                `}
              >
                <CreditCard className="w-5 h-5" />
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => setView('dashboard')}
            className="text-gray-400 font-bold hover:text-gray-600 transition-colors underline decoration-2 underline-offset-4"
          >
            Continue with Free Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-slate-900">
      {view === 'auth' && renderAuth()}
      {view === 'username' && renderUsernameSetup()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'lesson' && renderLesson()}
      {view === 'pricing' && renderPricing()}
    </div>
  );
}
