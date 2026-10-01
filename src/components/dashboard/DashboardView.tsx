import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, Video, Clock, Trophy, ArrowRight, Star, 
  CheckCircle2, Sparkles, TrendingUp, Calendar, BookOpen, Layers
} from 'lucide-react';
import { PromoBadge, VerifiedBadge } from '../common/Badge';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentTab, 
    setViewedUserId, 
    allUsers, 
    userSkills, 
    skills, 
    sessionRequests, 
    liveSessions,
    workshops,
    goals,
    studyLogs,
    calculateTeacherRankingScore
  } = useApp();

  // Upcoming live session
  const activeUpcomingSession = liveSessions.find(s => s.status === 'upcoming' || s.status === 'in_progress');

  // Pending requests requiring attention
  const pendingRequests = sessionRequests.filter(r => 
    (currentUser.id === r.teacherId && r.status === 'pending_teacher') ||
    (currentUser.id === r.learnerId && r.status === 'pending_learner_counter')
  );

  // Top verified peer teachers to discover
  const featuredTeachers = allUsers.filter(u => u.id !== currentUser.id && u.role === 'student').slice(0, 3);

  // Weekly study hours calculated from study logs
  const totalWeeklyStudyMinutes = studyLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalWeeklyStudyHours = (totalWeeklyStudyMinutes / 60).toFixed(1);

  const handleOpenTeacher = (userId: string) => {
    setViewedUserId(userId);
    setCurrentTab('portfolio');
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. EDITORIAL CAMPAIGN HERO LOCKUP (DESIGN-AKTC Section 443) */}
      <section className="relative w-full bg-ink text-on-primary overflow-hidden min-h-[440px] flex flex-col justify-between p-6 sm:p-12">
        {/* Background atmospheric visual */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#cacacb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas/10 border border-canvas/20 text-xs font-semibold tracking-wider uppercase mb-4 text-on-primary">
            <span className="w-2 h-2 rounded-full bg-sale animate-pulse"></span>
            CAMPUS TOKEN ECONOMY • ZERO CASH
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-tight uppercase">
            TEACH WHAT YOU KNOW.<br />
            LEARN WHAT YOU NEED.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-hairline max-w-xl font-normal leading-relaxed">
            The university peer learning exchange where knowledge is currency. Earn tokens by tutoring peers in your verified skills, and spend them to master AI, Design, and Distributed Systems.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-8">
          <button
            onClick={() => setCurrentTab('search')}
            className="btn-outline-image"
          >
            <span>DISCOVER TEACHERS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentTab('skills')}
            className="btn-secondary !bg-canvas/10 !text-on-primary border border-canvas/20 hover:!bg-canvas/20"
          >
            <span>TAKE VERIFICATION QUIZ</span>
          </button>

          <button
            onClick={() => setCurrentTab('workshops')}
            className="btn-secondary !bg-canvas/10 !text-on-primary border border-canvas/20 hover:!bg-canvas/20"
          >
            <span>BROWSE CAMPUS WORKSHOPS</span>
          </button>
        </div>
      </section>

      {/* 2. REAL-TIME ROLE-AWARE STATUS TICKER & ESCROW BANNER */}
      {activeUpcomingSession && (
        <section className="bg-soft-cloud border border-hairline p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-ink text-on-primary flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-on-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-sale text-on-primary text-[10px] font-bold rounded-full uppercase tracking-tight">
                  NEXT LIVE SESSION
                </span>
                <span className="text-xs text-mute font-semibold">
                  {new Date(activeUpcomingSession.scheduledStartTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} at 17:00 IST
                </span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-ink mt-0.5">
                {activeUpcomingSession.topic} with {currentUser.id === activeUpcomingSession.teacherId ? activeUpcomingSession.learnerName : activeUpcomingSession.teacherName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-mute font-medium hidden sm:inline">
              🔒 {activeUpcomingSession.tokenAmount} ⚡ in Escrow
            </span>
            <button
              onClick={() => setCurrentTab('live_room')}
              className="btn-primary w-full md:w-auto text-xs py-2.5 px-6"
            >
              <span>ENTER LIVE WEBRTC ROOM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. KEY METRICS MATRIX (PRD 3.14 Personalized Dashboard) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Balance */}
        <div 
          onClick={() => setCurrentTab('wallet')} 
          className="bg-canvas border border-hairline p-5 cursor-pointer hover:border-ink transition-colors group"
        >
          <div className="flex items-center justify-between text-mute text-xs font-semibold uppercase tracking-wider">
            <span>Token Wallet</span>
            <Zap className="w-4 h-4 text-ink fill-ink group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl text-ink leading-none">
              {currentUser.walletBalance}
            </span>
            <span className="font-display text-2xl text-mute">⚡</span>
          </div>
          <div className="mt-2 text-[11px] text-mute font-medium flex items-center justify-between">
            <span>Escrow Locked: {currentUser.escrowBalance} ⚡</span>
            <span className="text-success font-semibold">+40/session</span>
          </div>
        </div>

        {/* Study & Teaching Hours */}
        <div 
          onClick={() => setCurrentTab('study_tracker')} 
          className="bg-canvas border border-hairline p-5 cursor-pointer hover:border-ink transition-colors group"
        >
          <div className="flex items-center justify-between text-mute text-xs font-semibold uppercase tracking-wider">
            <span>Weekly Study Log</span>
            <Clock className="w-4 h-4 text-ink group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl text-ink leading-none">
              {totalWeeklyStudyHours}
            </span>
            <span className="text-xs font-bold text-mute uppercase">Hours</span>
          </div>
          <div className="mt-2 text-[11px] text-mute font-medium flex items-center justify-between">
            <span>Learned: {currentUser.totalHoursLearned}h</span>
            <span>Taught: {currentUser.totalHoursTaught}h</span>
          </div>
        </div>

        {/* Karma & Rank */}
        <div 
          onClick={() => setCurrentTab('leaderboard')} 
          className="bg-canvas border border-hairline p-5 cursor-pointer hover:border-ink transition-colors group"
        >
          <div className="flex items-center justify-between text-mute text-xs font-semibold uppercase tracking-wider">
            <span>Campus Karma</span>
            <Trophy className="w-4 h-4 text-ink group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl text-ink leading-none">
              {currentUser.karma}
            </span>
            <span className="text-xs font-bold text-success uppercase">Rank #{currentUser.leaderboardRank}</span>
          </div>
          <div className="mt-2 text-[11px] text-mute font-medium flex items-center justify-between">
            <span>{currentUser.badges.length} Badges Earned</span>
            <span className="text-ink font-semibold">Top 5%</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div 
          onClick={() => setCurrentTab('requests')} 
          className="bg-canvas border border-hairline p-5 cursor-pointer hover:border-ink transition-colors group"
        >
          <div className="flex items-center justify-between text-mute text-xs font-semibold uppercase tracking-wider">
            <span>Session Requests</span>
            <Layers className="w-4 h-4 text-ink group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl text-ink leading-none">
              {sessionRequests.length}
            </span>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 bg-sale text-on-primary text-[10px] font-bold rounded-full">
                {pendingRequests.length} ACTION
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-mute font-medium flex items-center justify-between">
            <span>Negotiations Active</span>
            <span className="text-ink font-semibold">View Flow →</span>
          </div>
        </div>
      </section>

      {/* 4. TRENDING CAMPUS SKILLS RAIL (DESIGN-AKTC Section 361) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight">
              TRENDING ON CAMPUS THIS SEMESTER
            </h2>
            <p className="text-xs text-mute font-medium">
              High-demand topics based on university search volume & departmental requests
            </p>
          </div>
          <button 
            onClick={() => setCurrentTab('search')}
            className="text-xs font-bold uppercase tracking-tight text-ink hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>Explore All Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => setCurrentTab('search')}
              className="bg-soft-cloud hover:bg-canvas border border-transparent hover:border-hairline p-4 transition-all cursor-pointer group flex flex-col justify-between min-h-[130px]"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-mute">
                  {skill.category.split('&')[0]}
                </div>
                <h4 className="text-xs font-semibold text-ink mt-1 group-hover:text-charcoal line-clamp-2">
                  {skill.name}
                </h4>
              </div>
              <div className="mt-3 pt-2 border-t border-hairline-soft flex items-center justify-between text-[11px] font-medium text-mute">
                <span>{skill.demandCount} requests</span>
                <span className="text-ink font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOP RATED PEER MENTORS (PRODUCT-CARD STYLE FROM DESIGN-AKTC Section 437) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight">
              FEATURED VERIFIED TEACHERS
            </h2>
            <p className="text-xs text-mute font-medium">
              Ranked dynamically by Quiz Score (25%), Peer Rating (25%), Experience (20%), and Karma (15%)
            </p>
          </div>
          <button 
            onClick={() => setCurrentTab('search')}
            className="text-xs font-bold uppercase tracking-tight text-ink hover:underline inline-flex items-center gap-1"
          >
            <span>Search All Mentors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTeachers.map((teacher) => {
            const primarySkill = userSkills.find(us => us.userId === teacher.id) || userSkills[0];
            const rankingScore = calculateTeacherRankingScore(teacher, primarySkill);

            return (
              <div 
                key={teacher.id}
                className="bg-canvas border border-hairline group hover:border-ink transition-all flex flex-col justify-between"
              >
                {/* 1:1 Aspect Ratio Photo staged on soft-cloud */}
                <div className="relative aspect-square w-full bg-soft-cloud overflow-hidden">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                  />
                  
                  {/* Top-left promo badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <PromoBadge label={teacher.year.split(' ')[0] + ' Year'} />
                    {teacher.badges[0] && (
                      <span className="px-2 py-0.5 bg-ink text-on-primary text-[10px] font-bold rounded-full">
                        {teacher.badges[0].icon} {teacher.badges[0].name}
                      </span>
                    )}
                  </div>

                  {/* Algorithmic Match Score Pill */}
                  <div className="absolute top-3 right-3 bg-canvas/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-hairline text-xs font-bold text-ink flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sale" />
                    <span>{rankingScore}% Match</span>
                  </div>
                </div>

                {/* Metadata block with 8px spacing */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Swatch dots row (representing skill domain tags) */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-3 h-3 rounded-full bg-ink"></span>
                      <span className="w-3 h-3 rounded-full bg-mute"></span>
                      <span className="w-3 h-3 rounded-full bg-hairline"></span>
                      <span className="text-[10px] text-mute font-medium ml-1">
                        {teacher.department.split('&')[0]}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-2xl text-ink tracking-tight uppercase leading-tight">
                        {teacher.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-ink">
                        <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                        <span>{teacher.avgRating}</span>
                        <span className="text-mute font-normal">({teacher.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-charcoal mt-1 line-clamp-1">
                      {primarySkill.skillName}
                    </p>

                    <p className="text-xs text-mute mt-2 line-clamp-2 leading-relaxed">
                      {teacher.bio}
                    </p>
                  </div>

                  {/* Price Row and Action Button */}
                  <div className="mt-5 pt-4 border-t border-hairline-soft flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-mute">Token Rate</div>
                      <div className="text-base font-bold text-ink flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-ink" />
                        <span>{primarySkill.tokenPricePerHour} ⚡</span>
                        <span className="text-xs font-normal text-mute">/ hour</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenTeacher(teacher.id)}
                      className="btn-primary text-xs py-2 px-5"
                    >
                      <span>VIEW PORTFOLIO</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. LEARNING GOALS & POMODORO TIMER QUICK TEASER */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Learning Goals */}
        <div className="bg-soft-cloud border border-hairline p-6">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h3 className="font-display text-2xl text-ink uppercase tracking-tight">
              CURRENT LEARNING GOALS
            </h3>
            <button 
              onClick={() => setCurrentTab('goals')}
              className="text-xs font-bold uppercase text-ink hover:underline"
            >
              Manage ({goals.length})
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className="bg-canvas border border-hairline p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-mute tracking-wider block">
                      {goal.skillName}
                    </span>
                    <h4 className="text-xs font-semibold text-ink mt-0.5">{goal.title}</h4>
                  </div>
                  <span className="text-xs font-bold text-ink">{goal.progressPercent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-soft-cloud h-2 rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-ink h-full transition-all duration-300"
                    style={{ width: `${goal.progressPercent}%` }}
                  />
                </div>

                <div className="mt-3 text-[11px] text-mute flex items-center justify-between">
                  <span>{goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones complete</span>
                  <span>Target: {goal.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Pomodoro Widget */}
        <div className="bg-ink text-on-primary p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-hairline">
              <Clock className="w-3.5 h-3.5 text-on-primary" />
              <span>Personal Study Tracker</span>
            </div>

            <h3 className="font-display text-4xl sm:text-5xl text-on-primary mt-2 uppercase tracking-tight">
              FOCUS SPRINT: 25 MIN
            </h3>

            <p className="text-xs text-hairline mt-2 max-w-md">
              Log focused self-study hours tagged to your registered skills. Earn Karma boosts for consistency streaks and sync with peer mentors.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-canvas/20 flex items-center justify-between">
            <div className="text-xs text-hairline">
              <span>Today's Total: <strong>90 mins</strong></span>
            </div>
            <button
              onClick={() => setCurrentTab('study_tracker')}
              className="btn-outline-image text-xs py-2 px-6"
            >
              <span>LAUNCH POMODORO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
