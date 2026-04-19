import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard, ArrowLeft, BookOpen, Info } from 'lucide-react';
import HindiKeyboard, { type HindiLayout } from '../components/HindiKeyboard';

const HindiKeyboardPage = () => {
  const [layout, setLayout] = useState<HindiLayout>('inscript');
  const navigate = useNavigate();

  const layoutInfo = {
    inscript: {
      fullName: 'Inscript (Mangal / Unicode)',
      exams: ['SSC CGL Skill Test', 'SSC CHSL', 'Stenographer Grade C & D', 'RRB NTPC', 'CPCT (MP)'],
      about:
        'Inscript (Indian Script) layout bharat sarkar ka manya standard hai. Isme vowels keyboard ke bayi taraf aur consonants dayi taraf hote hain. Yeh layout Unicode/Mangal font ke saath kaam karta hai aur modern government exams mein istemaal hota hai.',
      tip: 'Home row yaad rakhen: A=ो S=े D=् F=ि G=ु | H=प J=र K=क L=त',
    },
    remington: {
      fullName: 'Remington Gail (Krutidev / Non-Unicode)',
      exams: ['UPSSSC VDO', 'Bihar SSC (BSSC)', 'MP State Exams', 'Rajasthan RSMSSB', 'Haryana SSC'],
      about:
        'Remington Gail layout purane typewriter machines par aadharit hai. Iska mapping phonetic nahi hai — ise ratt ke seekhna padta hai. State level exams, khaaskar UP, Bihar, aur MP mein yahi layout standard hai.',
      tip: 'Yahan Q=ौ, W=ा, E=म, R=त, T=ज yaad karein — ye sabse zyada use hote hain.',
    },
  };

  const info = layoutInfo[layout];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-black text-white px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Wapas Jaaein
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-sky-500 p-2.5 rounded-xl">
                  <Keyboard size={24} className="text-black" />
                </div>
                <span className="text-sky-400 font-bold text-sm uppercase tracking-widest">Hindi Virtual Keyboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                हिंदी <span className="text-sky-400">कीबोर्ड</span> मार्गदर्शिका
              </h1>
              <p className="text-slate-400 max-w-xl">
                Dono lipiyon ka poora keyboard layout ek jagah. Key par click karein aur turant dekhein ki kaunsa Hindi akshar type hoga.
              </p>
            </div>

            {/* Layout selector — big cards */}
            <div className="flex gap-3">
              {(['inscript', 'remington'] as HindiLayout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                    layout === l
                      ? 'bg-sky-500 border-sky-500 text-black'
                      : 'border-slate-600 text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {l === 'inscript' ? '⌨ Inscript' : '⌨ Remington Gail'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 space-y-10">

        {/* Layout Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-sky-500" />
              <h3 className="font-bold text-lg">{info.fullName}</h3>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">{info.about}</p>
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">💡 Tip</p>
              <p className="text-sm text-sky-900 font-mono">{info.tip}</p>
            </div>
          </div>

          {/* Exams */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <h3 className="font-bold text-lg mb-4">Ye layout kin exams mein hai?</h3>
            <ul className="space-y-3">
              {info.exams.map((exam) => (
                <li key={exam} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></div>
                  <span className="text-slate-700 text-sm font-medium">{exam}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The Keyboard */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">
            Virtual Keyboard —{' '}
            <span className="text-sky-600">{layout === 'inscript' ? 'Inscript' : 'Remington Gail'}</span>
          </h2>
          <HindiKeyboard
            layout={layout}
            onLayoutChange={setLayout}
            showLayoutToggle={false}
            compact={false}
          />
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Inscript vs Remington Gail — Farq kya hai?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-3 pr-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Visheshta</th>
                  <th className="text-left py-3 pr-6 font-bold text-sky-600 uppercase tracking-wider text-xs">Inscript</th>
                  <th className="text-left py-3 font-bold text-violet-600 uppercase tracking-wider text-xs">Remington Gail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ['Font/Encoding', 'Mangal (Unicode)', 'Krutidev (Non-Unicode)'],
                  ['Layout Type', 'GoI Standard', 'Typewriter-based'],
                  ['Learning Curve', 'Thoda mushkil', 'Zyada mushkil'],
                  ['Exams', 'Central Govt (SSC, RRB)', 'State Govt (UP, Bihar, MP)'],
                  ['System Support', 'Windows mein built-in', 'Font install karna padta hai'],
                  ['Future', 'Unicode standard — future-proof', 'Purana format — declining'],
                ].map(([feat, ins, rem]) => (
                  <tr key={feat} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-6 font-semibold text-slate-700">{feat}</td>
                    <td className="py-3 pr-6 text-slate-600">{ins}</td>
                    <td className="py-3 text-slate-600">{rem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-black rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ab practice karein!</h3>
            <p className="text-slate-400">Layout samajh aa gaya? Typing test mein Hindi paragraphs type karke apni speed badhaaein.</p>
          </div>
          <button
            onClick={() => navigate('/typing-test')}
            className="bg-sky-500 text-black px-8 py-4 rounded-2xl font-bold hover:bg-sky-400 transition-all whitespace-nowrap"
          >
            Hindi Typing Test Shuru Karein →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HindiKeyboardPage;
