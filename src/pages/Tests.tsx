import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Search, Play, Clock, BarChart3, Star, Zap } from 'lucide-react';

const Tests = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const testCategories = [
    {
      title: "Daily Mock Tests",
      description: "Fresh challenges every day to keep your fingers sharp.",
      icon: <Zap className="text-amber-500" />,
      tests: [
        { id: 'daily-1', title: 'Morning Warm-up', duration: '2 min', difficulty: 'Easy', users: '1.2k' },
        { id: 'daily-2', title: 'Speed Sprinter', duration: '5 min', difficulty: 'Medium', users: '800' },
        { id: 'daily-3', title: 'Endurance Pro', duration: '10 min', difficulty: 'Hard', users: '500' },
      ]
    },
    {
      title: "Previous Year Papers",
      description: "Actual paragraphs from SSC, IBPS, and State exams.",
      icon: <Clock className="text-sky-500" />,
      tests: [
        { id: 'ssc-cgl-2023', title: 'SSC CGL 2023 Slot 1', duration: '15 min', difficulty: 'Hard', users: '5.4k' },
        { id: 'chsl-2022', title: 'CHSL 2022 Typing', duration: '10 min', difficulty: 'Medium', users: '4.2k' },
        { id: 'rrb-ntpc-2021', title: 'RRB NTPC Typing', duration: '10 min', difficulty: 'Medium', users: '3.1k' },
      ]
    },
    {
      title: "Topic-wise Practice",
      description: "Focus on specific content types like News, Legal, or Tech.",
      icon: <BarChart3 className="text-emerald-500" />,
      tests: [
        { id: 'news-editorial', title: 'The Hindu Editorial', duration: '5 min', difficulty: 'Hard', users: '2.1k' },
        { id: 'legal-draft', title: 'Court Order Draft', duration: '10 min', difficulty: 'Hard', users: '1.5k' },
        { id: 'tech-blog', title: 'Technology Blog', duration: '5 min', difficulty: 'Easy', users: '900' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Typing <span className="text-sky-600">Test Library</span></h1>
          <p className="text-slate-600 max-w-2xl">
            Choose from hundreds of curated tests. Whether you want a quick 2-minute sprint or a full 15-minute exam simulation, we have it all.
          </p>
        </header>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-12 flex items-center shadow-sm">
          <Search className="text-slate-400 ml-4" />
          <input 
            type="text" 
            placeholder="Search for a specific test or exam paper..." 
            className="w-full px-4 py-3 outline-none text-lg"
          />
          <button className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Search
          </button>
        </div>

        <div className="space-y-16">
          {testCategories.map((category, idx) => (
            <section key={idx}>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-slate-500">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.tests.map((test) => (
                  <div 
                    key={test.id} 
                    className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-sky-500 transition-all hover:shadow-2xl group cursor-pointer"
                    onClick={() => navigate(`/typing-test?exam=${test.id}&title=${encodeURIComponent(test.title)}`)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-400">4.9/5</span>
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        test.difficulty === 'Hard' ? 'bg-red-50 text-red-500' : 
                        test.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 group-hover:text-sky-600 transition-colors">{test.title}</h3>
                    
                    <div className="flex items-center gap-6 mb-8 text-slate-400 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {test.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 size={16} />
                        {test.users} taken
                      </div>
                    </div>

                    <button className="w-full bg-slate-50 group-hover:bg-black group-hover:text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                      <Play size={18} fill="currentColor" /> Start Test
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 bg-sky-600 rounded-[3rem] p-12 text-white overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Want to create your own test?</h2>
              <p className="text-sky-100 mb-0">Paste your own custom text and practice in the simulator. Best for practicing specific documents or coding snippets.</p>
            </div>
            <button className="bg-white text-sky-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-sky-50 transition-all whitespace-nowrap">
              Custom Practice
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-700 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
