import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, Star, Zap, Award, Flame, 
  ArrowUp, ArrowDown, Minus, Filter, Sparkles, Users
} from 'lucide-react';
import { PromoBadge, VerifiedBadge, FilterChip } from '../common/Badge';

export const LeaderboardView: React.FC = () => {
  const { 
    leaderboard, 
    allUsers, 
    setViewedUserId, 
    setCurrentTab,
    setIsAuthModalOpen 
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
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-[#111111] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#707072] mb-2">
            <span>CAMPUS SKILLPOINTS & REPUTATION RANKINGS (PRD 3.13)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-[#111111] uppercase tracking-tight leading-none">
            CAMPUS LEADERBOARDS & RANKINGS
          </h1>
          <p className="text-xs sm:text-sm text-[#4b4b4d] mt-2 max-w-2xl leading-relaxed">
            Ranked by verified peer tutoring sessions, learner ratings, and verification challenge scores. SkillPoints directly boost your discovery ranking.
          </p>
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center bg-[#f5f5f5] p-1 rounded-full border border-[#e5e5e5]">
          <button
            onClick={() => setTimeframe('all_time')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              timeframe === 'all_time' ? 'bg-[#111111] text-white' : 'text-[#707072] hover:text-[#111111]'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              timeframe === 'weekly' ? 'bg-[#111111] text-white' : 'text-[#707072] hover:text-[#111111]'
            }`}
          >
            This Semester
          </button>
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {departments.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDept(d)}
            className={`filter-chip text-xs font-semibold ${selectedDept === d ? 'active' : ''}`}
          >
            {d === 'All' ? 'All Departments' : d.split('&')[0]}
          </button>
        ))}
      </div>

      {/* Podium Top 3 Cards */}
      {filteredLeaderboard.length === 0 ? (
        <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-12 text-center space-y-4">
          <Users className="w-12 h-12 text-[#707072] mx-auto" />
          <h3 className="font-display text-3xl text-[#111111] uppercase">No Campus Peers in this Category</h3>
          <p className="text-xs text-[#707072] max-w-md mx-auto leading-relaxed">
            All fake demo accounts were purged. Register student profiles to climb the real-time leaderboard!
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-primary text-xs uppercase font-bold"
          >
            Register Student Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredLeaderboard.slice(0, 3).map((entry, idx) => (
            <div 
              key={entry.userId}
              onClick={() => handleOpenUser(entry.userId)}
              className={`bg-white border p-6 flex flex-col justify-between cursor-pointer hover:border-[#111111] transition-all group ${
                idx === 0 ? 'border-[#111111] shadow-lg relative' : 'border-[#e5e5e5]'
              }`}
            >
              {idx === 0 && (
                <div className="absolute -top-3 right-6 bg-[#d30005] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  👑 TOP RANK #1
                </div>
              )}

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
                  <div className="flex items-center gap-3">
                    <img src={entry.userAvatar} alt={entry.userName} className="w-12 h-12 rounded-full object-cover border border-[#111111]" />
                    <div>
                      <h3 className="font-display text-2xl text-[#111111] uppercase tracking-tight group-hover:underline">
                        {entry.userName}
                      </h3>
                      <p className="text-[10px] font-mono text-[#707072]">{entry.department.split('&')[0]}</p>
                    </div>
                  </div>

                  <div className="font-display text-4xl text-[#111111]">
                    #{idx + 1}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="text-xs font-semibold text-[#39393b]">
                    Primary Domain: <strong>{entry.topSkill}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-[#f5f5f5] p-3 border border-[#e5e5e5]">
                      <span className="text-[10px] font-bold uppercase text-[#707072]">SkillPoints</span>
                      <div className="font-display text-2xl text-[#111111] mt-0.5">{entry.tokens || 50} ⚡</div>
                    </div>
                    <div className="bg-[#f5f5f5] p-3 border border-[#e5e5e5]">
                      <span className="text-[10px] font-bold uppercase text-[#707072]">Sessions Taught</span>
                      <div className="font-display text-2xl text-[#111111] mt-0.5">{entry.sessionsTaught} sess</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f5f5f5] flex items-center justify-between text-xs font-bold text-[#111111]">
                <span className="flex items-center gap-1 text-[#007d48]">
                  <Star className="w-3.5 h-3.5 fill-[#007d48]" />
                  <span>{entry.rating || 5.0} Rating</span>
                </span>
                <span className="text-[#707072] group-hover:text-[#111111]">View Portfolio →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Full Leaderboard Table */}
      {filteredLeaderboard.length > 0 && (
        <section className="bg-white border-2 border-[#111111] p-6 sm:p-8 space-y-4">
          <h3 className="font-display text-2xl sm:text-3xl text-[#111111] uppercase tracking-tight pb-3 border-b border-[#e5e5e5]">
            CAMPUS PEER RANKINGS
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111111] font-bold uppercase text-[#707072] text-[10px] tracking-wider font-mono">
                  <th className="py-3 px-2">Rank</th>
                  <th className="py-3 px-2">Student Mentor</th>
                  <th className="py-3 px-2">Department</th>
                  <th className="py-3 px-2">Top Skill</th>
                  <th className="py-3 px-2 text-center">Sessions</th>
                  <th className="py-3 px-2 text-center">Rating</th>
                  <th className="py-3 px-2 text-right">SkillPoints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] font-medium">
                {filteredLeaderboard.map((entry, idx) => (
                  <tr 
                    key={entry.userId}
                    onClick={() => handleOpenUser(entry.userId)}
                    className="hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-2 font-display text-xl text-[#111111]">
                      #{idx + 1}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img src={entry.userAvatar} alt={entry.userName} className="w-8 h-8 rounded-full object-cover border border-[#111111]" />
                        <div>
                          <span className="font-semibold text-[#111111] hover:underline">{entry.userName}</span>
                          {idx === 0 && <span className="ml-2 text-xs">👑</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-[#707072]">
                      {entry.department.split('&')[0]}
                    </td>
                    <td className="py-4 px-2 text-[#111111] font-medium">
                      {entry.topSkill}
                    </td>
                    <td className="py-4 px-2 text-center text-[#39393b] font-mono">
                      {entry.sessionsTaught}
                    </td>
                    <td className="py-4 px-2 text-center font-bold text-[#007d48] font-mono">
                      ★ {entry.rating || 5.0}
                    </td>
                    <td className="py-4 px-2 text-right font-display text-2xl text-[#111111]">
                      {entry.tokens || 50} ⚡
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SKILLPOINTS EARNING RULES (PRD 3.13) */}
      <section className="bg-[#f5f5f5] border border-[#e5e5e5] p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-2xl text-[#111111] uppercase tracking-tight pb-3 border-b border-[#cacacb]">
          HOW SKILLPOINTS ARE EARNED & COMPUTED
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white border border-[#e5e5e5] p-4">
            <span className="text-xl">🎓</span>
            <h4 className="font-display text-xl text-[#111111] uppercase mt-1">+40 SkillPoints</h4>
            <p className="text-xs text-[#707072] mt-0.5">Every 1:1 tutoring session completed with 4.5+ rating</p>
          </div>
          <div className="bg-white border border-[#e5e5e5] p-4">
            <span className="text-xl">⚡</span>
            <h4 className="font-display text-xl text-[#111111] uppercase mt-1">+50 SkillPoints</h4>
            <p className="text-xs text-[#707072] mt-0.5">Passing a domain verification challenge quiz with 60%+</p>
          </div>
          <div className="bg-white border border-[#e5e5e5] p-4">
            <span className="text-xl">🎯</span>
            <h4 className="font-display text-xl text-[#111111] uppercase mt-1">+25 SkillPoints</h4>
            <p className="text-xs text-[#707072] mt-0.5">Checking off verified learning milestone goals</p>
          </div>
          <div className="bg-white border border-[#e5e5e5] p-4">
            <span className="text-xl">👥</span>
            <h4 className="font-display text-xl text-[#111111] uppercase mt-1">+15 SkillPoints</h4>
            <p className="text-xs text-[#707072] mt-0.5">Completing a verified AI Computer Vision study sprint</p>
          </div>
        </div>
      </section>

    </div>
  );
};
