import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Play, Lock, Trophy, Zap, Star } from 'lucide-react';

const Games = () => {
  const [loading, setLoading] = useState(true);
  const { isPremium, trialsUsed } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const levels = [
    {
      name: 'Beginner',
      level: 1,
      color: 'border-green-200 bg-green-50',
      icon: <Star className="text-green-600" />,
      games: [
        { id: 'f1', name: 'Word Rain', desc: 'Type falling words before they hit the ground.', free: true },
        { id: 'f2', name: 'Home Row Dash', desc: 'Master the home row keys with speed.', free: true },
        { id: 'f3', name: 'Alphabet Soup', desc: 'Find and type letters in sequence.', free: true }
      ]
    },
    {
      name: 'Medium',
      level: 2,
      color: 'border-blue-200 bg-blue-50',
      icon: <Zap className="text-blue-600" />,
      games: [
        { id: 'm1', name: 'Sentence Sprinter', desc: 'Type full sentences in a race against time.', free: false },
        { id: 'm2', name: 'Punctuation Panic', desc: 'Improve your special character speed.', free: false },
        { id: 'm3', name: 'Number Ninja', desc: 'Conquer the number row like a pro.', free: false }
      ]
    },
    {
      name: 'Advanced',
      level: 3,
      color: 'border-purple-200 bg-purple-50',
      icon: <Trophy className="text-purple-600" />,
      games: [
        { id: 'a1', name: 'Coding Catalyst', desc: 'Type actual code snippets accurately.', free: false },
        { id: 'a2', name: 'Stress Test', desc: 'High-speed typing under pressure.', free: false },
        { id: 'a3', name: 'Blind Typist', desc: 'Memory-based typing challenge.', free: false }
      ]
    }
  ];

  const handlePlay = (gameId: string, isFree: boolean) => {
    if (!isPremium && !isFree) {
      navigate('/pricing');
      return;
    }
    if (!isPremium && trialsUsed >= 3) {
      navigate('/typing-test'); // Will show trial error there
      return;
    }
    navigate(`/typing-test?game=${gameId}`);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">Arcade <span className="text-sky-500">Mode</span></h1>
            <p className="text-slate-600 text-lg max-w-xl">
              Turn practice into play. Build muscle memory through engaging games designed by typing experts.
            </p>
          </div>
          {!isPremium && (
            <div className="bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-4">
              <div className="bg-sky-500 p-2 rounded-lg">
                <Zap size={20} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Trial Access</p>
                <p className="font-bold">{3 - trialsUsed} Games Left</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-16">
          {levels.map((level) => (
            <div key={level.name}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-lg ${level.color}`}>
                  {level.icon}
                </div>
                <h2 className="text-2xl font-bold">{level.name} Level</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {level.games.map((game) => (
                  <div 
                    key={game.id}
                    className="group border border-slate-200 rounded-3xl p-8 hover:border-black transition-all hover:shadow-xl relative overflow-hidden"
                  >
                    {!isPremium && !game.free && (
                      <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full">
                        <Lock size={16} className="text-slate-400" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3">{game.name}</h3>
                    <p className="text-slate-500 mb-8">{game.desc}</p>
                    <button 
                      onClick={() => handlePlay(game.id, game.free)}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        !isPremium && !game.free 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-black text-white group-hover:bg-sky-500 group-hover:text-black'
                      }`}
                    >
                      {!isPremium && !game.free ? 'Premium Only' : (
                        <><Play size={18} fill="currentColor" /> Play Now</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
