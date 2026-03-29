import { useState, useEffect, useRef, useCallback } from "react";
import {
  Keyboard, Trophy, Target, Zap, Flame, Award, Lock,
  ChevronRight, Star, BookOpen, Play, LogOut,
  Facebook, User as UserIcon, ShieldCheck, CreditCard,
  CheckCircle2, BarChart2, Gamepad2, Home, ArrowLeft,
  Timer, Shuffle, RefreshCw, Crown
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const LESSONS = [
  { id: 1, title: "Home Row: Left Hand",  content: "asdf asdf asdf asdf",    xp: 50  },
  { id: 2, title: "Home Row: Right Hand", content: "jkl; jkl; jkl; jkl;",    xp: 50  },
  { id: 3, title: "Home Row: Both Hands", content: "asdf jkl; asdf jkl;",    xp: 100 },
  { id: 4, title: "G & H Keys",           content: "asdfgh jkl; gh gh gh",    xp: 100 },
  { id: 5, title: "Top Row: QWERT",       content: "qwert qwert qwert qwert", xp: 150 },
];

const PRICING_PLANS = [
  { id: "monthly",     name: "Monthly",     price: 99,  period: "month",     tag: null            },
  { id: "quarterly",   name: "Quarterly",   price: 299, period: "3 months",  tag: null            },
  { id: "semi-annual", name: "Semi-Annual", price: 499, period: "6 months",  tag: "Most Valuable" },
  { id: "annual",      name: "Annual",      price: 999, period: "12 months", tag: "Most Popular"  },
];

const SPEED_WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say",
  "her","she","or","an","will","my","one","all","would","there","their","what",
  "so","up","out","if","about","who","get","which","go","me","when","make",
  "can","like","time","no","just","him","know","take",
];

const SCRAMBLE_WORDS = [
  { word: "keyboard", hint: "You type on this"          },
  { word: "typing",   hint: "What you are doing"        },
  { word: "finger",   hint: "You use these to type"     },
  { word: "speed",    hint: "How fast you go"           },
  { word: "practice", hint: "What makes perfect"        },
  { word: "master",   hint: "Expert level"              },
  { word: "accuracy", hint: "How correct you are"       },
  { word: "rhythm",   hint: "The beat of your typing"   },
  { word: "lesson",   hint: "Something you learn"       },
  { word: "letters",  hint: "Alphabet characters"       },
];

function doScramble(word) {
  const a = word.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join("") === word ? doScramble(word) : a.join("");
}

// ─── SHARED INPUT STYLE (white text, visible on dark bg) ─────────────────────
const INP =
  "w-full px-4 py-3 rounded-xl border border-blue-800 bg-[#0d1424] " +
  "text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 " +
  "focus:ring-2 focus:ring-blue-500/30 transition-all text-base";

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, color }) {
  if (!msg) return null;
  return (
    <div
      style={{ background: color || "#2563eb" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl
                 font-bold text-sm text-white shadow-2xl"
    >
      {msg}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function NavBar({ user, view, setView, onLogout }) {
  const items = [
    { id: "dashboard", icon: Home,      label: "Home"  },
    { id: "stats",     icon: BarChart2, label: "Stats" },
    { id: "games",     icon: Gamepad2,  label: "Games" },
    { id: "pricing",   icon: Crown,     label: "Pro"   },
  ];
  return (
    <header className="bg-[#060b16] border-b border-blue-900/50 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setView("dashboard")} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center
                          shadow-[0_0_14px_rgba(37,99,235,0.6)]">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight">TypoMaster</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map(it => (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === it.id
                  ? "bg-blue-600/25 text-blue-300 border border-blue-500/40"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <it.icon className="w-4 h-4" />{it.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Lv {user?.level || 1}
            </span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
              />
            </div>
          </div>
          {user?.isPremium
            ? <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400
                               border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3 h-3" />Pro
              </span>
            : <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400
                               border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">
                <Zap className="w-3 h-3" />{user?.triesLeft ?? 3} tries
              </span>
          }
          <button
            onClick={onLogout}
            className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#060b16]
                      border-t border-blue-900/50 flex">
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => setView(it.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold
                        transition-all ${view === it.id ? "text-blue-400" : "text-slate-600"}`}
          >
            <it.icon className="w-5 h-5" />{it.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ─── AUTH PAGE ───────────────────────────────────────────────────────────────
// FIX 1 : Google button = white bg (brand-correct), Facebook = solid #1877F2
// FIX 2 : Email/password inputs use text-white with dark bg → always visible
function AuthPage({ onGoogle, onFacebook, onEmail }) {
  const [mode, setMode]         = useState("signup");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#060b16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]
                      bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px]
                      bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center
                          mx-auto mb-4 shadow-[0_0_40px_rgba(37,99,235,0.5)]">
            <Keyboard className="text-white w-9 h-9" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">TypoMaster</h1>
          <p className="text-slate-500 mt-2 text-sm">Master your keyboard. Unlock your speed.</p>
        </div>

        <div className="bg-[#0b1223] border border-blue-900/50 rounded-2xl p-8 shadow-2xl">
          {/* Sign Up / Login tabs */}
          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-blue-900/30">
            {["signup", "login"].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  mode === m
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m === "signup" ? "Sign Up" : "Login"}
              </button>
            ))}
          </div>

          {/* ── GOOGLE: white bg, full opacity, real G SVG ── */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={onGoogle}
              className="w-full flex items-center justify-center gap-3 py-3
                         bg-white hover:bg-gray-100 border border-gray-300
                         rounded-xl font-semibold text-sm text-gray-800
                         transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* ── FACEBOOK: solid #1877F2, full opacity, real FB SVG ── */}
            <button
              type="button"
              onClick={onFacebook}
              className="w-full flex items-center justify-center gap-3 py-3
                         bg-[#1877F2] hover:bg-[#166FE5]
                         rounded-xl font-semibold text-sm text-white
                         transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99
                         4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43
                         c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235
                         v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532
                         3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-900/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0b1223] px-3 text-slate-600 text-xs uppercase
                               font-bold tracking-widest">or</span>
            </div>
          </div>

          {/* Email form — FIX 3: inputs have text-white + dark bg */}
          <form
            onSubmit={e => { e.preventDefault(); onEmail(email, password, mode, setMode); }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase
                                tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={INP}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase
                                tracking-widest mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={INP}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold
                         py-3 rounded-xl transition-all active:scale-95
                         shadow-[0_0_20px_rgba(37,99,235,0.35)]"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-700 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── USERNAME PAGE ────────────────────────────────────────────────────────────
// FIX: "Start Typing!" button is a proper submit button inside a form
function UsernamePage({ onSetUsername, onBack }) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd]           = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!username.trim()) return;
    // Call parent with the username value directly
    onSetUsername(username.trim());
  };

  return (
    <div className="min-h-screen bg-[#060b16] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white
                     mb-6 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="bg-[#0b1223] border border-blue-900/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full
                            flex items-center justify-center mx-auto mb-4">
              <UserIcon className="text-blue-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome to the Club!</h2>
            <p className="text-slate-500 mt-2 text-sm">Set up your profile to get started</p>
          </div>

          {/* ── form with proper onSubmit ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase
                                tracking-widest mb-2">Unique Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="TypingNinja_24"
                className={INP}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase
                                tracking-widest mb-2">Account Password</label>
              <input
                type="password"
                required
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                placeholder="••••••••"
                className={INP}
              />
              <p className="text-xs text-slate-600 mt-2">
                Create a secure password for your TypoMaster ID.
              </p>
            </div>

            {/* ── FIX: type="submit" so Enter + click both work ── */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold
                         py-3 rounded-xl transition-all active:scale-95
                         shadow-[0_0_20px_rgba(37,99,235,0.35)]"
            >
              Start Typing! 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, setView, onStartLesson }) {
  const statCards = [
    { label: "Top WPM",   value: user?.wpm || 0,          icon: Zap,    c: "text-yellow-400", bg: "bg-yellow-500/10", b: "border-yellow-500/20" },
    { label: "Accuracy",  value: `${user?.accuracy || 0}%`,icon: Target, c: "text-green-400",  bg: "bg-green-500/10",  b: "border-green-500/20"  },
    { label: "XP Points", value: user?.xp || 0,           icon: Star,   c: "text-blue-400",   bg: "bg-blue-500/10",   b: "border-blue-500/20"   },
    { label: "Streak",    value: `${user?.streak || 0}d`,  icon: Flame,  c: "text-orange-400", bg: "bg-orange-500/10", b: "border-orange-500/20" },
  ];
  const achievements = [
    { name: "First Steps",   desc: "Complete Lesson 1", done: (user?.unlockedLessons || 0) > 1 },
    { name: "Speedster",     desc: "Reach 40 WPM",      done: (user?.wpm || 0) >= 40 },
    { name: "Perfectionist", desc: "100% Accuracy",     done: (user?.accuracy || 0) === 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">
            Welcome back, <span className="text-blue-400">{user?.username}</span>!
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Ready to push your limits today?</p>
        </div>
        {!user?.isPremium && (
          <button
            onClick={() => setView("pricing")}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                       text-white font-bold px-5 py-2.5 rounded-xl transition-all
                       shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
          >
            <Crown className="w-4 h-4" /> Upgrade to Pro
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className={`bg-[#0b1223] border ${s.b} rounded-2xl p-4 flex items-center gap-4`}>
            <div className={`${s.bg} border ${s.b} p-3 rounded-xl`}>
              <s.icon className={`${s.c} w-5 h-5`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-white mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lessons */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-400" /> Your Learning Path
          </h3>
          <div className="space-y-3">
            {LESSONS.map(lesson => {
              const locked = lesson.id > (user?.unlockedLessons || 1);
              return (
                <button
                  key={lesson.id}
                  onClick={() => !locked && onStartLesson(lesson)}
                  disabled={locked}
                  className={`w-full text-left bg-[#0b1223] border border-blue-900/40
                             rounded-2xl p-5 transition-all ${
                    locked
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:border-blue-500/50 hover:bg-blue-900/10 cursor-pointer group"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                                       font-black text-sm ${
                        locked
                          ? "bg-white/5 text-slate-600"
                          : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      }`}>{lesson.id}</div>
                      <div>
                        <p className="font-bold text-white text-sm">{lesson.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{lesson.xp} XP · Typing Practice</p>
                      </div>
                    </div>
                    {locked
                      ? <Lock className="w-4 h-4 text-slate-600" />
                      : <div className="opacity-0 group-hover:opacity-100 transition-opacity
                                         bg-blue-600/20 p-2 rounded-lg">
                          <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                        </div>
                    }
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick play */}
          <div className="bg-[#0b1223] border border-blue-500/20 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Gamepad2 className="w-4 h-4 text-blue-400" /> Quick Play
            </h3>
            <div className="space-y-2">
              {[
                { label: "Speed Test",    view: "games" },
                { label: "Word Scramble", view: "games" },
              ].map(g => (
                <button
                  key={g.label}
                  onClick={() => setView(g.view)}
                  className="w-full flex items-center justify-between px-4 py-3
                             bg-blue-600/10 border border-blue-500/20
                             hover:border-blue-500/60 hover:bg-blue-600/20
                             rounded-xl transition-all group text-sm font-bold text-white"
                >
                  {g.label}
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-blue-400" /> Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    a.done
                      ? "bg-yellow-400/10 border border-yellow-400/20"
                      : "bg-white/3 border border-blue-900/30"
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${a.done ? "text-yellow-400" : "text-slate-700"}`} />
                  <div>
                    <p className={`text-sm font-bold ${a.done ? "text-white" : "text-slate-600"}`}>{a.name}</p>
                    <p className="text-xs text-slate-600">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard CTA */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-5 rounded-2xl
                          text-white border border-blue-500/20 shadow-xl">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4" /> Monthly Leaderboard
            </h3>
            <p className="text-blue-200 text-xs mb-3">You are in the top 15% of all typists.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 transition-colors
                               py-2 rounded-lg text-sm font-bold">
              View Ranking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LESSON PAGE ──────────────────────────────────────────────────────────────
// FIX: typed text rendered as coloured spans; hidden input captures keystrokes
function LessonPage({ lesson, onComplete, onBack }) {
  const [typed, setTyped]       = useState("");
  const [startTime, setStart]   = useState(null);
  const [stats, setStats]       = useState({ wpm: 0, accuracy: 0 });
  const [finished, setFinished] = useState(false);
  const inputRef                = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = e => {
    const val = e.target.value;
    if (finished) return;
    if (!startTime) setStart(Date.now());
    setTyped(val);

    const text = lesson.content;
    let ok = 0;
    for (let i = 0; i < val.length; i++) if (val[i] === text[i]) ok++;
    const accuracy = val.length > 0 ? Math.round((ok / val.length) * 100) : 100;
    const elapsed  = startTime ? (Date.now() - startTime) / 60000 : 0;
    const wpm      = elapsed > 0 ? Math.round((val.length / 5) / elapsed) : 0;
    setStats({ wpm, accuracy });

    if (val === text) {
      setFinished(true);
      setTimeout(() => onComplete({ wpm, accuracy, xp: lesson.xp, lessonId: lesson.id }), 1200);
    }
  };

  const progress = Math.min(100, Math.round((typed.length / lesson.content.length) * 100));

  return (
    <div className="min-h-screen bg-[#060b16] flex flex-col">
      {/* Header */}
      <header className="bg-[#0b1223] border-b border-blue-900/50 px-4 py-3
                         flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-400 hover:text-white
                     text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="font-bold text-white text-sm">{lesson.title}</span>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-blue-400">{stats.wpm} WPM</span>
          <span className="text-green-400">{stats.accuracy}%</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-blue-950">
        <div className="h-full bg-blue-500 transition-all duration-150"
             style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">

          {/* ── Typing display ── */}
          {/* Characters are coloured spans; hidden input drives state */}
          <div
            className="bg-[#0b1223] border border-blue-900/50 rounded-3xl p-10 mb-6
                       cursor-text select-none shadow-2xl relative"
            onClick={() => inputRef.current?.focus()}
          >
            <p className="text-2xl font-mono tracking-widest leading-relaxed break-all">
              {lesson.content.split("").map((ch, i) => {
                let cls;
                if (i < typed.length) {
                  cls = typed[i] === ch
                    ? "text-green-400"                       // correct
                    : "text-red-400 bg-red-500/20 rounded";  // wrong
                } else if (i === typed.length) {
                  cls = "text-white border-b-2 border-blue-400 animate-pulse"; // cursor pos
                } else {
                  cls = "text-slate-600";                    // not yet typed
                }
                return <span key={i} className={cls}>{ch}</span>;
              })}
            </p>

            {/* Hidden input – captures all keystrokes */}
            <input
              ref={inputRef}
              value={typed}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          {finished && (
            <p className="text-center text-green-400 font-black text-xl mb-4 animate-pulse">
              ✅ Lesson Complete!
            </p>
          )}

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Zap,       label: "WPM",      val: stats.wpm,        c: "text-yellow-400" },
              { icon: Target,    label: "Accuracy",  val: `${stats.accuracy}%`, c: "text-green-400" },
              { icon: BarChart2, label: "Progress",  val: `${progress}%`,   c: "text-blue-400"  },
            ].map((s, i) => (
              <div key={i} className="bg-[#0b1223] border border-blue-900/40 rounded-2xl
                                      p-4 text-center">
                <s.icon className={`w-5 h-5 ${s.c} mx-auto mb-2`} />
                <p className="text-xl font-black text-white">{s.val}</p>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-300
                         transition-colors text-sm font-semibold"
            >
              <Home className="w-4 h-4" /> Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STATS PAGE ───────────────────────────────────────────────────────────────
function StatsPage({ user, setView }) {
  const bars = [
    { label: "WPM",      val: user?.wpm || 0,      max: 150, color: "bg-yellow-400" },
    { label: "Accuracy", val: user?.accuracy || 0,  max: 100, color: "bg-green-400"  },
    { label: "Level",    val: user?.level || 1,     max: 20,  color: "bg-blue-400"   },
    { label: "Streak",   val: user?.streak || 0,    max: 30,  color: "bg-orange-400" },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <button onClick={() => setView("dashboard")} className="flex items-center gap-2
        text-slate-500 hover:text-white mb-6 transition-colors text-sm font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h2 className="text-3xl font-black text-white mb-1">Your Statistics</h2>
      <p className="text-slate-500 text-sm mb-8">Track your typing progress</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Total XP",      val: user?.xp || 0,           icon: Star,   c: "text-blue-400",   bg: "bg-blue-500/10",   b: "border-blue-500/20"   },
          { label: "Top Speed",     val: `${user?.wpm || 0} WPM`,  icon: Zap,    c: "text-yellow-400", bg: "bg-yellow-500/10", b: "border-yellow-500/20" },
          { label: "Best Accuracy", val: `${user?.accuracy || 0}%`,icon: Target, c: "text-green-400",  bg: "bg-green-500/10",  b: "border-green-500/20"  },
          { label: "Day Streak",    val: `${user?.streak || 0}d`,  icon: Flame,  c: "text-orange-400", bg: "bg-orange-500/10", b: "border-orange-500/20" },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.b} rounded-2xl p-6 flex items-center gap-4`}>
            <s.icon className={`${s.c} w-8 h-8`} />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-black text-white">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-6 space-y-5">
        <h3 className="font-bold text-white text-base mb-2">Progress Bars</h3>
        {bars.map((b, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500 font-semibold">{b.label}</span>
              <span className="text-white font-bold">{b.val}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-blue-900/30">
              <div
                className={`h-full ${b.color} rounded-full transition-all`}
                style={{ width: `${Math.min((b.val / b.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button onClick={() => setView("dashboard")} className="inline-flex items-center gap-2
          text-slate-500 hover:text-blue-300 transition-colors text-sm font-semibold">
          <Home className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── SPEED TEST ───────────────────────────────────────────────────────────────
function SpeedTest({ onBack, onHome }) {
  const [phase, setPhase]       = useState("idle");
  const [words, setWords]       = useState([]);
  const [wordIdx, setWordIdx]   = useState(0);
  const [input, setInput]       = useState("");
  const [correct, setCorrect]   = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef                = useRef(null);
  const timerRef                = useRef(null);

  const genWords = () => {
    const w = [];
    for (let i = 0; i < 80; i++)
      w.push(SPEED_WORDS[Math.floor(Math.random() * SPEED_WORDS.length)]);
    return w;
  };

  const start = () => {
    setWords(genWords());
    setWordIdx(0);
    setCorrect(0);
    setInput("");
    setTimeLeft(60);
    setPhase("running");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleInput = e => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
      if (val.trim() === words[wordIdx]) setCorrect(c => c + 1);
      setWordIdx(i => i + 1);
      setInput("");
    } else {
      setInput(val);
    }
  };

  const tc = timeLeft <= 10 ? "text-red-400" : timeLeft <= 20 ? "text-yellow-400" : "text-blue-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500
          hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onHome} className="flex items-center gap-2 text-slate-500
          hover:text-white transition-colors text-sm font-semibold">
          <Home className="w-4 h-4" /> Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-black text-white mb-6">⚡ Speed Test</h2>

      {phase === "idle" && (
        <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-10 text-center">
          <Timer className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-white text-lg font-bold mb-2">60-Second Speed Test</p>
          <p className="text-slate-500 text-sm mb-6">
            Type each word then press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">Space</kbd>
          </p>
          <button
            onClick={start}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-3
                       rounded-xl transition-all active:scale-95
                       shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Start Test
          </button>
        </div>
      )}

      {phase === "running" && (
        <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-6">
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <p className={`text-4xl font-black ${tc}`}>{timeLeft}</p>
              <p className="text-xs text-slate-500 font-bold uppercase">Seconds Left</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-green-400">{correct}</p>
              <p className="text-xs text-slate-500 font-bold uppercase">Words</p>
            </div>
          </div>

          {/* Word stream */}
          <div className="flex flex-wrap gap-2 mb-6 max-h-28 overflow-hidden
                          p-3 bg-black/30 rounded-xl border border-blue-900/30">
            {words.slice(Math.max(0, wordIdx - 2), wordIdx + 20).map((w, i) => {
              const real = i + Math.max(0, wordIdx - 2);
              return (
                <span
                  key={real}
                  className={`text-lg font-mono px-1 rounded transition-all ${
                    real === wordIdx
                      ? "text-white bg-blue-600/40 border border-blue-500/50"
                      : real < wordIdx
                        ? "text-green-400/50"
                        : "text-slate-600"
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="Type word then Space…"
            className={INP}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      )}

      {phase === "done" && (
        <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-10 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-black text-white mb-2">Time's Up!</h3>
          <div className="flex justify-center gap-10 my-6">
            <div>
              <p className="text-5xl font-black text-green-400">{correct}</p>
              <p className="text-xs text-slate-500 font-bold uppercase mt-1">Words Correct</p>
            </div>
            <div>
              <p className="text-5xl font-black text-yellow-400">{correct}</p>
              <p className="text-xs text-slate-500 font-bold uppercase mt-1">WPM</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={start} className="flex items-center gap-2 bg-blue-600
              hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl
              transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={onBack} className="flex items-center gap-2 bg-white/5
              hover:bg-white/10 border border-blue-900/40 text-white font-bold
              px-6 py-3 rounded-xl transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WORD SCRAMBLE ────────────────────────────────────────────────────────────
function WordScramble({ onBack, onHome }) {
  const TOTAL = SCRAMBLE_WORDS.length;
  const [phase, setPhase]         = useState("idle");
  const [idx, setIdx]             = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [input, setInput]         = useState("");
  const [score, setScore]         = useState(0);
  const [timeLeft, setTimeLeft]   = useState(20);
  const [feedback, setFeedback]   = useState(null);
  const inputRef                  = useRef(null);
  const timerRef                  = useRef(null);

  const loadWord = useCallback(i => {
    setScrambled(doScramble(SCRAMBLE_WORDS[i].word));
    setInput("");
    setFeedback(null);
    setTimeLeft(20);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const advance = useCallback((wasCorrect) => {
    clearInterval(timerRef.current);
    if (wasCorrect) setScore(s => s + 1);
    const next = idx + 1;
    if (next >= TOTAL) { setPhase("done"); }
    else { setIdx(next); loadWord(next); }
  }, [idx, loadWord]);

  const start = () => {
    setIdx(0); setScore(0); setPhase("running"); loadWord(0);
  };

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); advance(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, idx, advance]);

  const submit = e => {
    e.preventDefault();
    const ok = input.trim().toLowerCase() === SCRAMBLE_WORDS[idx].word;
    setFeedback(ok ? "correct" : "wrong");
    clearInterval(timerRef.current);
    setTimeout(() => advance(ok), 700);
  };

  const tc = timeLeft <= 5 ? "text-red-400" : timeLeft <= 10 ? "text-yellow-400" : "text-blue-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500
          hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onHome} className="flex items-center gap-2 text-slate-500
          hover:text-white transition-colors text-sm font-semibold">
          <Home className="w-4 h-4" /> Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-black text-white mb-6">🔀 Word Scramble</h2>

      {phase === "idle" && (
        <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-10 text-center">
          <Shuffle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-white text-lg font-bold mb-2">Word Scramble Challenge</p>
          <p className="text-slate-500 text-sm mb-6">Unscramble {TOTAL} words — 20 seconds each!</p>
          <button
            onClick={start}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-3
                       rounded-xl transition-all active:scale-95
                       shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Start Game
          </button>
        </div>
      )}

      {phase === "running" && (
        <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-500 font-semibold">Word {idx + 1} / {TOTAL}</span>
            <span className={`font-black text-xl ${tc}`}>{timeLeft}s</span>
          </div>
          <div className="h-1.5 bg-blue-950 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all"
                 style={{ width: `${(idx / TOTAL) * 100}%` }} />
          </div>

          <div className="text-center mb-6">
            <p className="text-5xl font-black tracking-[0.3em] text-white mb-2">
              {scrambled.toUpperCase()}
            </p>
            <p className="text-slate-500 text-sm italic">Hint: {SCRAMBLE_WORDS[idx].hint}</p>
            <p className="text-slate-600 text-xs mt-2">Score: <span className="text-green-400 font-bold">{score}</span></p>
          </div>

          {feedback && (
            <p className={`text-center text-lg font-black mb-4 ${
              feedback === "correct" ? "text-green-400" : "text-red-400"
            }`}>
              {feedback === "correct" ? "✅ Correct!" : `❌ Answer: ${SCRAMBLE_WORDS[idx].word}`}
            </p>
          )}

          <form onSubmit={submit} className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your answer…"
              disabled={!!feedback}
              className={INP}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!!feedback || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white
                         font-bold px-6 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {phase === "done" && (
        <div className="bg-[#0b1223] border border-blue-900/40 rounded-2xl p-10 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-3xl font-black text-white mb-2">Game Over!</h3>
          <p className="text-6xl font-black text-green-400 my-4">{score}/{TOTAL}</p>
          <p className="text-slate-500 text-sm mb-8">Final Score</p>
          <div className="flex justify-center gap-3">
            <button onClick={start} className="flex items-center gap-2 bg-blue-600
              hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl
              transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" /> Play Again
            </button>
            <button onClick={onBack} className="flex items-center gap-2 bg-white/5
              hover:bg-white/10 border border-blue-900/40 text-white font-bold
              px-6 py-3 rounded-xl transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GAMES HUB ────────────────────────────────────────────────────────────────
function GamesPage({ setView }) {
  const [game, setGame] = useState(null);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {!game ? (
        <>
          <button onClick={() => setView("dashboard")} className="flex items-center gap-2
            text-slate-500 hover:text-white mb-6 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h2 className="text-3xl font-black text-white mb-2">Games</h2>
          <p className="text-slate-500 text-sm mb-8">Fun ways to sharpen your typing</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { key: "speed",   icon: Timer,   color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", title: "Speed Test",    desc: "Type as many words as possible in 60 seconds." },
              { key: "scramble",icon: Shuffle,  color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", title: "Word Scramble", desc: "Unscramble words before the timer runs out." },
            ].map(g => (
              <button
                key={g.key}
                onClick={() => setGame(g.key)}
                className="bg-[#0b1223] border border-blue-900/40 hover:border-blue-500/50
                           rounded-2xl p-8 text-left transition-all group
                           hover:bg-blue-900/10 active:scale-95"
              >
                <div className={`w-12 h-12 ${g.bg} border ${g.border} rounded-xl
                                 flex items-center justify-center mb-4`}>
                  <g.icon className={`w-6 h-6 ${g.color}`} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{g.title}</h3>
                <p className="text-slate-500 text-sm">{g.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm
                                font-bold group-hover:gap-3 transition-all">
                  Play Now <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </>
      ) : game === "speed" ? (
        <SpeedTest onBack={() => setGame(null)} onHome={() => setView("dashboard")} />
      ) : (
        <WordScramble onBack={() => setGame(null)} onHome={() => setView("dashboard")} />
      )}
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PricingPage({ user, setView, handlePayment }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setView("dashboard")} className="flex items-center gap-2
          text-slate-500 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => setView("dashboard")} className="flex items-center gap-2
          text-slate-500 hover:text-white transition-colors text-sm font-semibold">
          <Home className="w-4 h-4" /> Home
        </button>
      </div>

      <div className="text-center mb-12">
        <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">
          TypoMaster Pro
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
          Unleash Your Full Potential
        </h2>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Upgrade to unlock all lessons, advanced games, and professional certifications.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map(plan => (
          <div
            key={plan.id}
            className={`bg-[#0b1223] rounded-3xl p-7 border-2 flex flex-col relative
                        transition-all ${
              plan.tag
                ? "border-blue-500 shadow-2xl shadow-blue-900/30 scale-105 z-10"
                : "border-blue-900/40 hover:border-blue-700/50"
            }`}
          >
            {plan.tag && (
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1
                               rounded-full text-xs font-black text-white whitespace-nowrap ${
                plan.id === "annual" ? "bg-blue-600" : "bg-emerald-500"
              }`}>
                {plan.tag}
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-lg font-black text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹{plan.price}</span>
                <span className="text-slate-500 text-sm">/{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {["Unlimited Lessons", "All Typing Games", "Certificate", "Detailed Analytics"]
                .map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                  </li>
              ))}
            </ul>
            <button
              onClick={() => handlePayment(plan.price)}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center
                          justify-center gap-2 transition-all active:scale-95 ${
                plan.tag
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
                  : "bg-white/5 hover:bg-white/10 text-white border border-blue-900/40"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Select Plan
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => setView("dashboard")}
          className="text-slate-600 hover:text-slate-400 transition-colors text-sm
                     font-semibold underline underline-offset-4"
        >
          Continue with Free Account
        </button>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]                   = useState("auth");
  const [user, setUser]                   = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [toast, setToast]                 = useState({ msg: "", color: "" });

  const showToast = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast({ msg: "", color: "" }), 3000);
  };

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("typomaster_user");
    if (saved) {
      const p = JSON.parse(saved);
      setUser(p);
      setView(p.username ? "dashboard" : "username");
    }
  }, []);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem("typomaster_user", JSON.stringify(user));
  }, [user]);

  // ── AUTH HANDLERS ──────────────────────────────────────────────────────────
  const handleEmail = async (email, password, mode, setMode) => {
    try {
      // Try to import Firebase; if not available fall back to demo mode
      const fb = await import("./firebase").catch(() => null);
      if (fb?.auth) {
        const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } = fb;
        if (mode === "signup") {
          const cred = await createUserWithEmailAndPassword(fb.auth, email, password);
          await sendEmailVerification(cred.user);
          showToast("Verification email sent! Check your inbox.", "#16a34a");
          setMode("login");
        } else {
          const cred = await signInWithEmailAndPassword(fb.auth, email, password);
          if (!cred.user.emailVerified) { showToast("Please verify your email first!", "#dc2626"); return; }
          const u = { id: cred.user.uid, email: cred.user.email, provider: "email", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
          try { await fetch("https://typomaster-backend.onrender.com/api/auth/save", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ uid: u.id, email: u.email }) }); } catch {}
          setUser(u);
          setView("username");
        }
      } else {
        // Demo (preview / no Firebase)
        if (mode === "signup") {
          showToast("Account created! Please login.", "#16a34a");
          setMode("login");
        } else {
          const u = { id: "demo_" + Date.now(), email, provider: "email", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
          setUser(u);
          setView("username");
        }
      }
    } catch (err) {
      const msg =
        err.code === "auth/email-already-in-use" ? "Email already in use" :
        err.code === "auth/invalid-email"         ? "Invalid email"        :
        err.code === "auth/wrong-password"        ? "Wrong password"       :
        err.message || "Something went wrong";
      showToast(msg, "#dc2626");
    }
  };

  const handleGoogle = async () => {
    try {
      const fb = await import("./firebase").catch(() => null);
      if (fb?.auth && fb?.GoogleAuthProvider && fb?.signInWithPopup) {
        const provider = new fb.GoogleAuthProvider();
        const cred = await fb.signInWithPopup(fb.auth, provider);
        const u = { id: cred.user.uid, email: cred.user.email, provider: "google", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
        setUser(u); setView("username");
      } else {
        // Demo fallback
        const u = { id: "g_" + Date.now(), email: "googleuser@gmail.com", provider: "google", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
        setUser(u); setView("username");
      }
    } catch (err) { showToast(err.message || "Google sign-in failed", "#dc2626"); }
  };

  const handleFacebook = async () => {
    try {
      const fb = await import("./firebase").catch(() => null);
      if (fb?.auth && fb?.FacebookAuthProvider && fb?.signInWithPopup) {
        const provider = new fb.FacebookAuthProvider();
        const cred = await fb.signInWithPopup(fb.auth, provider);
        const u = { id: cred.user.uid, email: cred.user.email, provider: "facebook", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
        setUser(u); setView("username");
      } else {
        const u = { id: "fb_" + Date.now(), email: "fbuser@facebook.com", provider: "facebook", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
        setUser(u); setView("username");
      }
    } catch (err) { showToast(err.message || "Facebook sign-in failed", "#dc2626"); }
  };

  // ── USERNAME SUBMIT ────────────────────────────────────────────────────────
  // Receives username STRING (not FormEvent) from UsernamePage
  const handleSetUsername = async (username) => {
    if (!user || !username) return;
    try {
      await fetch("https://typomaster-backend.onrender.com/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.id, username }),
      });
    } catch {}
    setUser({ ...user, username });
    setView("dashboard");
  };

  // ── LESSON ─────────────────────────────────────────────────────────────────
  const startLesson = lesson => {
    if (!user) return;
    if (user.triesLeft <= 0 && !user.isPremium) { setView("pricing"); return; }
    setCurrentLesson(lesson);
    setView("lesson");
  };

  const completeLesson = ({ wpm, accuracy, xp, lessonId }) => {
    if (!user) return;
    const isNew = lessonId === user.unlockedLessons;
    const updated = {
      ...user,
      xp:              user.xp + xp,
      level:           Math.floor((user.xp + xp) / 500) + 1,
      triesLeft:       user.isPremium ? user.triesLeft : Math.max(0, user.triesLeft - 1),
      unlockedLessons: isNew ? user.unlockedLessons + 1 : user.unlockedLessons,
      wpm:             Math.max(user.wpm, wpm),
      accuracy:        Math.max(user.accuracy, accuracy),
    };
    setUser(updated);
    showToast(`+${xp} XP earned! 🎉`, "#16a34a");
    setView("dashboard");
    setCurrentLesson(null);
  };

  // ── PAYMENT ────────────────────────────────────────────────────────────────
  const handlePayment = price => {
    if (window.Razorpay) {
      const rzp = new window.Razorpay({
        key: "rzp_test_SVl54zdp8hFeMa",
        amount: price * 100,
        currency: "INR",
        name: "TypoMaster Pro",
        description: "Premium Upgrade",
        handler: () => {
          showToast("Payment Successful! You're now Pro ✅", "#16a34a");
          setUser(p => ({ ...p, isPremium: true }));
          setView("dashboard");
        },
        prefill: { email: user?.email || "" },
        theme: { color: "#2563eb" },
      });
      rzp.open();
    } else {
      showToast("Payment gateway not loaded. Add Razorpay script.", "#dc2626");
    }
  };

  const logout = () => {
    localStorage.removeItem("typomaster_user");
    setUser(null);
    setView("auth");
  };

  const isAuthed = !["auth", "username"].includes(view);

  return (
    <div className="min-h-screen bg-[#060b16] font-sans">
      <Toast msg={toast.msg} color={toast.color} />

      {isAuthed && (
        <NavBar user={user} view={view} setView={setView} onLogout={logout} />
      )}

      {view === "auth" && (
        <AuthPage
          onGoogle={handleGoogle}
          onFacebook={handleFacebook}
          onEmail={handleEmail}
        />
      )}
      {view === "username" && (
        <UsernamePage
          onSetUsername={handleSetUsername}
          onBack={() => setView("auth")}
        />
      )}
      {view === "dashboard" && (
        <Dashboard user={user} setView={setView} onStartLesson={startLesson} />
      )}
      {view === "lesson" && currentLesson && (
        <LessonPage
          lesson={currentLesson}
          onComplete={completeLesson}
          onBack={() => { setView("dashboard"); setCurrentLesson(null); }}
        />
      )}
      {view === "stats"   && <StatsPage   user={user} setView={setView} />}
      {view === "games"   && <GamesPage   setView={setView} />}
      {view === "pricing" && <PricingPage user={user} setView={setView} handlePayment={handlePayment} />}
    </div>
  );
}