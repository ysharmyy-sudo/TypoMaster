import { GameMode } from '../types';

interface GamesPageProps {
  onStartGame: (gameId: string) => void;
}

export default function GamesPage({ onStartGame }: GamesPageProps) {

  const games: GameMode[] = [
    {
      id: 'word-rain',
      name: 'Word Rain',
      description: 'Type falling words before they hit the ground!',
      icon: '🌧️',
      difficulty: 'Medium',
    },
    {
      id: 'speed-test',
      name: 'Speed Test',
      description: 'Test your typing speed in 60 seconds',
      icon: '⚡',
      difficulty: 'All Levels',
    },
    {
      id: 'accuracy-challenge',
      name: 'Accuracy Challenge',
      description: 'Type perfectly without making mistakes',
      icon: '🎯',
      difficulty: 'Hard',
    },
    {
      id: 'bubble-pop',
      name: 'Bubble Pop',
      description: 'Pop bubbles by typing the letters inside',
      icon: '🫧',
      difficulty: 'Easy',
    },
    {
      id: 'racing',
      name: 'Typing Race',
      description: 'Race against time and other players',
      icon: '🏁',
      difficulty: 'Medium',
    },
    {
      id: 'zombie-defense',
      name: 'Zombie Defense',
      description: 'Defend yourself by typing words quickly',
      icon: '🧟',
      difficulty: 'Hard',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Typing Games</h1>
          <p className="mt-2 text-lg text-slate-600">Learn while having fun with interactive games</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-4xl shadow-lg shadow-indigo-200">
                    {game.icon}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    game.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">{game.name}</h3>
                <p className="mb-6 text-sm text-slate-600">{game.description}</p>

                <button
                  onClick={() => onStartGame(game.id)}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl"
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-8">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">More Games Coming Soon!</h2>
            <p className="text-slate-600">We're working on exciting new games to make learning even more fun.</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 text-3xl">🎮</div>
            <h3 className="mb-2 font-bold text-slate-900">Learn While Playing</h3>
            <p className="text-sm text-slate-600">Games make practice enjoyable and engaging</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 text-3xl">🏆</div>
            <h3 className="mb-2 font-bold text-slate-900">Compete & Improve</h3>
            <p className="text-sm text-slate-600">Challenge yourself and track your progress</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-3 text-3xl">🚀</div>
            <h3 className="mb-2 font-bold text-slate-900">Build Muscle Memory</h3>
            <p className="text-sm text-slate-600">Repetitive gameplay reinforces typing skills</p>
          </div>
        </div>
      </div>
    </div>
  );
}
