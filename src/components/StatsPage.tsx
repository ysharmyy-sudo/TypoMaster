import { User, Achievement } from '../types';

interface StatsPageProps {
  user: User;
  achievements: Achievement[];
}

export default function StatsPage({ user, achievements }: StatsPageProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const stats = [
    { label: 'Typing Speed', value: `${user.wpm} WPM`, icon: '⚡', color: 'blue' },
    { label: 'Accuracy', value: `${user.accuracy}%`, icon: '🎯', color: 'emerald' },
    { label: 'Lessons Completed', value: user.lessonsCompleted, icon: '📚', color: 'indigo' },
    { label: 'Total XP', value: user.xp, icon: '⭐', color: 'amber' },
    { label: 'Day Streak', value: `${user.streak} days`, icon: '🔥', color: 'orange' },
    { label: 'Practice Time', value: `${Math.floor(user.totalTime / 60)}h ${user.totalTime % 60}m`, icon: '⏱️', color: 'purple' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; shadow: string }> = {
      blue: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600', shadow: 'shadow-blue-200' },
      emerald: { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-600', shadow: 'shadow-emerald-200' },
      indigo: { bg: 'from-indigo-500 to-violet-500', text: 'text-indigo-600', shadow: 'shadow-indigo-200' },
      amber: { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-600', shadow: 'shadow-amber-200' },
      orange: { bg: 'from-orange-500 to-red-500', text: 'text-orange-600', shadow: 'shadow-orange-200' },
      purple: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-600', shadow: 'shadow-purple-200' },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Your Statistics</h1>
          <p className="mt-2 text-lg text-slate-600">Track your progress and achievements</p>
        </div>

        {/* User Profile Card */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 p-8 text-white shadow-2xl shadow-indigo-200">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold backdrop-blur-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="mt-1 text-indigo-100">Level {user.level} Typist</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
                <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <p className="text-xs text-indigo-100">Current Level</p>
                  <p className="text-xl font-bold">{user.level}</p>
                </div>
                <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <p className="text-xs text-indigo-100">Total XP</p>
                  <p className="text-xl font-bold">{user.xp}</p>
                </div>
                <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <p className="text-xs text-indigo-100">Achievements</p>
                  <p className="text-xl font-bold">{unlockedAchievements.length}/{achievements.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const colors = getColorClasses(stat.color);
            return (
              <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colors.bg} text-3xl shadow-lg ${colors.shadow}`}>
                  {stat.icon}
                </div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className={`text-3xl font-bold ${colors.text}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Progress Chart Placeholder */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Progress Over Time</h2>
          <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="text-center">
              <div className="mb-3 text-5xl">📈</div>
              <p className="text-slate-600">Your progress chart will appear here</p>
              <p className="text-sm text-slate-500">Keep practicing to see your improvement!</p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
            <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-600">
              {unlockedAchievements.length}/{achievements.length} Unlocked
            </span>
          </div>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-700">Unlocked</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="relative overflow-hidden rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4"
                  >
                    <div className="absolute right-2 top-2 text-xl">✨</div>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-2xl shadow-lg shadow-amber-200">
                      {achievement.icon}
                    </div>
                    <h4 className="mb-1 font-bold text-slate-900">{achievement.title}</h4>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-700">Locked</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 opacity-60"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-2xl">
                      🔒
                    </div>
                    <h4 className="mb-1 font-bold text-slate-900">{achievement.title}</h4>
                    <p className="mb-2 text-sm text-slate-600">{achievement.description}</p>
                    <div className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                      Requirement: {achievement.requirement} {achievement.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tips for Improvement */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
          <h3 className="mb-4 text-xl font-bold text-slate-900">💡 Tips to Improve</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Practice Daily</h4>
              <p className="text-sm text-slate-600">Even 15 minutes a day can make a huge difference in your typing speed.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Focus on Accuracy First</h4>
              <p className="text-sm text-slate-600">Speed will naturally increase as your accuracy improves.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Use All Fingers</h4>
              <p className="text-sm text-slate-600">Proper finger placement is key to becoming a fast typist.</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <h4 className="mb-2 font-semibold text-slate-900">Take Breaks</h4>
              <p className="text-sm text-slate-600">Rest your hands and eyes to avoid fatigue and maintain performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
