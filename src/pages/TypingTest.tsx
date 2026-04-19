import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageSkeleton } from '../components/SkeletonLoader';
import { RotateCcw, Zap, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_TEXTS: Record<string, string[]> = {
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

const TypingTest = () => {
  const [loading, setLoading] = useState(true);
  const { useTrial, trialsUsed, isPremium } = useAppContext();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    const examId = params.get('exam');
    const title = params.get('title');
    
    if (title) setExamTitle(title);

    let selectedText = "";
    if (gameId) {
      selectedText = "The game mode is active. Focus on every character to master the speed challenge!";
    } else if (examId && SAMPLE_TEXTS[examId]) {
      const texts = SAMPLE_TEXTS[examId];
      selectedText = texts[Math.floor(Math.random() * texts.length)];
    } else {
      const texts = SAMPLE_TEXTS['default'];
      selectedText = texts[Math.floor(Math.random() * texts.length)];
    }
    
    setText(selectedText || SAMPLE_TEXTS['default'][0]);
    
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (startTime && !isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
        
        const timePassed = (Date.now() - startTime) / 60000;
        const wordsTyped = userInput.trim().split(/\s+/).length;
        if (timePassed > 0) {
          setWpm(Math.round(wordsTyped / timePassed));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished, timeLeft, userInput]);

  const handleStart = () => {
    if (!isPremium && trialsUsed >= 3) {
      setTrialError(true);
      return;
    }
    
    if (!startTime) {
      const allowed = useTrial();
      if (!allowed) {
        setTrialError(true);
        return;
      }
      setStartTime(Date.now());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    const value = e.target.value;
    
    // Auto-start on first key press
    if (!startTime && value.length > 0) {
      handleStart();
    }
    
    setUserInput(value);

    // Calculate accuracy
    const charCount = value.length;
    let correctChars = 0;
    for (let i = 0; i < charCount; i++) {
      if (value[i] === text[i]) correctChars++;
    }
    setAccuracy(charCount === 0 ? 100 : Math.round((correctChars / charCount) * 100));

    // Check if finished by length or text match
    if (value === text || value.length >= text.length) {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#ffffff', '#000000']
    });
  };

  const resetTest = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeLeft(60);
    const keys = Object.keys(SAMPLE_TEXTS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const texts = SAMPLE_TEXTS[randomKey];
    setText(texts[Math.floor(Math.random() * texts.length)]);
    setTrialError(false);
  };

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
          <button 
            onClick={() => navigate('/pricing')}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all mb-4"
          >
            View Pricing Plans
          </button>
          <button 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-black font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Typing <span className="text-sky-600">Arena</span></h1>
            <p className="text-slate-500 font-medium">Simulation: <span className="text-black font-bold">{examTitle}</span></p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-bold text-slate-400 uppercase">WPM</span>
              <span className="text-2xl font-bold text-sky-600">{wpm}</span>
            </div>
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-bold text-slate-400 uppercase">Accuracy</span>
              <span className="text-2xl font-bold text-sky-600">{accuracy}%</span>
            </div>
            <div className="bg-black text-white px-6 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-bold text-slate-400 uppercase">Time</span>
              <span className="text-2xl font-bold text-sky-400">{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 overflow-hidden">
          <div className="text-2xl leading-[1.6] mb-10 text-slate-300 font-medium relative min-h-[120px]">
            <div className="absolute inset-0 pointer-events-none z-10">
              {text.split('').map((char, index) => {
                let color = "text-slate-300";
                let underline = "";
                if (index === userInput.length && !isFinished) {
                   underline = "border-b-4 border-sky-500 animate-pulse";
                }
                if (index < userInput.length) {
                  color = userInput[index] === char ? "text-slate-900" : "text-red-600 bg-red-100 rounded-sm";
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

          <div className="relative">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onPaste={(e) => e.preventDefault()}
              disabled={isFinished}
              autoFocus
              className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-sky-500 focus:bg-white outline-none resize-none text-2xl leading-relaxed transition-all shadow-inner font-medium"
              placeholder="The clock starts when you type your first letter..."
            />
            {!startTime && !isFinished && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-sky-500 text-black px-6 py-2 rounded-full font-bold animate-bounce shadow-lg">
                  Click here and start typing!
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
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

        {isFinished && (
          <div className="mt-8 bg-sky-900 text-white p-8 rounded-3xl flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">Great Job!</h3>
              <p className="text-sky-200">You completed the test with {wpm} WPM and {accuracy}% accuracy.</p>
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
    </div>
  );
};

export default TypingTest;
