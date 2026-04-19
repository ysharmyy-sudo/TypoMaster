import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageSkeleton } from '../components/SkeletonLoader';
import { RotateCcw, Zap, AlertCircle, Keyboard, X, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import HindiKeyboard, { type HindiLayout } from '../components/HindiKeyboard';

// ─── Text Banks ─────────────────────────────────────────────────────────────

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

type Language = 'english' | 'inscript' | 'remington';

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
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [trialError, setTrialError] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Init ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    const examId = params.get('exam');
    const title = params.get('title');

    if (title) setExamTitle(title);

    let selectedText = '';
    if (gameId) {
      selectedText = "The game mode is active. Focus on every character to master the speed challenge!";
    } else if (examId && ENGLISH_TEXTS[examId]) {
      const texts = ENGLISH_TEXTS[examId];
      selectedText = texts[Math.floor(Math.random() * texts.length)];
    } else {
      const texts = ENGLISH_TEXTS['default'];
      selectedText = texts[Math.floor(Math.random() * texts.length)];
    }

    setText(selectedText || ENGLISH_TEXTS['default'][0]);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // ── Language change ──
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeLeft(60);
    setTrialError(false);

    if (lang === 'english') {
      const texts = ENGLISH_TEXTS['default'];
      setText(texts[Math.floor(Math.random() * texts.length)]);
      setShowKeyboard(false);
    } else {
      setText(HINDI_TEXTS[Math.floor(Math.random() * HINDI_TEXTS.length)]);
      if (lang === 'inscript') setHindiLayout('inscript');
      else setHindiLayout('remington');
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
    if (value === text || value.length >= text.length) handleFinish();
  };

  // ── Finish ──
  const handleFinish = () => {
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
    setTimeLeft(60);
    setTrialError(false);

    if (language === 'english') {
      const keys = Object.keys(ENGLISH_TEXTS);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const texts = ENGLISH_TEXTS[randomKey];
      setText(texts[Math.floor(Math.random() * texts.length)]);
    } else {
      setText(HINDI_TEXTS[Math.floor(Math.random() * HINDI_TEXTS.length)]);
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

  const isHindi = language !== 'english';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className={`mx-auto transition-all duration-300 ${isHindi && showKeyboard ? 'max-w-[1400px]' : 'max-w-4xl'}`}>

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
              <span className="text-2xl font-bold text-sky-400">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* ── Language Toggle Bar ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden md:block">भाषा / Language</span>
          
          {[
            { id: 'english' as Language, label: 'English', sub: 'SSC / IBPS' },
            { id: 'inscript' as Language, label: 'हिंदी — Inscript', sub: 'Mangal / Unicode' },
            { id: 'remington' as Language, label: 'हिंदी — Remington', sub: 'Krutidev / State' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`flex-1 md:flex-none flex flex-col items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                language === lang.id
                  ? 'bg-black text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {lang.label}
              <span className={`text-[10px] font-normal mt-0.5 ${language === lang.id ? 'text-slate-400' : 'text-slate-400'}`}>
                {lang.sub}
              </span>
            </button>
          ))}

          {/* Keyboard reference button — only for Hindi */}
          {isHindi && (
            <button
              onClick={() => setShowKeyboard(s => !s)}
              className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
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

        {/* ── Hindi system notice ── */}
        {isHindi && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ Hindi typing ke liye apne system mein{' '}
              <strong>{language === 'inscript' ? 'Inscript (Mangal)' : 'Remington Gail (Krutidev)'}</strong>{' '}
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
        <div className={`${isHindi && showKeyboard ? 'grid grid-cols-1 xl:grid-cols-[1fr_620px] gap-6 items-start' : ''}`}>

          {/* ── Left: Typing area ── */}
          <div>
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-4 overflow-hidden">
              {/* Passage display */}
              <div
                className="text-xl md:text-2xl leading-[1.8] mb-8 text-slate-300 font-medium relative min-h-[100px]"
                style={{ fontFamily: isHindi ? 'sans-serif' : undefined }}
              >
                <div className="absolute inset-0 pointer-events-none z-10">
                  {text.split('').map((char, index) => {
                    let color = 'text-slate-300';
                    let underline = '';
                    if (index === userInput.length && !isFinished) {
                      underline = 'border-b-4 border-sky-500 animate-pulse';
                    }
                    if (index < userInput.length) {
                      color = userInput[index] === char
                        ? 'text-slate-900'
                        : 'text-red-600 bg-red-100 rounded-sm';
                    }
                    return (
                      <span key={index} className={`${color} ${underline} transition-all duration-75`}>
                        {char}
                      </span>
                    );
                  })}
                </div>
                <div className="opacity-0">{text}</div>
              </div>

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                onPaste={(e) => e.preventDefault()}
                disabled={isFinished}
                autoFocus
                lang={isHindi ? 'hi' : 'en'}
                className="w-full h-40 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-sky-500 focus:bg-white outline-none resize-none text-xl md:text-2xl leading-relaxed transition-all shadow-inner font-medium"
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
              <div className="mt-2 bg-sky-900 text-white p-8 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {isHindi ? 'शाबाश! बहुत अच्छा!' : 'Great Job!'}
                  </h3>
                  <p className="text-sky-200">
                    You completed the test with <strong>{wpm} WPM</strong> and <strong>{accuracy}%</strong> accuracy.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/exams')}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-sky-100 transition-colors"
                >
                  Back to Exams
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Keyboard (sticky alongside typing area) ── */}
          {isHindi && showKeyboard && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24 self-start overflow-x-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Keyboard size={18} className="text-sky-500" /> Keyboard Reference
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Key par click karein — character bada dikhega
                  </p>
                </div>
                <button
                  onClick={() => navigate('/hindi-keyboard')}
                  className="flex items-center gap-1.5 text-sky-600 hover:text-sky-800 text-sm font-bold transition-colors"
                >
                  <ExternalLink size={14} /> Pura Page
                </button>
              </div>
              <HindiKeyboard
                layout={hindiLayout}
                onLayoutChange={(l) => {
                  setHindiLayout(l);
                  handleLanguageChange(l === 'inscript' ? 'inscript' : 'remington');
                }}
                showLayoutToggle={true}
                compact={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
