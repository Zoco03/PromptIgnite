import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, Star, Zap, Award, Flame, 
  ArrowUp, ArrowDown, Minus, Filter, Sparkles 
} from 'lucide-react';
import { PromoBadge, VerifiedBadge, FilterChip } from '../common/Badge';

export const LeaderboardView: React.FC = () => {
  const { 
    leaderboard, 
    allUsers, 
    setViewedUserId, 
    setCurrentTab 
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [timeframe, setTimeframe] = useState<'all_time' | 'weekly'>('all_time');

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Design & Human-Computer Interaction',
    'Electrical & Electronics',
    'Business & Management'
  ];

  const filteredLeaderboard = leaderboard.filter(entry => 
    selectedDept === 'All' || entry.department === selectedDept
  );

  const handleOpenUser = (userId: string) => {
    setViewedUserId(userId);
    setCurrentTab('portfolio');
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>CAMPUS KARMA & REPUTATION SYSTEM (PRD 3.13)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            CAMPUS LEADERBOARDS & KARMA
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Ranked by verified peer tutoring sessions, learner ratings, workshops hosted, and verification challenge scores. Karma directly boosts your discovery rank in search.
          </p>
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center bg-soft-cloud p-1 rounded-full border border-hairline">
          <button
            onClick={() => setTimeframe('all_time')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              timeframe === 'all_time' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              timeframe === 'weekly' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            This Semester
          </button>
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {departments.map(d => (
          <FilterChip
            key={d}
            label={d === 'All' ? 'All Departments' : d.split('&')[0]}
            active={selectedDept === d}
            onClick={() => setSelectedDept(d)}
          />
        ))}
      </div>

      {/* Podium Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredLeaderboard.slice(0, 3).map((entry, idx) => (
          <div 
            key={entry.userId}
            onClick={() => handleOpenUser(entry.userId)}
            className={`bg-canvas border p-6 flex flex-col justify-between cursor-pointer hover:border-ink transition-all group ${
              idx === 0 ? 'border-ink shadow-md relative' : 'border-hairline'
            }`}
          >
            {idx === 0 && (
              <div className="absolute -top-3 right-6 bg-sale text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight shadow-xs">
                👑 TOP RANK #1
              </div>
            )}

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-soft-cloud shrink-0">
                    <img src={entry.userAvatar} alt={entry.userName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-ink uppercase tracking-tight group-hover:underline">
                      {entry.userName}
                    </h3>
                    <p className="text-[10px] text-mute">{entry.department.split('&')[0]}</p>
                  </div>
                </div>

                <div className="font-display text-4xl text-ink">
                  #{idx + 1}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="text-xs font-semibold text-charcoal">
                  Primary Domain: <strong>{entry.topSkill}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-soft-cloud p-3 border border-hairline">
                    <span className="text-[10px] font-bold uppercase text-mute">Karma Points</span>
                    <div className="font-display text-2xl text-ink mt-0.5">{entry.karma}</div>
                  </div>
                  <div className="bg-soft-cloud p-3 border border-hairline">
                    <span className="text-[10px] font-bold uppercase text-mute">Taught</span>
                    <div className="font-display text-2xl text-ink mt-0.5">{entry.sessionsTaught} sess</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between text-xs font-bold text-ink">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                <span>{entry.rating} Rating</span>
              </span>
              <span className="text-mute group-hover:text-ink">View Portfolio →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Full Leaderboard Table */}
      <section className="bg-canvas border border-hairline p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
          CAMPUS PEER RANKINGS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-hairline font-bold uppercase text-mute text-[10px] tracking-wider">
                <th className="py-3 px-2">Rank</th>
                <th className="py-3 px-2">Student Mentor</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2">Top Skill</th>
                <th className="py-3 px-2 text-center">Sessions</th>
                <th className="py-3 px-2 text-center">Rating</th>
                <th className="py-3 px-2 text-right">Karma Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft font-medium">
              {filteredLeaderboard.map((entry, idx) => (
                <tr 
                  key={entry.userId}
                  onClick={() => handleOpenUser(entry.userId)}
                  className="hover:bg-soft-cloud/50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-2 font-display text-xl text-ink">
                    #{idx + 1}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <img src={entry.userAvatar} alt={entry.userName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-semibold text-ink hover:underline">{entry.userName}</span>
                        {idx === 0 && <span className="ml-2 text-xs">👑</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-mute">
                    {entry.department.split('&')[0]}
                  </td>
                  <td className="py-4 px-2 text-ink font-medium">
                    {entry.topSkill}
                  </td>
                  <td className="py-4 px-2 text-center text-charcoal">
                    {entry.sessionsTaught}
                  </td>
                  <td className="py-4 px-2 text-center font-bold text-ink">
                    ★ {entry.rating}
                  </td>
                  <td className="py-4 px-2 text-right font-display text-2xl text-ink">
                    {entry.karma}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* KARMA EARNING RULES & BADGES GUIDE (PRD 3.13) */}
      <section className="bg-soft-cloud border border-hairline p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
          HOW KARMA IS COMPUTED ON CAMPUS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-canvas border border-hairline p-4">
            <span className="text-xl">🎓</span>
            <h4 className="font-display text-xl text-ink uppercase mt-1">+40 Karma</h4>
            <p className="text-xs text-mute mt-0.5">Every 1:1 tutoring session completed with 4.5+ rating</p>
          </div>
          <div className="bg-canvas border border-hairline p-4">
            <span className="text-xl">⚡</span>
            <h4 className="font-display text-xl text-ink uppercase mt-1">+50 Karma</h4>
            <p className="text-xs text-mute mt-0.5">Passing a domain verification challenge quiz with 70%+</p>
          </div>
          <div className="bg-canvas border border-hairline p-4">
            <span className="text-xl">🎯</span>
            <h4 className="font-display text-xl text-ink uppercase mt-1">+25 Karma</h4>
            <p className="text-xs text-mute mt-0.5">Checking off verified learning milestone goals</p>
          </div>
          <div className="bg-canvas border border-hairline p-4">
            <span className="text-xl">👥</span>
            <h4 className="font-display text-xl text-ink uppercase mt-1">+60 Karma</h4>
            <p className="text-xs text-mute mt-0.5">Hosting a successful campus group masterclass workshop</p>
          </div>
        </div>
      </section>

    </div>
  );
};
