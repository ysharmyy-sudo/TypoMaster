import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard, Trophy, Target, Zap, Flame, Award, Lock,
  ChevronRight, Star, BarChart2, BookOpen, Play, LogOut,
  Mail, Facebook, User as UserIcon, ShieldCheck, CreditCard,
  CheckCircle2, Gamepad2, FileText, ArrowLeft, Timer,
  Shuffle, RefreshCw, Crown, Brain, Crosshair, Dumbbell,
  AlarmClock, Hash
} from 'lucide-react';
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

// --- Types ---
type View = 'auth' | 'username' | 'dashboard' | 'lesson' | 'pricing' | 'stats' | 'games' | 'exams';

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

// --- Data ---
const LESSONS = [
  { id: 1, title: 'Home Row: Left Hand',  content: 'asdf asdf asdf asdf',    xp: 50  },
  { id: 2, title: 'Home Row: Right Hand', content: 'jkl; jkl; jkl; jkl;',   xp: 50  },
  { id: 3, title: 'Home Row: Both Hands', content: 'asdf jkl; asdf jkl;',    xp: 100 },
  { id: 4, title: 'G & H Keys',           content: 'asdfgh jkl; gh gh gh',   xp: 100 },
  { id: 5, title: 'Top Row: QWERT',       content: 'qwert qwert qwert qwert', xp: 150 },
];

const PRICING_PLANS = [
  { id: 'monthly',     name: 'Monthly',     price: 99,  period: 'month',    tag: null            },
  { id: 'quarterly',   name: 'Quarterly',   price: 299, period: '3 months', tag: null            },
  { id: 'semi-annual', name: 'Semi-Annual', price: 499, period: '6 months', tag: 'Most Valuable' },
  { id: 'annual',      name: 'Annual',      price: 999, period: '12 months',tag: 'Most Popular'  },
];

const SPEED_WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say",
  "her","she","or","an","will","my","one","all","would","there","their","what",
  "so","up","out","if","about","who","get","which","go","me","when","make",
  "can","like","time","no","just","him","know","take",
];

const SCRAMBLE_WORDS = [
  { word: "keyboard", hint: "You type on this"        },
  { word: "typing",   hint: "What you are doing"      },
  { word: "finger",   hint: "You use these to type"   },
  { word: "speed",    hint: "How fast you go"         },
  { word: "practice", hint: "What makes perfect"      },
  { word: "master",   hint: "Expert level"            },
  { word: "accuracy", hint: "How correct you are"     },
  { word: "rhythm",   hint: "The beat of your typing" },
  { word: "lesson",   hint: "Something you learn"     },
  { word: "letters",  hint: "Alphabet characters"     },
];

const TYPING_TARGETS = [
  "the quick brown fox", "jumps over the lazy dog", "pack my box with five",
  "dozen liquor jugs", "how vexingly quick", "daft zebras jump",
];

const ALPHABET_SEQUENCE = "abcdefghijklmnopqrstuvwxyz";

// --- Indian Exams ---
const INDIAN_EXAMS = [
  {
    id: "upsc", name: "UPSC CSE", fullName: "Union Public Service Commission – Civil Services",
    icon: "🏛️", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200",
    questions: [
      { q: "Which article of the Indian Constitution abolishes untouchability?", options: ["Article 14","Article 17","Article 21","Article 25"], ans: 1 },
      { q: "The term 'Dharma' in the Indian context is best associated with:", options: ["Religious law only","Righteous conduct & duty","Caste hierarchy","Vedic rituals"], ans: 1 },
      { q: "Which Five-Year Plan emphasized agriculture and rural development?", options: ["1st Plan","3rd Plan","5th Plan","8th Plan"], ans: 0 },
      { q: "Panchayati Raj was first adopted in which state of India?", options: ["Uttar Pradesh","Maharashtra","Rajasthan","Gujarat"], ans: 2 },
      { q: "Which river forms the boundary between India and Pakistan in Punjab?", options: ["Sutlej","Ravi","Chenab","Jhelum"], ans: 1 },
    ]
  },
  {
    id: "ssc", name: "SSC CGL", fullName: "Staff Selection Commission – Combined Graduate Level",
    icon: "📋", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200",
    questions: [
      { q: "What is 15% of 880?", options: ["120","130","132","140"], ans: 2 },
      { q: "If HOUSE is coded as FQSQC, how is CHAIR coded?", options: ["AZHGP","AFZGP","AZFGP","AZHFP"], ans: 0 },
      { q: "Choose the correct spelling:", options: ["Accomodation","Accommodation","Acommodation","Acomodation"], ans: 1 },
      { q: "A train 150m long passes a pole in 15 seconds. Speed in km/h:", options: ["36","54","72","90"], ans: 0 },
      { q: "Which gas is called 'Laughing Gas'?", options: ["NO","N2O","CO2","SO2"], ans: 1 },
    ]
  },
  {
    id: "jee", name: "JEE Main", fullName: "Joint Entrance Examination – Main",
    icon: "⚛️", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200",
    questions: [
      { q: "The SI unit of electric potential is:", options: ["Ampere","Watt","Volt","Ohm"], ans: 2 },
      { q: "Which of the following is an isoelectronic pair?", options: ["N2 and CO","O2 and CO","NO and CO2","N2O and SO2"], ans: 0 },
      { q: "∫(x² + 1)dx from 0 to 1 =", options: ["4/3","2/3","1","5/3"], ans: 0 },
      { q: "The de Broglie wavelength of an electron accelerated through 100V is approximately:", options: ["1.23 Å","12.3 Å","0.123 Å","123 Å"], ans: 0 },
      { q: "Bond order of O2 is:", options: ["1","1.5","2","3"], ans: 2 },
    ]
  },
  {
    id: "neet", name: "NEET UG", fullName: "National Eligibility cum Entrance Test – Undergraduate",
    icon: "🩺", color: "text-green-600", bg: "bg-green-50", border: "border-green-200",
    questions: [
      { q: "Which organelle is called the 'powerhouse of the cell'?", options: ["Nucleus","Ribosome","Mitochondria","Golgi Apparatus"], ans: 2 },
      { q: "DNA replication is:", options: ["Conservative","Semi-conservative","Dispersive","Non-conservative"], ans: 1 },
      { q: "The respiratory centre is located in:", options: ["Cerebrum","Cerebellum","Medulla Oblongata","Hypothalamus"], ans: 2 },
      { q: "Blood pressure is measured using:", options: ["ECG","Sphygmomanometer","Stethoscope","Haemocytometer"], ans: 1 },
      { q: "Which vitamin is synthesised by skin in sunlight?", options: ["Vitamin A","Vitamin B","Vitamin C","Vitamin D"], ans: 3 },
    ]
  },
  {
    id: "cat", name: "CAT", fullName: "Common Admission Test – IIMs",
    icon: "📊", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200",
    questions: [
      { q: "If 2x + 3y = 12 and xy = 6, find (2x - 3y)²:", options: ["0","144","36","72"], ans: 0 },
      { q: "In how many ways can LEADING be arranged with vowels always together?", options: ["720","2160","1440","360"], ans: 1 },
      { q: "A invests ₹5000, B invests ₹6000. After 4 months A withdraws. Profit ratio:", options: ["5:9","10:9","25:24","15:18"], ans: 2 },
      { q: "'She ___ for three hours.' Choose correct tense:", options: ["has been working","had been working","is working","was working"], ans: 1 },
      { q: "If revenue grew 20% then declined 10%, net change is:", options: ["10% gain","8% gain","10% loss","8% loss"], ans: 1 },
    ]
  },
  {
    id: "gate", name: "GATE CS", fullName: "Graduate Aptitude Test in Engineering – Computer Science",
    icon: "💻", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200",
    questions: [
      { q: "Time complexity of binary search is:", options: ["O(n)","O(log n)","O(n log n)","O(1)"], ans: 1 },
      { q: "Which sorting algorithm is stable and in-place?", options: ["Quick Sort","Merge Sort","Bubble Sort","Heap Sort"], ans: 2 },
      { q: "In TCP/IP, which layer is responsible for routing?", options: ["Data Link","Network","Transport","Application"], ans: 1 },
      { q: "A B-tree of order m has at most ___ children:", options: ["m","m-1","m+1","2m"], ans: 0 },
      { q: "Which normal form deals with transitive dependency?", options: ["1NF","2NF","3NF","BCNF"], ans: 2 },
    ]
  },
];

function doScramble(word: string): string {
  const a = word.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join("") === word ? doScramble(word) : a.join("");
}

// ─── SPEED GAME ───────────────────────────────────────────────────────────────
function SpeedGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle'|'playing'|'done'>('idle');
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<number>(0);
  const getWord = () => SPEED_WORDS[Math.floor(Math.random() * SPEED_WORDS.length)];

  const startGame = () => {
    setWords(Array.from({ length: 20 }, getWord));
    setInput(''); setScore(0); setTimeLeft(60); setWpm(0); setPhase('playing');
    startRef.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { setPhase('done'); clearInterval(id); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(' ')) {
      const typed = val.trim();
      if (typed === words[score]) {
        const ns = score + 1;
        setScore(ns);
        const elapsed = (Date.now() - startRef.current) / 60000;
        setWpm(Math.round(ns / elapsed));
        if (words.length - ns < 10) setWords(w => [...w, ...Array.from({ length: 10 }, getWord)]);
      }
      setInput('');
    } else setInput(val);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Speed Typing
          </h2>
          {phase === 'playing' && <div className="flex gap-4"><span className="text-yellow-500 font-black text-lg">{timeLeft}s</span><span className="text-sky-600 font-black text-lg">{wpm} WPM</span></div>}
        </div>
        {phase === 'idle' && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-6">Type as many words as you can in 60 seconds!</p>
            <button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-400 text-white font-black px-8 py-3 rounded-xl transition-all">Start Game</button>
          </div>
        )}
        {phase === 'playing' && (
          <>
            <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[80px]">
              {words.slice(score, score + 20).map((w, i) => (
                <span key={i} className={`text-sm font-mono px-1.5 py-0.5 rounded ${i === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 font-bold' : 'text-gray-400'}`}>{w}</span>
              ))}
            </div>
            <input ref={inputRef} value={input} onChange={handleInput} placeholder={`Type: "${words[score]}"`} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-mono" />
            <div className="mt-3 flex justify-between text-sm text-gray-400">
              <span>Words: <strong className="text-slate-900">{score}</strong></span>
              <span>WPM: <strong className="text-yellow-500">{wpm}</strong></span>
            </div>
          </>
        )}
        {phase === 'done' && (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Time's Up!</h3>
            <p className="text-gray-500 mb-2">Words typed: <span className="text-yellow-500 font-black text-xl">{score}</span></p>
            <p className="text-gray-500 mb-6">Final WPM: <span className="text-sky-600 font-black text-xl">{wpm}</span></p>
            <button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-400 text-white font-black px-8 py-3 rounded-xl transition-all">Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCRAMBLE GAME ────────────────────────────────────────────────────────────
function ScrambleGame({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [scrambled, setScr] = useState('');
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState('');
  const [msgColor, setMsgColor] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const item = SCRAMBLE_WORDS[idx % SCRAMBLE_WORDS.length];

  useEffect(() => { setScr(doScramble(item.word)); setInput(''); inputRef.current?.focus(); }, [idx]);

  const check = () => {
    if (input.toLowerCase() === item.word) {
      setScore(s => s + 10); setMsg('Correct! +10 pts 🎉'); setMsgColor('text-green-600');
      setTimeout(() => { setMsg(''); setIdx(i => i + 1); }, 800);
    } else {
      setMsg('Wrong! Try again ❌'); setMsgColor('text-red-500');
      setTimeout(() => setMsg(''), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Shuffle className="w-5 h-5 text-purple-500" /> Word Scramble</h2>
          <span className="text-purple-600 font-black text-lg">{score} pts</span>
        </div>
        {msg && <p className={`text-sm font-bold mb-3 ${msgColor}`}>{msg}</p>}
        <p className="text-gray-400 text-sm mb-4">Hint: {item.hint}</p>
        <div className="text-center py-6 bg-purple-50 rounded-xl border border-purple-100 mb-4">
          <p className="text-4xl font-black text-purple-600 tracking-widest uppercase">{scrambled}</p>
        </div>
        <div className="flex gap-3">
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Type the word..." className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" />
          <button onClick={check} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 rounded-xl transition-all">Check</button>
        </div>
        <button onClick={() => setIdx(i => i + 1)} className="mt-3 text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors">Skip →</button>
      </div>
    </div>
  );
}

// ─── ALPHABET BLITZ ───────────────────────────────────────────────────────────
function AlphabetGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle'|'playing'|'done'>('idle');
  const [typed, setTyped] = useState('');
  const [startTime, setST] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => { setTyped(''); setPhase('playing'); setST(Date.now()); setTimeout(() => inputRef.current?.focus(), 50); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    setTyped(val);
    if (val === ALPHABET_SEQUENCE) {
      const ms = Date.now() - startTime;
      setElapsed(ms);
      setBest(b => (b === null || ms < b) ? ms : b);
      setPhase('done');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Hash className="w-5 h-5 text-cyan-500" /> Alphabet Blitz</h2>
          {best && <span className="text-cyan-600 text-sm font-bold">Best: {(best/1000).toFixed(2)}s</span>}
        </div>
        {phase === 'idle' && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Type the entire alphabet (a → z) as fast as you can!</p>
            <p className="text-gray-400 text-sm mb-6">No capitals, no mistakes</p>
            <button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-8 py-3 rounded-xl transition-all">Start!</button>
          </div>
        )}
        {phase === 'playing' && (
          <>
            <div className="font-mono text-2xl text-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 tracking-widest">
              {ALPHABET_SEQUENCE.split('').map((ch, i) => {
                let cls = 'text-gray-300';
                if (i < typed.length) cls = typed[i] === ch ? 'text-cyan-500' : 'text-red-500';
                else if (i === typed.length) cls = 'text-slate-900 border-b-2 border-cyan-500';
                return <span key={i} className={cls}>{ch}</span>;
              })}
            </div>
            <input ref={inputRef} value={typed} onChange={handleChange} placeholder="Type a b c d..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-mono" />
          </>
        )}
        {phase === 'done' && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Blazing! 🔥</h3>
            <p className="text-gray-500 mb-2">Time: <span className="text-cyan-500 font-black text-2xl">{(elapsed/1000).toFixed(2)}s</span></p>
            {elapsed === best && <p className="text-yellow-500 font-bold text-sm mb-4">🏆 New Best!</p>}
            <button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-8 py-3 rounded-xl transition-all">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRECISION SNIPER ─────────────────────────────────────────────────────────
function SniperGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle'|'playing'|'dead'>('idle');
  const [target, setTarget] = useState('');
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTarget = () => {
    const count = Math.floor(Math.random() * 2) + 1;
    return Array.from({ length: count }, () => SPEED_WORDS[Math.floor(Math.random() * SPEED_WORDS.length)]).join(' ');
  };

  const startGame = () => { setTarget(getTarget()); setTyped(''); setScore(0); setPhase('playing'); setTimeout(() => inputRef.current?.focus(), 50); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTyped(val);
    if (val === target) { setScore(s => s + 1); setTarget(getTarget()); setTyped(''); }
    else if (val.length > 0 && val[val.length - 1] !== target[val.length - 1]) setPhase('dead');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Crosshair className="w-5 h-5 text-red-500" /> Precision Sniper</h2>
          {phase === 'playing' && <span className="text-red-500 font-black text-lg">{score} kills</span>}
        </div>
        {phase === 'idle' && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">One wrong key = GAME OVER.</p>
            <p className="text-gray-400 text-sm mb-6">How many words can you type without a single mistake?</p>
            <button onClick={startGame} className="bg-red-500 hover:bg-red-600 text-white font-black px-8 py-3 rounded-xl transition-all">Lock and Load 🎯</button>
          </div>
        )}
        {phase === 'playing' && (
          <>
            <div className="font-mono text-2xl text-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {target.split('').map((ch, i) => {
                let cls = 'text-gray-300';
                if (i < typed.length) cls = 'text-green-500';
                else if (i === typed.length) cls = 'text-slate-900 border-b-2 border-red-500';
                return <span key={i} className={cls}>{ch}</span>;
              })}
            </div>
            <input ref={inputRef} value={typed} onChange={handleChange} placeholder="Type perfectly..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-mono" />
            <p className="text-xs text-gray-400 mt-2 text-center">Any mistake ends the game instantly</p>
          </>
        )}
        {phase === 'dead' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💥</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Eliminated!</h3>
            <p className="text-gray-500 mb-6">Score: <span className="text-red-500 font-black text-xl">{score}</span> perfect targets</p>
            <button onClick={startGame} className="bg-red-500 hover:bg-red-600 text-white font-black px-8 py-3 rounded-xl transition-all">Respawn</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CPU DUEL ─────────────────────────────────────────────────────────────────
function DuelGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle'|'playing'|'done'>('idle');
  const [sentence, setSentence] = useState('');
  const [typed, setTyped] = useState('');
  const [cpuProgress, setCpuP] = useState(0);
  const [result, setResult] = useState<'win'|'lose'|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cpuRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cpuWpm = 45;

  const startGame = () => {
    const s = TYPING_TARGETS[Math.floor(Math.random() * TYPING_TARGETS.length)];
    setSentence(s); setTyped(''); setCpuP(0); setResult(null); setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 50);
    const msPerChar = 60000 / (cpuWpm * 5);
    let progress = 0;
    cpuRef.current = setInterval(() => {
      progress++;
      setCpuP(progress);
      if (progress >= s.length) { if(cpuRef.current) clearInterval(cpuRef.current); setResult('lose'); setPhase('done'); }
    }, msPerChar);
  };

  useEffect(() => () => { if(cpuRef.current) clearInterval(cpuRef.current); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTyped(val);
    if (val === sentence) { if(cpuRef.current) clearInterval(cpuRef.current); setResult('win'); setPhase('done'); }
  };

  const pctUser = sentence ? (typed.length / sentence.length) * 100 : 0;
  const pctCpu  = sentence ? (cpuProgress / sentence.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6"><Dumbbell className="w-5 h-5 text-green-500" /> CPU Typing Duel</h2>
        {phase === 'idle' && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Race against the CPU ({cpuWpm} WPM) to finish first!</p>
            <button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3 rounded-xl transition-all mt-4">Challenge CPU 🤖</button>
          </div>
        )}
        {(phase === 'playing' || phase === 'done') && (
          <>
            <div className="space-y-3 mb-6">
              {[{ label: 'YOU', pct: pctUser, color: 'bg-sky-500' }, { label: 'CPU 🤖', pct: pctCpu, color: 'bg-red-500' }].map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-bold text-slate-700">{r.label}</span><span className="text-gray-400">{Math.round(r.pct)}%</span></div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${r.pct}%` }} /></div>
                </div>
              ))}
            </div>
            {phase === 'playing' && (
              <>
                <div className="font-mono text-base mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100 leading-relaxed">
                  {sentence.split('').map((ch, i) => {
                    let cls = 'text-gray-300';
                    if (i < typed.length) cls = typed[i] === ch ? 'text-green-500' : 'text-red-500 bg-red-50';
                    else if (i === typed.length) cls = 'text-slate-900 underline';
                    return <span key={i} className={cls}>{ch}</span>;
                  })}
                </div>
                <input ref={inputRef} value={typed} onChange={handleChange} placeholder="Start typing..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-mono" />
              </>
            )}
            {phase === 'done' && (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">{result === 'win' ? '🏆' : '😔'}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{result === 'win' ? 'You Win!' : 'CPU Wins!'}</h3>
                <button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white font-black px-8 py-3 rounded-xl transition-all mt-4">Rematch</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── NUMBER RUSH ──────────────────────────────────────────────────────────────
function NumberGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'idle'|'playing'|'done'>('idle');
  const [items, setItems] = useState<{ id: number; value: number; createdAt: number; ttl: number }[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const spawnNumber = () => ({ id: idRef.current++, value: Math.floor(Math.random() * 90) + 10, createdAt: Date.now(), ttl: 3000 });

  const startGame = () => { setItems([spawnNumber(), spawnNumber()]); setInput(''); setScore(0); setLives(3); setPhase('playing'); setTimeout(() => inputRef.current?.focus(), 50); };

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setItems(prev => {
        const now = Date.now();
        const remaining = prev.filter(item => now - item.createdAt < item.ttl);
        const expired = prev.length - remaining.length;
        if (expired > 0) {
          setLives(l => { const nl = l - expired; if (nl <= 0) setPhase('done'); return Math.max(0, nl); });
        }
        const toAdd = Math.max(0, 3 - remaining.length);
        return [...remaining, ...Array.from({ length: toAdd }, spawnNumber)];
      });
    }, 800);
    return () => clearInterval(id);
  }, [phase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    const num = parseInt(val);
    const match = items.find(it => it.value === num);
    if (match) { setItems(prev => prev.filter(it => it.id !== match.id)); setScore(s => s + 1); setInput(''); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><AlarmClock className="w-5 h-5 text-orange-500" /> Number Rush</h2>
          {phase === 'playing' && <div className="flex gap-4"><span className="text-orange-500 font-black">{score} pts</span><span>{'❤️'.repeat(lives)}</span></div>}
        </div>
        {phase === 'idle' && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Numbers appear and disappear — type them before they vanish!</p>
            <p className="text-gray-400 text-sm mb-6">Miss 3 and it's over.</p>
            <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-all">Rush! 🔢</button>
          </div>
        )}
        {phase === 'playing' && (
          <>
            <div className="relative h-32 bg-gray-50 rounded-xl border border-gray-100 mb-4 overflow-hidden">
              {items.map(item => {
                const pct = Math.max(0, 1 - (Date.now() - item.createdAt) / item.ttl);
                return (
                  <div key={item.id} className="absolute font-black text-xl transition-colors"
                    style={{ left: `${(item.id * 137.5) % 80}%`, top: `${(item.id * 93.7) % 70}%`, color: pct > 0.5 ? '#f97316' : pct > 0.25 ? '#eab308' : '#ef4444', opacity: pct }}>
                    {item.value}
                  </div>
                );
              })}
            </div>
            <input ref={inputRef} value={input} onChange={handleChange} placeholder="Type any number you see..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-mono" type="number" />
          </>
        )}
        {phase === 'done' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">💀</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Out of Lives!</h3>
            <p className="text-gray-500 mb-6">Score: <span className="text-orange-500 font-black text-xl">{score}</span></p>
            <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-all">Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MOCK TEST ────────────────────────────────────────────────────────────────
function MockTest({ exam, onBack }: { exam: typeof INDIAN_EXAMS[0]; onBack: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const q = exam.questions[qIndex];
  const total = exam.questions.length;
  const score = answers.filter(Boolean).length;

  const handleNext = () => {
    const correct = selected === q.ans;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);
    if (qIndex + 1 >= total) { setDone(true); return; }
    setQIndex(i => i + 1); setSelected(null);
  };

  const handleRestart = () => { setQIndex(0); setSelected(null); setAnswers([]); setDone(false); };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 mb-6 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Exams
      </button>
      <div className="max-w-3xl mx-auto">
        <div className={`bg-white border-2 ${exam.border} rounded-2xl p-5 mb-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exam.icon}</span>
              <div><h2 className={`font-black text-lg ${exam.color}`}>{exam.name}</h2><p className="text-gray-400 text-xs">{exam.fullName}</p></div>
            </div>
            {!done && <div className="text-right"><p className="text-slate-900 font-black text-lg">{qIndex + 1}/{total}</p><p className="text-gray-400 text-xs">Question</p></div>}
          </div>
          {!done && (
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${exam.bg} rounded-full transition-all`} style={{ width: `${(qIndex / total) * 100}%`, backgroundColor: 'currentColor' }} />
            </div>
          )}
        </div>

        {done ? (
          <div className={`bg-white border-2 ${exam.border} rounded-2xl p-8 text-center`}>
            <div className="text-6xl mb-4">{score === total ? '🏆' : score >= total * 0.6 ? '✅' : '📚'}</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Test Complete!</h3>
            <p className="text-gray-500 mb-2">Score: <span className={`font-black text-3xl ${exam.color}`}>{score}/{total}</span></p>
            <p className="text-gray-400 text-sm mb-6">{score === total ? 'Perfect! Excellent preparation!' : score >= total * 0.6 ? 'Good job! Keep practising.' : 'Revise more and try again!'}</p>
            <div className="text-left space-y-3 mb-6">
              {exam.questions.map((question, i) => (
                <div key={i} className={`p-3 rounded-xl border text-sm ${answers[i] ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-2">
                    <span className={`font-bold ${answers[i] ? 'text-green-600' : 'text-red-500'}`}>{answers[i] ? '✓' : '✗'}</span>
                    <div><p className="text-slate-700 font-semibold mb-1">{question.q}</p><p className={`text-xs ${answers[i] ? 'text-green-600' : 'text-red-500'}`}>Correct: {question.options[question.ans]}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRestart} className={`${exam.bg} ${exam.color} border-2 ${exam.border} font-black px-6 py-3 rounded-xl transition-all`}>Retake Test</button>
              <button onClick={onBack} className="border-2 border-gray-200 text-gray-500 hover:text-slate-900 font-bold px-6 py-3 rounded-xl transition-all">All Exams</button>
            </div>
          </div>
        ) : (
          <div className={`bg-white border-2 ${exam.border} rounded-2xl p-6`}>
            <p className="text-slate-900 font-bold text-lg mb-6 leading-relaxed">{q.q}</p>
            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => {
                let cls = 'border-gray-200 hover:border-sky-400 hover:bg-sky-50 cursor-pointer';
                if (selected !== null) {
                  if (i === q.ans) cls = 'border-green-400 bg-green-50';
                  else if (i === selected && selected !== q.ans) cls = 'border-red-400 bg-red-50';
                  else cls = 'border-gray-100 opacity-50';
                }
                return (
                  <button key={i} onClick={() => selected === null && setSelected(i)} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${cls}`}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${selected !== null && i === q.ans ? 'bg-green-500 text-white' : selected !== null && i === selected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{String.fromCharCode(65 + i)}</span>
                    <span className="text-sm font-semibold text-slate-700">{opt}</span>
                    {selected !== null && i === q.ans && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <button onClick={handleNext} className={`w-full ${exam.bg.replace('bg-', 'bg-')} border-2 ${exam.border} ${exam.color} font-black py-3 rounded-xl transition-all`}>
                {qIndex + 1 >= total ? 'See Results' : 'Next Question'} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EXAMS VIEW ───────────────────────────────────────────────────────────────
function ExamsView() {
  const [activeExam, setActiveExam] = useState<typeof INDIAN_EXAMS[0] | null>(null);
  if (activeExam) return <MockTest exam={activeExam} onBack={() => setActiveExam(null)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <FileText className="w-7 h-7 text-sky-600" /> Indian Competitive Exams
          </h2>
          <p className="text-gray-500">Mock tests for top national examinations</p>
          <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
            <p className="text-sm text-sky-700 font-semibold">📌 Each mock test has 5 questions · Instant feedback · Track your score</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDIAN_EXAMS.map(exam => (
            <button key={exam.id} onClick={() => setActiveExam(exam)}
              className={`bg-white border-2 ${exam.border} rounded-2xl p-6 text-left hover:shadow-md transition-all group`}>
              <div className="text-3xl mb-3">{exam.icon}</div>
              <h3 className={`font-black text-xl ${exam.color} mb-1`}>{exam.name}</h3>
              <p className="text-gray-400 text-xs font-semibold mb-3">{exam.fullName}</p>
              <div className={`inline-flex items-center gap-1 ${exam.bg} border ${exam.border} px-3 py-1 rounded-full`}>
                <span className={`text-xs font-bold ${exam.color}`}>5 Questions</span>
              </div>
              <div className={`flex items-center gap-1 mt-4 ${exam.color} text-xs font-bold`}>
                Start Test <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GAMES VIEW ───────────────────────────────────────────────────────────────
function GamesView() {
  const [activeGame, setActiveGame] = useState<string|null>(null);

  const games = [
    { id: 'speed',    name: 'Speed Typing',    desc: 'Type as many words as possible in 60 seconds',   icon: Zap,       color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { id: 'scramble', name: 'Word Scramble',   desc: 'Unscramble words to test your typing accuracy',  icon: Shuffle,   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'alphabet', name: 'Alphabet Blitz',  desc: 'Type A-Z as fast as possible – beat your record',icon: Hash,      color: 'text-cyan-600',   bg: 'bg-cyan-50',   border: 'border-cyan-200'   },
    { id: 'sniper',   name: 'Precision Sniper',desc: 'One wrong key and it\'s game over. Stay focused!',icon: Crosshair, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'    },
    { id: 'duel',     name: 'CPU Typing Duel', desc: 'Race against the CPU to finish a sentence first', icon: Dumbbell,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
    { id: 'number',   name: 'Number Rush',     desc: 'Type flying numbers before they disappear!',      icon: AlarmClock,color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  ];

  if (activeGame === 'speed')    return <SpeedGame    onBack={() => setActiveGame(null)} />;
  if (activeGame === 'scramble') return <ScrambleGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'alphabet') return <AlphabetGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'sniper')   return <SniperGame   onBack={() => setActiveGame(null)} />;
  if (activeGame === 'duel')     return <DuelGame     onBack={() => setActiveGame(null)} />;
  if (activeGame === 'number')   return <NumberGame   onBack={() => setActiveGame(null)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Typing Games</h2>
        <p className="text-gray-500 text-sm mb-8">Sharpen your skills through play</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map(g => (
            <button key={g.id} onClick={() => setActiveGame(g.id)}
              className={`bg-white border-2 ${g.border} rounded-2xl p-6 text-left hover:shadow-md transition-all group`}>
              <div className={`w-12 h-12 ${g.bg} rounded-xl flex items-center justify-center mb-4`}>
                <g.icon className={`w-6 h-6 ${g.color}`} />
              </div>
              <h3 className="font-black text-slate-900 mb-1">{g.name}</h3>
              <p className="text-gray-500 text-sm">{g.desc}</p>
              <div className={`flex items-center gap-1 mt-4 ${g.color} text-xs font-bold`}>
                Play Now <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>('auth');
  const [authMode, setAuthMode] = useState<'login'|'signup'>('signup');
  const [user, setUser] = useState<User|null>(null);
  const [currentLesson, setCurrentLesson] = useState<typeof LESSONS[0]|null>(null);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number|null>(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('typomaster_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setView(parsed.username ? 'dashboard' : 'username');
    }
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('typomaster_user', JSON.stringify(user));
  }, [user]);

  // ✅ FIREBASE AUTH — EXACT SAME AS ORIGINAL
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
          xp: 0, level: 1, wpm: 0, accuracy: 0,
          streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1
        };
        // ✅ BACKEND CALL — EXACT SAME
        await fetch("https://typomaster-backend.onrender.com/api/auth/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: newUser.id, email: newUser.email }),
        });
        setUser(newUser);
        setView('username');
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") alert("Email already exists");
      else if (err.code === "auth/invalid-email") alert("Invalid email");
      else alert(err.message);
    }
  };

  // ✅ RAZORPAY — EXACT SAME AS ORIGINAL
  const handlePayment = (price: number) => {
    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: "INR",
      name: "TypoMaster Pro",
      description: "Premium Upgrade",
      handler: function (response: any) {
        alert("Payment Successful ✅");
        setUser((prev: any) => ({ ...prev, isPremium: true }));
      },
      prefill: { email: user?.email || "" },
      theme: { color: "#3399cc" },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // ✅ USERNAME SETUP — EXACT SAME + BACKEND CALL
  const handleSetUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    if (user && username) {
      await fetch("https://typomaster-backend.onrender.com/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.id, username }),
      });
      setUser({ ...user, username });
      setView('dashboard');
    }
  };

  const startLesson = (lesson: typeof LESSONS[0]) => {
    if (!user) return;
    if (user.triesLeft <= 0 && !user.isPremium) { setView('pricing'); return; }
    setCurrentLesson(lesson); setTypedText(''); setStartTime(null); setStats({ wpm: 0, accuracy: 0 }); setView('lesson');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    setTypedText(value);
    const lessonText = currentLesson?.content || '';
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) { if (value[i] === lessonText[i]) correctChars++; }
    const accuracy = value.length > 0 ? (correctChars / value.length) * 100 : 100;
    const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60;
    const wpm = timeElapsed > 0 ? (value.length / 5) / timeElapsed : 0;
    setStats({ wpm: Math.round(wpm), accuracy: Math.round(accuracy) });
    if (value === lessonText) completeLesson();
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
    setTimeout(() => { setView('dashboard'); setCurrentLesson(null); }, 1500);
  };

  // ─── RENDER AUTH ─────────────────────────────────────────────────────────────
  const renderAuth = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Keyboard className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">TypoMaster Pro</h1>
          <p className="text-slate-500 mt-2">{authMode === 'login' ? 'Welcome back! Please login.' : 'Create your account to start.'}</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          {(['signup','login'] as const).map(m => (
            <button key={m} onClick={() => setAuthMode(m)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authMode === m ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {m === 'signup' ? 'Sign Up' : 'Login'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* ✅ GOOGLE BUTTON — real G SVG, white bg */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-800 shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          {/* ✅ FACEBOOK BUTTON — solid #1877F2 */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleAuth(email, password); }}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" />
          </div>
          <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200">
            {authMode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );

  // ─── RENDER USERNAME ──────────────────────────────────────────────────────────
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
            <input name="username" required type="text" placeholder="TypingNinja_24"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Account Password</label>
            <input required type="password" placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" />
            <p className="text-xs text-gray-400 mt-2">Create a secure password for your TypoMaster ID.</p>
          </div>
          <button type="submit" className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200">
            Start Typing!
          </button>
        </form>
      </div>
    </div>
  );

  // ─── RENDER DASHBOARD ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <Keyboard className="text-sky-600 w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-slate-900">TypoMaster</span>
          </div>
          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Home' },
              { id: 'games',     label: 'Games' },
              { id: 'exams',     label: 'Exams' },
              { id: 'pricing',   label: 'Pro' },
            ].map(item => (
              <button key={item.id} onClick={() => setView(item.id as View)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${view === item.id ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:text-slate-900 hover:bg-gray-50'}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {user?.level}</span>
                <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden border border-gray-200">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${((user?.xp || 0) % 500) / 5}%` }} />
                </div>
              </div>
              {!user?.isPremium && (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
                  <Zap className="w-4 h-4" />{user?.triesLeft} Free Tries
                </div>
              )}
              {user?.isPremium && (
                <div className="flex items-center gap-1 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4" />Pro Member
                </div>
              )}
            </div>
            <button onClick={() => { localStorage.removeItem('typomaster_user'); setUser(null); setView('auth'); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user?.username}!</h2>
            <p className="text-gray-500">Ready to improve your speed today?</p>
          </div>
          {!user?.isPremium && (
            <button onClick={() => setView('pricing')} className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-700 transition-transform hover:scale-105 shadow-lg shadow-sky-200">
              Upgrade to Pro
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Top WPM',   value: user?.wpm || 0,          icon: Zap,    color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { label: 'Accuracy',  value: `${user?.accuracy || 0}%`,icon: Target, color: 'text-green-500',  bg: 'bg-green-50'  },
            { label: 'XP Points', value: user?.xp || 0,           icon: Star,   color: 'text-sky-500',    bg: 'bg-sky-50'    },
            { label: 'Day Streak',value: user?.streak || 0,        icon: Flame,  color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}><stat.icon className={`${stat.color} w-6 h-6`} /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase">{stat.label}</p><p className="text-xl font-bold text-slate-900">{stat.value}</p></div>
            </div>
          ))}
        </div>

        {/* Quick access to games + exams */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button onClick={() => setView('games')} className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-5 text-left transition-all group">
            <Gamepad2 className="w-7 h-7 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-black text-slate-900">Typing Games</h3>
            <p className="text-gray-400 text-sm">6 fun games to boost your speed</p>
          </button>
          <button onClick={() => setView('exams')} className="bg-white border-2 border-orange-200 hover:border-orange-400 rounded-2xl p-5 text-left transition-all group">
            <FileText className="w-7 h-7 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-black text-slate-900">Mock Tests</h3>
            <p className="text-gray-400 text-sm">UPSC, JEE, NEET, CAT & more</p>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-sky-600" />Your Path</h3>
            {LESSONS.map(lesson => {
              const isLocked = lesson.id > (user?.unlockedLessons || 1);
              return (
                <div key={lesson.id} onClick={() => !isLocked && startLesson(lesson)}
                  className={`group relative bg-white p-5 rounded-2xl border transition-all cursor-pointer ${isLocked ? 'opacity-60 grayscale' : 'hover:border-sky-500 hover:shadow-md'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-sky-50 text-sky-600'}`}>{lesson.id}</div>
                      <div><h4 className="font-bold text-slate-900">{lesson.title}</h4><p className="text-sm text-gray-500">{lesson.xp} XP • Typing Practice</p></div>
                    </div>
                    {isLocked ? <Lock className="w-5 h-5 text-gray-400" /> : (
                      <div className="bg-gray-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-5 h-5 text-sky-600 fill-sky-600" /></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-sky-600" />Achievements</h3>
              <div className="space-y-4">
                {[
                  { name: 'First Steps',   desc: 'Complete Lesson 1', done: (user?.unlockedLessons || 0) > 1 },
                  { name: 'Speedster',     desc: 'Reach 40 WPM',      done: (user?.wpm || 0) >= 40 },
                  { name: 'Perfect',       desc: '100% Accuracy',     done: (user?.accuracy || 0) === 100 },
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
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Trophy className="w-5 h-5" />Monthly Leaderboard</h3>
              <p className="text-sky-100 text-sm mb-4">You are currently in the top 15% of all typists.</p>
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg text-sm font-bold backdrop-blur-sm">View Ranking</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // ─── RENDER LESSON ────────────────────────────────────────────────────────────
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
            <div className="text-3xl font-mono tracking-widest text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
              {currentLesson?.content.split('').map((char, i) => {
                let color = 'text-gray-300';
                if (i < typedText.length) color = typedText[i] === char ? 'text-green-500' : 'text-red-500 bg-red-50';
                return <span key={i} className={color}>{char}</span>;
              })}
            </div>
            <input autoFocus value={typedText} onChange={handleTyping} className="absolute inset-0 w-full h-full opacity-0 cursor-default" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Zap,      value: stats.wpm,    label: 'Words Per Min', color: 'text-yellow-500' },
              { icon: Target,   value: `${stats.accuracy}%`, label: 'Accuracy', color: 'text-green-500' },
              { icon: BarChart2,value: `${Math.round((typedText.length / (currentLesson?.content.length || 1)) * 100)}%`, label: 'Progress', color: 'text-sky-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── RENDER PRICING ────────────────────────────────────────────────────────────
  const renderPricing = () => (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-600 font-bold uppercase tracking-widest text-sm">TypoMaster Pro</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6">Unleash Your Full Potential</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Upgrade now to unlock all levels, advanced games, Indian exam mock tests, and professional certifications.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map(plan => (
            <div key={plan.id} className={`bg-white rounded-3xl p-8 border-2 transition-all relative flex flex-col ${plan.tag ? 'border-sky-500 shadow-xl scale-105 z-10' : 'border-gray-100 hover:border-sky-200'}`}>
              {plan.tag && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap ${plan.id === 'annual' ? 'bg-sky-600' : 'bg-emerald-500'}`}>{plan.tag}</div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-gray-400 font-medium">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Lessons','All 6 Typing Games','All Indian Exam Mock Tests','Certificate of Completion','Detailed Analytics'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />{feat}
                  </li>
                ))}
              </ul>
              <button onClick={() => handlePayment(plan.price)}
                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${plan.tag ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-200' : 'bg-gray-100 text-slate-900 hover:bg-gray-200'}`}>
                <CreditCard className="w-5 h-5" /> Select Plan
              </button>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <button onClick={() => setView('dashboard')} className="text-gray-400 font-bold hover:text-gray-600 transition-colors underline decoration-2 underline-offset-4">
            Continue with Free Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-slate-900">
      {view === 'auth'      && renderAuth()}
      {view === 'username'  && renderUsernameSetup()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'lesson'    && renderLesson()}
      {view === 'pricing'   && renderPricing()}
      {view === 'games'     && <GamesView />}
      {view === 'exams'     && <ExamsView />}
    </div>
  );
}
