import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageSkeleton } from '../components/SkeletonLoader';
import { RotateCcw, Zap, AlertCircle, Keyboard, X, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import HindiKeyboard, { type HindiLayout } from '../components/HindiKeyboard';
import VirtualKeyboard from '../components/VirtualKeyboard';
import {
  TYPING_LANGUAGE_OPTIONS,
  type TypingLanguage,
  getLanguageOption,
  getVirtualKeyboardLayout,
  makeDefaultPracticeText,
} from '../constants/typingLanguages';

// ─── Text Banks ─────────────────────────────────────────────────────────────

// NOTE:
// This project uses an in-app text bank (no API). So we must:
// 1) Never end the test just because the text finished (time controls end).
// 2) Keep extending the text when the user reaches the end.
// 3) Avoid repeating the same paragraph.

const ENGLISH_TEXTS: Record<string, string[]> = {
  'default': [
    "Indian Government has several competitive exams for selection of candidates for various posts in the central and state departments. Typing speed is a crucial requirement for many of these clerical and administrative roles.",
    "The Staff Selection Commission (SSC) conducts various exams like CHSL and CGL where typing tests are mandatory. Aspirants need to maintain a speed of at least 35 words per minute in English with high accuracy.",
    "Digital transformation in Indian administration has made typing an essential skill for every government employee. Modern day governance relies heavily on documentation and data entry tasks performed on computers.",
    "Practice makes perfect when it comes to typing. By using simulated environments that mimic actual exam interfaces, students can overcome nervousness and improve their performance significantly."
  ],
  'ssc-cgl': [
    "The Staff Selection Commission conducts the Combined Graduate Level Examination for recruitment to various Group B and Group C posts in different Ministries and Departments of the Government of India. The skill test includes a data entry speed of 8,000 key depressions per hour on computer.",
    "Candidates appearing for SSC CGL Tier-III or Skill Test must focus on both speed and accuracy. The passage provided usually contains around 2000 characters that must be typed within 15 minutes. It is essential to double-check for spelling errors before final submission."
  ],
  'ssc-chsl': [
    "For the post of Lower Division Clerk and Junior Secretariat Assistant, the typing test is conducted in English or Hindi. English medium candidates should have a typing speed of 35 words per minute. This equates to about 10,500 key depressions per hour.",
    "The CHSL typing test is qualifying in nature. However, high accuracy is demanded to ensure error rates remain within the permissible limits. Regular practice with previous year paragraphs is the key to success in this competitive environment."
  ],
  'ibps-po': [
    "Banking sector exams often include a descriptive paper where candidates must type essays and letters on a computer. This requires not just fast typing but also clear thinking and good grammar. The time limit is typically thirty minutes for two tasks.",
    "The digital interface for IBPS exams is designed to test the candidate's comfort with modern office tools. Efficient typing allows more time for planning the content of the essay, which can significantly boost the overall score in the mains examination."
  ],
  'daily-1': ["Early morning practice is the best way to kickstart your brain and fingers. Focus on the home row keys and maintain a steady rhythm. Success in typing comes from consistency rather than raw speed at the beginning."],
  'daily-2': ["Speed is the essence of modern day competitive exams. You must be able to process words rapidly and translate them into keystrokes without looking at the keyboard. This skill is built over time with dedicated practice."],
  'daily-3': ["Endurance tests your ability to stay focused over long periods. In exams like SSC CGL, you might need to type for 15 minutes continuously. Maintaining high accuracy while tired is what separates the masters from the amateurs."],
  'ssc-cgl-2023': ["The 2023 SSC CGL Skill Test emphasized technical documentation. Candidates were required to type complex sentences with mixed punctuation. Proper posture and wrist position are vital for such demanding tasks."],
  'news-editorial': ["The recent economic reforms aimed at boosting the manufacturing sector have shown positive early signs. Employment rates in urban areas are seeing a steady incline as new industrial hubs emerge across the country."]
};

// SSC/CHSL style official Hindi passages
const HINDI_TEXTS: string[] = [
  "भारत सरकार के कर्मचारी चयन आयोग द्वारा प्रत्येक वर्ष विभिन्न पदों पर भर्ती के लिए परीक्षाएं आयोजित की जाती हैं। इन परीक्षाओं में टाइपिंग परीक्षण एक महत्वपूर्ण चरण होता है जिसमें अभ्यर्थियों की गति और शुद्धता का मूल्यांकन किया जाता है।",
  "हमारे देश में सूचना प्रौद्योगिकी के क्षेत्र में तेजी से विकास हो रहा है। सरकारी और गैर-सरकारी दोनों क्षेत्रों में कंप्यूटर का उपयोग बढ़ता जा रहा है। इस कारण हिंदी टाइपिंग का ज्ञान रोजगार के अवसरों को बढ़ाता है।",
  "राष्ट्रीय स्तर पर आयोजित होने वाली टाइपिंग परीक्षाओं में सफलता के लिए नियमित अभ्यास आवश्यक है। प्रतिदिन कम से कम एक घंटे का अभ्यास अभ्यर्थियों की गति को उल्लेखनीय रूप से बढ़ा सकता है।",
  "भारतीय संविधान के अनुसार हिंदी देश की राजभाषा है। केंद्र सरकार के कार्यालयों में हिंदी में कार्य करना प्रोत्साहित किया जाता है। इसलिए हिंदी टाइपिंग सरकारी सेवाओं में प्रवेश के लिए एक महत्वपूर्ण योग्यता है।",
  "आधुनिक युग में प्रत्येक नागरिक के लिए कंप्यूटर का बुनियादी ज्ञान होना आवश्यक हो गया है। विशेष रूप से सरकारी परीक्षाओं की तैयारी करने वाले अभ्यर्थियों को हिंदी टाइपिंग में दक्षता हासिल करनी चाहिए।",
  "लोकसेवा आयोग और कर्मचारी चयन आयोग की परीक्षाओं में सफल होने के लिए अभ्यर्थियों को टाइपिंग में कम से कम पच्चीस शब्द प्रति मिनट की गति प्राप्त करनी होती है। इसके साथ-साथ शुद्धता का प्रतिशत भी अधिक होना चाहिए।",
];

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = TypingLanguage;
type DurationMin = number;

const DEFAULT_DURATION_OPTIONS: DurationMin[] = [1, 3, 5, 10, 15];

// Exam-specific default duration (and allowed variations)
const EXAM_DURATIONS: Record<string, { defaultMin: DurationMin; options: DurationMin[] }> = {
  'ssc-cgl': { defaultMin: 15, options: DEFAULT_DURATION_OPTIONS },
  'ssc-chsl': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'rrb-ntpc': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'ibps-po': { defaultMin: 15, options: DEFAULT_DURATION_OPTIONS },
  // New exams (defaults chosen to match typical typing tests; you can tweak later)
  'dsssb-ja-pa-spa': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'dsssb-ja-ldc-dass': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'delhi-hc-jja': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'delhi-hc-pa-spa': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'supreme-court-jca': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'rrb-ntpc-gdce': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'allahabad-hc-ja-steno': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'allahabad-hc-ro-aro': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'nvs-jsa': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'csir-jsa-english': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'ncert-ldc': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'kvs-jsa': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'dda-jsa': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'up-police-typing': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'upsssc-ja': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'delhi-police-typing-course': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'delhi-police-awo-tpo': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'bsf-hcm': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'crpf-hcm': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'jnu-ja': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'epfo-ssa': { defaultMin: 10, options: DEFAULT_DURATION_OPTIONS },
  'cbse-typing': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'drdo-assistant-typing': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
  'aiims-cre-typing': { defaultMin: 5, options: DEFAULT_DURATION_OPTIONS },
};

type SessionRecord = {
  ts: number;
  examId: string;
  examTitle: string;
  durationMin: number;
  language: string;
  wpm: number;
  accuracy: number;
  typedChars: number;
  correctChars: number;
  errors: number;
};

const SESSIONS_KEY = 'ptt_sessions_v1';
const PASSAGE_STATE_KEY = 'ptt_passage_state_v1'; // per examId+language, for non-repeat passages

// ─── Component ───────────────────────────────────────────────────────────────

const TypingTest = () => {
  const [loading, setLoading] = useState(true);
  const { useTrial, trialsUsed, isPremium } = useAppContext();
  const navigate = useNavigate();

  // Language & keyboard panel
  const [language, setLanguage] = useState<Language>('english');
  const [hindiLayout, setHindiLayout] = useState<HindiLayout>('inscript');
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Test state
  const [text, setText] = useState('');
  const [examTitle, setExamTitle] = useState('Standard Practice');
  const [examId, setExamId] = useState<string>('default');
  const [durationMin, setDurationMin] = useState<DurationMin>(1);
  const [durationOptions, setDurationOptions] = useState<DurationMin[]>(DEFAULT_DURATION_OPTIONS);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [trialError, setTrialError] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const langOption = getLanguageOption(language);
  const isHindi = language === 'hindi_inscript' || language === 'hindi_remington';
  const isNonEnglish = language !== 'english';

  const shuffle = <T,>(arr: T[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const getPassageStoreKey = (lang: Language, eId: string) => `${lang}::${eId || 'default'}`;

  const getNextEnglishParagraph = (eId: string) => {
    const examKey = eId && ENGLISH_TEXTS[eId] ? eId : 'default';
    const bank = ENGLISH_TEXTS[examKey] || ENGLISH_TEXTS.default;

    // Read state
    let stateAll: any = {};
    try {
      stateAll = JSON.parse(localStorage.getItem(PASSAGE_STATE_KEY) || '{}') || {};
    } catch {
      stateAll = {};
    }

    const storeKey = getPassageStoreKey('english', examKey);
    const state = stateAll[storeKey] || { queue: [], lastIndex: null, dynamicCount: 0 };

    // If we still have unique static paragraphs left in this cycle, use them
    if (!Array.isArray(state.queue) || state.queue.length === 0) {
      const indexes = bank.map((_, i) => i);
      const filtered = typeof state.lastIndex === 'number' && bank.length > 1
        ? indexes.filter((i) => i !== state.lastIndex)
        : indexes;
      state.queue = shuffle(filtered);
    }

    // If bank is tiny OR user already cycled, generate a fresh unique paragraph (never repeats)
    // This guarantees "repeat nahi hona chahiye" even if bank is small.
    if (!state.queue.length) {
      state.dynamicCount = Number(state.dynamicCount || 0) + 1;
      stateAll[storeKey] = state;
      try {
        localStorage.setItem(PASSAGE_STATE_KEY, JSON.stringify(stateAll));
      } catch {
        // ignore
      }
      const n = state.dynamicCount;
      const bits = [
        "Typing tests reward calm rhythm, correct posture, and consistent accuracy over pure speed.",
        "Keep your eyes on the screen, not the keyboard, and let your muscle memory do the work.",
        "A small reduction in errors can improve your effective score more than rushing for extra words.",
        "In real exam environments, time management matters: start steady, then gradually increase pace.",
        "Practice with punctuation, numbers, and mixed-case words to avoid surprises on test day.",
      ];
      const pick = shuffle(bits).slice(0, 3).join(' ');
      return `Practice Passage #${n}: ${pick}`;
    }

    const idx = state.queue.shift();
    state.lastIndex = idx;
    stateAll[storeKey] = state;
    try {
      localStorage.setItem(PASSAGE_STATE_KEY, JSON.stringify(stateAll));
    } catch {
      // ignore
    }

    return bank[idx] || ENGLISH_TEXTS.default[0];
  };

  const getNextHindiParagraph = () => {
    // Simple non-repeat cycle for Hindi bank (reshuffles after full cycle)
    let stateAll: any = {};
    try {
      stateAll = JSON.parse(localStorage.getItem(PASSAGE_STATE_KEY) || '{}') || {};
    } catch {
      stateAll = {};
    }
    const storeKey = getPassageStoreKey('hindi_inscript', 'hindi');
    const state = stateAll[storeKey] || { queue: [], lastIndex: null };
    if (!Array.isArray(state.queue) || state.queue.length === 0) {
      const indexes = HINDI_TEXTS.map((_, i) => i);
      const filtered = typeof state.lastIndex === 'number' && HINDI_TEXTS.length > 1
        ? indexes.filter((i) => i !== state.lastIndex)
        : indexes;
      state.queue = shuffle(filtered);
    }
    const idx = state.queue.shift();
    state.lastIndex = idx;
    stateAll[storeKey] = state;
    try {
      localStorage.setItem(PASSAGE_STATE_KEY, JSON.stringify(stateAll));
    } catch {
      // ignore
    }
    return HINDI_TEXTS[idx] || HINDI_TEXTS[0];
  };

  const buildInitialText = (opts: { lang: Language; eId: string; minutes: number }) => {
    const { lang, eId, minutes } = opts;
    // IMPORTANT (UI/UX):
    // Keep the on-screen passage box practical (same feel as before).
    // We only preload a small amount and then auto-extend when the user reaches the end.
    // (Timer controls end, not passage length.)
    const targetChars = Math.max(550, Math.round(Math.min(minutes, 5) * 140));
    const parts: string[] = [];
    let total = 0;
    while (total < targetChars) {
      let p = '';
      if (lang === 'english') p = getNextEnglishParagraph(eId);
      else if (lang === 'hindi_inscript' || lang === 'hindi_remington') p = getNextHindiParagraph();
      else p = makeDefaultPracticeText(lang);
      parts.push(p);
      total += p.length + 2;
      // safety cap (avoid runaway DOM)
      if (parts.length > 4) break;
    }
    return parts.join('\n\n');
  };

  const extendTextIfNeeded = (typedLen: number) => {
    // Extend when user is close to end
    const buffer = 120;
    if (typedLen < 1) return;
    if (typedLen < text.length - buffer) return;
    if (isFinished) return;

    let extra = '';
    if (language === 'english') extra = getNextEnglishParagraph(examId);
    else if (isHindi) extra = getNextHindiParagraph();
    else extra = makeDefaultPracticeText(language);

    if (!extra) return;
    setText((prev) => `${prev}\n\n${extra}`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // ── Init ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    const eId = params.get('exam') || 'default';
    const title = params.get('title');
    const durationParam = params.get('duration');
    const focusParam = params.get('focus') === '1';

    if (title) setExamTitle(title);
    setExamId(eId);
    setIsFocusMode(focusParam);

    const examCfg = EXAM_DURATIONS[eId] || { defaultMin: 1 as DurationMin, options: DEFAULT_DURATION_OPTIONS };
    setDurationOptions(examCfg.options);
    const parsed = Number(durationParam);
    const requested = Number.isFinite(parsed) ? parsed : examCfg.defaultMin;
    // Allow custom durations in Focus Mode; for exams, fall back to default if not in allowed options.
    const chosen =
      focusParam && requested >= 1
        ? Math.max(1, Math.min(180, Math.round(requested)))
        : examCfg.options.includes(requested)
          ? requested
          : examCfg.defaultMin;
    setDurationMin(chosen);
    setTimeLeft(chosen * 60);
    // If chosen duration is custom (not in options), include it so dropdown reflects it.
    if (!examCfg.options.includes(chosen)) {
      setDurationOptions((prev) => {
        const next = Array.from(new Set([...(prev || DEFAULT_DURATION_OPTIONS), chosen])).sort((a, b) => a - b);
        return next;
      });
    }

    // Default = English
    // IMPORTANT: don't finish test when text ends; we extend as needed.
    // Also avoid repeating the same paragraph.
    if (gameId) {
      setText(
        buildInitialText({ lang: 'english', eId: 'default', minutes: chosen }) +
          '\n\n' +
          'Game mode is active. Focus on every character to master the speed challenge!'
      );
    } else {
      setText(buildInitialText({ lang: 'english', eId, minutes: chosen }));
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // ── Language change ──
  const handleLanguageChange = (lang: Language) => {
    const nextOpt = getLanguageOption(lang);
    setLanguage(lang);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeLeft(durationMin * 60);
    setTrialError(false);

    // Update title for non-english languages (helps users confirm selection)
    if (lang === 'english') {
      setExamTitle('Standard Practice');
      setText(buildInitialText({ lang: 'english', eId: 'default', minutes: durationMin }));
      setShowKeyboard(false);
    } else {
      setExamTitle(`${nextOpt.label} Practice`);
      // Auto-open virtual keyboard for better UX on mobile / for uncommon scripts
      setShowKeyboard(true);

      if (lang === 'hindi_inscript' || lang === 'hindi_remington') {
        setText(buildInitialText({ lang, eId: 'hindi', minutes: durationMin }));
        setHindiLayout(lang === 'hindi_inscript' ? 'inscript' : 'remington');
      } else {
        setText(buildInitialText({ lang, eId: 'default', minutes: durationMin }));
      }
    }
  };

  // ── Timer & WPM ──
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startTime && !isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleFinish(); return 0; }
          return prev - 1;
        });
        const timePassed = (Date.now() - startTime) / 60000;
        const wordsTyped = userInput.trim().split(/\s+/).length;
        if (timePassed > 0) setWpm(Math.round(wordsTyped / timePassed));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished, timeLeft, userInput]);

  // ── Start ──
  const handleStart = () => {
    if (!isPremium && trialsUsed >= 3) { setTrialError(true); return; }
    if (!startTime) {
      const allowed = useTrial();
      if (!allowed) { setTrialError(true); return; }
      setStartTime(Date.now());
    }
  };

  // Focus Mode: start immediately (and keep input focused)
  useEffect(() => {
    if (loading) return;
    if (!isFocusMode) return;
    if (isFinished) return;
    if (startTime) return;
    // Start now
    handleStart();
    // Focus cursor
    setTimeout(() => inputRef.current?.focus(), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isFocusMode]);

  // ── Input ──
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    const value = e.target.value;
    if (!startTime && value.length > 0) handleStart();
    setUserInput(value);

    const charCount = value.length;
    let correctChars = 0;
    for (let i = 0; i < charCount; i++) {
      if (value[i] === text[i]) correctChars++;
    }
    setAccuracy(charCount === 0 ? 100 : Math.round((correctChars / charCount) * 100));
    // Never finish just because text ended; extend instead.
    extendTextIfNeeded(value.length);
  };

  // ── Finish ──
  const handleFinish = () => {
    // Calculate final WPM (more accurate than last interval tick)
    const now = Date.now();
    const elapsedMin = startTime ? (now - startTime) / 60000 : durationMin;
    const wordsTyped = userInput.trim() ? userInput.trim().split(/\s+/).length : 0;
    const finalWpm = elapsedMin > 0 ? Math.round(wordsTyped / elapsedMin) : 0;
    setWpm(finalWpm);

    // Character accuracy snapshot
    const typedChars = userInput.length;
    let correctChars = 0;
    for (let i = 0; i < typedChars; i++) {
      if (userInput[i] === text[i]) correctChars++;
    }
    const errors = Math.max(0, typedChars - correctChars);

    // Save session locally for monthly analytics
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      const prev = raw ? (JSON.parse(raw) as SessionRecord[]) : [];
      const next: SessionRecord[] = Array.isArray(prev) ? prev.slice(-500) : [];
      next.push({
        ts: now,
        examId: examId || 'default',
        examTitle: examTitle || 'Typing Test',
        durationMin: Number(durationMin || 1),
        language,
        wpm: finalWpm,
        accuracy,
        typedChars,
        correctChars,
        errors,
      });
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }

    setIsFinished(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0ea5e9', '#ffffff', '#000000'] });
  };

  // ── Reset ──
  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeLeft(durationMin * 60);
    setTrialError(false);

    if (language === 'english') {
      // Keep same exam context and pick a non-repeating passage
      setText(buildInitialText({ lang: 'english', eId: examId, minutes: durationMin }));
    } else if (isHindi) {
      setText(buildInitialText({ lang: language, eId: 'hindi', minutes: durationMin }));
    } else {
      setText(buildInitialText({ lang: language, eId: 'default', minutes: durationMin }));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) return <PageSkeleton />;

  if (trialError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md text-center border border-slate-200">
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Free Trials Exhausted</h2>
          <p className="text-slate-600 mb-8">You've used all 3 free trials. Upgrade to Premium for unlimited practice and advanced games.</p>
          <button onClick={() => navigate('/pricing')} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all mb-4">
            View Pricing Plans
          </button>
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-black font-medium">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const keyboardPanelTitle = isHindi ? 'Keyboard Reference (Hindi)' : 'Virtual Keyboard';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className={`mx-auto transition-all duration-300 ${isNonEnglish && showKeyboard ? 'max-w-[1400px]' : 'max-w-4xl'}`}>

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Typing <span className="text-sky-600">Arena</span></h1>
            <p className="text-slate-500 font-medium">
              Simulation: <span className="text-black font-bold">{examTitle}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[90px]">
              <span className="text-xs font-bold text-slate-400 uppercase">WPM</span>
              <span className="text-2xl font-bold text-sky-600">{wpm}</span>
            </div>
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[90px]">
              <span className="text-xs font-bold text-slate-400 uppercase">Accuracy</span>
              <span className="text-2xl font-bold text-sky-600">{accuracy}%</span>
            </div>
            <div className="bg-black text-white px-6 py-3 rounded-2xl flex flex-col items-center min-w-[90px]">
              <span className="text-xs font-bold text-slate-400 uppercase">Time</span>
              <span className="text-2xl font-bold text-sky-400">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* ── Language Toggle Bar ── */}
        {!isFocusMode && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden md:block">भाषा / Language</span>
          <div className="flex-1 md:flex-none min-w-[240px]">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as TypingLanguage)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none font-bold text-slate-800"
            >
              {TYPING_LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1 px-1">
              Selected script: <span className="font-semibold">{langOption.sub}</span>
            </p>
          </div>

          {/* Duration selector (1/3/5/10/15 min) */}
          <div className="flex-1 md:flex-none min-w-[200px]">
            <select
              value={durationMin}
              onChange={(e) => {
                const next = Number(e.target.value) as DurationMin;
                setDurationMin(next);
                setUserInput('');
                setStartTime(null);
                setWpm(0);
                setAccuracy(100);
                setIsFinished(false);
                setTrialError(false);
                setTimeLeft(next * 60);

                // Refresh passage (keeps same exam context)
                if (language === 'english') {
                  setText(buildInitialText({ lang: 'english', eId: examId, minutes: next }));
                } else if (isHindi) {
                  setText(buildInitialText({ lang: language, eId: 'hindi', minutes: next }));
                } else {
                  setText(buildInitialText({ lang: language, eId: 'default', minutes: next }));
                }
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none font-bold text-slate-800"
            >
              {(durationOptions || DEFAULT_DURATION_OPTIONS).map((m) => (
                <option key={m} value={m}>
                  Duration: {m} min
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1 px-1">
              Choose time as per exam pattern.
            </p>
          </div>

          {/* Keyboard toggle — for any non-English language */}
          {isNonEnglish && (
            <button
              onClick={() => setShowKeyboard(s => !s)}
              className={`ml-auto flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                showKeyboard
                  ? 'bg-sky-500 border-sky-500 text-black'
                  : 'border-sky-200 text-sky-600 hover:bg-sky-50'
              }`}
            >
              {showKeyboard ? <X size={16} /> : <Keyboard size={16} />}
              {showKeyboard ? 'Keyboard Band Karein' : 'Keyboard Dekhein'}
            </button>
          )}
        </div>
        )}

        {/* Focus Mode banner */}
        {isFocusMode && (
          <div className="bg-black text-white rounded-2xl px-5 py-3 mb-6 flex items-center justify-between">
            <div>
              <p className="font-extrabold tracking-tight">Focus Mode</p>
              <p className="text-xs text-slate-300">
                Duration: <span className="font-bold text-sky-400">{durationMin} min</span> • Distraction-free view enabled
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-sky-100 transition-colors"
            >
              Exit
            </button>
          </div>
        )}

        {/* ── Hindi system notice ── */}
        {isHindi && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ Hindi typing ke liye apne system mein{' '}
              <strong>{language === 'hindi_inscript' ? 'Inscript (Mangal)' : 'Remington Gail (Krutidev)'}</strong>{' '}
              layout enable hona chahiye. Windows: Settings → Time & Language → Language → Hindi → Options
            </p>
            <button
              onClick={() => navigate('/hindi-keyboard')}
              className="flex items-center gap-1.5 bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-amber-700 transition-colors"
            >
              <ExternalLink size={12} /> Pura Guide
            </button>
          </div>
        )}

        {/* ── Two-column when keyboard open, single column otherwise ── */}
        <div className={`${isNonEnglish && showKeyboard ? 'grid grid-cols-1 xl:grid-cols-[1fr_620px] gap-6 items-start' : ''}`}>

          {/* ── Left: Typing area ── */}
          <div>
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-4 overflow-hidden">
              {/* Passage display */}
              <div
                // Keep this compact so passage + typing box are visible together (same feel as earlier UI).
                className="text-base md:text-lg leading-[1.7] mb-5 text-slate-300 font-medium relative h-[220px] md:h-[260px] overflow-hidden"
                style={{ fontFamily: isHindi ? 'sans-serif' : undefined }}
              >
                {(() => {
                  /**
                   * UI/UX: Keep the passage box practical.
                   * Show only a "window" of text around the cursor.
                   * When user finishes what's visible, the next part becomes visible automatically.
                   */
                  const cursor = userInput.length;
                  const WINDOW_BEFORE = 60;
                  const WINDOW_SIZE = 950;
                  let start = Math.max(0, cursor - WINDOW_BEFORE);

                  // try not to start in the middle of a word (for English)
                  if (!isHindi && language === 'english' && start > 0) {
                    const prevSpace = text.lastIndexOf(' ', start);
                    if (prevSpace > 0 && start - prevSpace < 40) start = prevSpace + 1;
                  }

                  const end = Math.min(text.length, start + WINDOW_SIZE);
                  const display = text.slice(start, end);

                  return (
                    <>
                      <div className="absolute inset-0 pointer-events-none z-10">
                        {display.split('').map((char, localIdx) => {
                          const globalIdx = start + localIdx;
                          let color = 'text-slate-300';
                          let underline = '';
                          if (globalIdx === cursor && !isFinished) {
                            underline = 'border-b-4 border-sky-500 animate-pulse';
                          }
                          if (globalIdx < cursor) {
                            color =
                              userInput[globalIdx] === char
                                ? 'text-slate-900'
                                : 'text-red-600 bg-red-100 rounded-sm';
                          }
                          return (
                            <span key={globalIdx} className={`${color} ${underline} transition-all duration-75`}>
                              {char}
                            </span>
                          );
                        })}
                      </div>
                      {/* Invisible text only for layout sizing (keep box height practical) */}
                      <div className="opacity-0 whitespace-pre-wrap">{display}</div>
                    </>
                  );
                })()}
              </div>

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onPaste={(e) => e.preventDefault()}
                disabled={isFinished}
                autoFocus
                lang={langOption.langTag}
                dir={langOption.dir}
                className="w-full h-28 md:h-32 p-4 md:p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-sky-500 focus:bg-white outline-none resize-none text-lg md:text-xl leading-relaxed transition-all shadow-inner font-medium"
                placeholder={isHindi ? 'यहाँ टाइप करना शुरू करें...' : 'The clock starts when you type your first letter...'}
                style={{ fontFamily: isHindi ? 'sans-serif' : undefined }}
              />
            </div>

            {/* Controls row */}
            <div className="flex justify-between items-center mb-6">
              {!isPremium && (
                <div className="flex items-center gap-2 text-amber-600 font-medium text-sm">
                  <Zap size={16} />
                  Free Trials: {3 - trialsUsed} left
                </div>
              )}
              <div className="flex-1"></div>
              <button
                onClick={resetTest}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
              >
                <RotateCcw size={18} /> Restart
              </button>
            </div>

            {/* Result banner */}
            {isFinished && (
              <div className="mt-2 bg-sky-900 text-white p-8 rounded-3xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {isHindi ? 'शाबाश! बहुत अच्छा!' : 'Great Job!'}
                    </h3>
                    <p className="text-sky-200">
                      Result: <strong>{wpm} WPM</strong> • <strong>{accuracy}%</strong> accuracy • <strong>{durationMin} min</strong>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate('/analytics')}
                      className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-sky-100 transition-colors"
                    >
                      View Analytics
                    </button>
                    <button
                      onClick={() => navigate('/exams')}
                      className="bg-black/30 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-black/40 transition-colors"
                    >
                      Back to Exams
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs font-bold text-sky-200 uppercase">Typed Characters</p>
                    <p className="text-2xl font-extrabold">{userInput.length}</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs font-bold text-sky-200 uppercase">Correct Characters</p>
                    <p className="text-2xl font-extrabold">
                      {(() => {
                        let c = 0;
                        for (let i = 0; i < userInput.length; i++) if (userInput[i] === text[i]) c++;
                        return c;
                      })()}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs font-bold text-sky-200 uppercase">Errors</p>
                    <p className="text-2xl font-extrabold text-amber-200">
                      {(() => {
                        let c = 0;
                        for (let i = 0; i < userInput.length; i++) if (userInput[i] === text[i]) c++;
                        return Math.max(0, userInput.length - c);
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Keyboard (sticky alongside typing area) ── */}
          {isNonEnglish && showKeyboard && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24 self-start overflow-x-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Keyboard size={18} className="text-sky-500" /> {keyboardPanelTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Key par click karein — character type hoga (cursor position par)
                  </p>
                </div>
                {isHindi && (
                  <button
                    onClick={() => navigate('/hindi-keyboard')}
                    className="flex items-center gap-1.5 text-sky-600 hover:text-sky-800 text-sm font-bold transition-colors"
                  >
                    <ExternalLink size={14} /> Pura Page
                  </button>
                )}
              </div>

              {isHindi ? (
                <HindiKeyboard
                  layout={hindiLayout}
                  onLayoutChange={(l) => {
                    setHindiLayout(l);
                    handleLanguageChange(l === 'inscript' ? 'hindi_inscript' : 'hindi_remington');
                  }}
                  showLayoutToggle={true}
                  compact={true}
                />
              ) : (
                <VirtualKeyboard
                  value={userInput}
                  onChange={(next) => {
                    // Re-use same accuracy logic: easiest is to just update input value and let effect calculate on next change
                    // We intentionally route via a synthetic event-equivalent path.
                    setUserInput(next);

                    const charCount = next.length;
                    let correctChars = 0;
                    for (let i = 0; i < charCount; i++) {
                      if (next[i] === text[i]) correctChars++;
                    }
                    setAccuracy(charCount === 0 ? 100 : Math.round((correctChars / charCount) * 100));

                    if (!startTime && next.length > 0) handleStart();
                    extendTextIfNeeded(next.length);
                  }}
                  textareaRef={inputRef}
                  layout={getVirtualKeyboardLayout(language)}
                  rtl={langOption.dir === 'rtl'}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
