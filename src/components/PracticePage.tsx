import { useState } from 'react';

interface PracticePageProps {
  onStartCustom: (text: string) => void;
}

export default function PracticePage({ onStartCustom }: PracticePageProps) {
  const [customText, setCustomText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('quotes');

  const practiceTexts = {
    quotes: [
      "The only way to do great work is to love what you do.",
      "Innovation distinguishes between a leader and a follower.",
      "Life is what happens when you're busy making other plans.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    ],
    pangrams: [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "How vexingly quick daft zebras jump!",
      "Sphinx of black quartz, judge my vow.",
      "Jackdaws love my big sphinx of quartz.",
    ],
    code: [
      "function hello() { console.log('Hello World'); }",
      "const array = [1, 2, 3, 4, 5];",
      "import React from 'react';",
      "export default function App() { return null; }",
      "const result = await fetch('/api/data');",
    ],
    numbers: [
      "1234567890 0987654321 12345 67890",
      "The year 2024 is here. Call me at 555-1234.",
      "My address is 123 Main St, Apt 456.",
      "The price is $99.99, save 50% today!",
      "Temperature: 72°F, Humidity: 65%, Wind: 10mph",
    ],
  };

  const categories = [
    { id: 'quotes', name: 'Famous Quotes', icon: '💬', description: 'Practice with inspirational quotes' },
    { id: 'pangrams', name: 'Pangrams', icon: '🔤', description: 'Sentences using every letter' },
    { id: 'code', name: 'Code Snippets', icon: '💻', description: 'Practice programming syntax' },
    { id: 'numbers', name: 'Numbers & Symbols', icon: '🔢', description: 'Master numbers and special characters' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Practice Mode</h1>
          <p className="mt-2 text-lg text-slate-600">Choose your practice material or create your own</p>
        </div>

        {/* Custom Text Input */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Custom Practice</h2>
          <p className="mb-4 text-slate-600">Enter your own text to practice with</p>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type or paste your custom text here..."
            className="mb-4 h-32 w-full resize-none rounded-xl border-2 border-slate-200 p-4 font-mono text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
          <button
            onClick={() => customText.trim() && onStartCustom(customText)}
            disabled={!customText.trim()}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Start Custom Practice
          </button>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Practice Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-2xl border-2 p-6 text-left transition-all ${
                  selectedCategory === category.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100'
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className="mb-1 font-bold text-slate-900">{category.name}</h3>
                <p className="text-sm text-slate-600">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Practice Texts */}
        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
          <h3 className="mb-4 text-xl font-bold text-slate-900">
            {categories.find(c => c.id === selectedCategory)?.name} Texts
          </h3>
          <div className="space-y-3">
            {practiceTexts[selectedCategory as keyof typeof practiceTexts].map((text, index) => (
              <div
                key={index}
                className="group flex items-center justify-between gap-4 rounded-xl border-2 border-slate-200 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <p className="flex-1 font-mono text-slate-700">{text}</p>
                <button
                  onClick={() => onStartCustom(text)}
                  className="flex-shrink-0 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-600 hover:shadow-lg"
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-slate-900">💡 Practice Tips</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Focus on Accuracy</h4>
              <p className="text-sm text-slate-600">Speed will come naturally as your accuracy improves.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Maintain Good Posture</h4>
              <p className="text-sm text-slate-600">Sit up straight with feet flat on the floor.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Use All Fingers</h4>
              <p className="text-sm text-slate-600">Keep your fingers on the home row keys.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
