import { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson, TypingStats } from '../types';

interface TypingInterfaceProps {
  lesson: Lesson;
  onComplete: (stats: TypingStats) => void;
  onExit: () => void;
}

export default function TypingInterface({ lesson, onComplete, onExit }: TypingInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const text = lesson.content;
  const characters = text.split('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    let interval: number;
    if (startTime && !isFinished) {
      interval = window.setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const calculateStats = useCallback((): TypingStats => {
    const timeInMinutes = timeElapsed / 60;
    const wordsTyped = userInput.length / 5;
    const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    const accuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;
    const correctChars = userInput.length - errors;

    return {
      wpm,
      accuracy,
      errors,
      correctChars,
      totalChars: userInput.length,
      timeElapsed,
    };
  }, [userInput, errors, timeElapsed]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setUserInput(userInput.slice(0, -1));
      }
      return;
    }

    if (key.length === 1) {
      e.preventDefault();
      const expectedChar = characters[currentIndex];
      
      const newErrors = key === expectedChar ? errors : errors + 1;
      const newUserInput = userInput + key;
      const nextIndex = currentIndex + 1;

      setErrors(newErrors);
      setUserInput(newUserInput);
      setCurrentIndex(nextIndex);

      if (nextIndex === characters.length) {
        setIsFinished(true);
        // Calculate stats immediately with the final values
        const timeInMinutes = timeElapsed / 60;
        const wordsTyped = newUserInput.length / 5;
        const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
        const accuracy = newUserInput.length > 0 ? Math.round(((newUserInput.length - newErrors) / newUserInput.length) * 100) : 100;
        
        const finalStats: TypingStats = {
          wpm,
          accuracy,
          errors: newErrors,
          correctChars: newUserInput.length - newErrors,
          totalChars: newUserInput.length,
          timeElapsed,
        };

        setTimeout(() => {
          onComplete(finalStats);
        }, 500);
      }
    }
  };

  const handleTryAgain = () => {
    setCurrentIndex(0);
    setUserInput('');
    setErrors(0);
    setStartTime(null);
    setIsFinished(false);
    setTimeElapsed(0);
    inputRef.current?.focus();
  };

  const stats = calculateStats();
  const progress = (currentIndex / characters.length) * 100;

  const keyboardRows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Space']
  ];

  const getKeyClass = (key: string) => {
    const lowerKey = key.toLowerCase();
    const expectedChar = characters[currentIndex]?.toLowerCase();
    
    if (lowerKey === expectedChar || (key === 'Space' && expectedChar === ' ')) {
      return 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 scale-110';
    }
    
    if (lesson.keys && lesson.keys.includes(lowerKey)) {
      return 'bg-indigo-100 text-indigo-700';
    }
    
    return 'bg-white text-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 transition-all hover:bg-white hover:text-slate-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Exit</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-slate-900"
            >
              {showKeyboard ? 'Hide' : 'Show'} Keyboard
            </button>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
              <p className="mt-1 text-slate-500">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5">
              <span className="text-sm font-semibold text-indigo-600">+{lesson.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-md shadow-slate-200/50">
            <p className="text-xs font-medium text-slate-500">Speed</p>
            <p className="text-2xl font-bold text-slate-900">{stats.wpm} <span className="text-sm font-normal text-slate-500">WPM</span></p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md shadow-slate-200/50">
            <p className="text-xs font-medium text-slate-500">Accuracy</p>
            <p className="text-2xl font-bold text-slate-900">{stats.accuracy}%</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md shadow-slate-200/50">
            <p className="text-xs font-medium text-slate-500">Errors</p>
            <p className="text-2xl font-bold text-slate-900">{errors}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md shadow-slate-200/50">
            <p className="text-xs font-medium text-slate-500">Time</p>
            <p className="text-2xl font-bold text-slate-900">{timeElapsed}s</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Typing Area */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="mb-6 font-mono text-2xl leading-relaxed tracking-wide">
            {characters.map((char, index) => {
              let className = 'transition-all duration-150';
              
              if (index < currentIndex) {
                const userChar = userInput[index];
                className += userChar === char ? ' text-emerald-600' : ' text-red-500 bg-red-50';
              } else if (index === currentIndex) {
                className += ' bg-indigo-500 text-white rounded px-0.5 animate-pulse';
              } else {
                className += ' text-slate-400';
              }

              return (
                <span key={index} className={className}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            onKeyDown={handleKeyPress}
            autoFocus
          />

          {!startTime && (
            <p className="text-center text-sm text-slate-500">
              Start typing to begin...
            </p>
          )}
        </div>

        {/* Virtual Keyboard */}
        {showKeyboard && (
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="space-y-2">
              {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5">
                  {row.map((key) => {
                    const width = key === 'Space' ? 'w-64' : 
                                 key === 'Backspace' || key === 'Enter' || key === 'Shift' ? 'w-20' :
                                 key === 'Tab' || key === 'Caps' ? 'w-16' : 'w-10';
                    
                    return (
                      <div
                        key={key}
                        className={`${width} flex h-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium shadow-sm transition-all ${getKeyClass(key)}`}
                      >
                        {key === 'Space' ? '' : key}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {isFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-4xl shadow-lg shadow-emerald-200">
                  🎉
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Lesson Complete!</h2>
                <p className="mt-2 text-slate-500">Great job! Here are your results:</p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center">
                  <p className="text-sm font-medium text-slate-600">Speed</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.wpm}</p>
                  <p className="text-xs text-slate-500">WPM</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center">
                  <p className="text-sm font-medium text-slate-600">Accuracy</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.accuracy}%</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-4 text-center">
                  <p className="text-sm font-medium text-slate-600">Errors</p>
                  <p className="text-3xl font-bold text-orange-600">{errors}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 p-4 text-center">
                  <p className="text-sm font-medium text-slate-600">XP Earned</p>
                  <p className="text-3xl font-bold text-amber-600">+{lesson.xpReward}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onExit}
                  className="flex-1 rounded-xl border-2 border-slate-200 py-3 font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to Lessons
                </button>
                <button
                  onClick={handleTryAgain}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
