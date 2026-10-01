import React, { useState } from 'react';
import { Award, Lock, Star, Zap, BookOpen, Users, Shield, TrendingUp, Target, Flame, Trophy, Clock, CheckCircle2 } from 'lucide-react';

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  emoji: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'learning' | 'teaching' | 'social' | 'streak' | 'special';
  earned: boolean;
  earnedAt?: string;
  progress?: number; // 0-100 for in-progress badges
  requirement: string;
}

const TIER_STYLES = {
  bronze:   { bg: 'bg-gradient-to-br from-amber-50 to-amber-100', border: 'border-amber-300', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', glow: 'rgba(217,119,6,0.3)' },
  silver:   { bg: 'bg-gradient-to-br from-slate-50 to-slate-100', border: 'border-slate-300', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-600', glow: 'rgba(148,163,184,0.3)' },
  gold:     { bg: 'bg-gradient-to-br from-yellow-50 to-amber-100', border: 'border-yellow-400', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-700', glow: 'rgba(245,158,11,0.4)' },
  platinum: { bg: 'bg-gradient-to-br from-indigo-50 to-blue-100',  border: 'border-indigo-300', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', glow: 'rgba(99,102,241,0.3)' },
};

const TIER_LABEL = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };

interface BadgeCardProps {
  badge: AchievementBadge;
  animate?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, animate = false }) => {
  const [hovered, setHovered] = useState(false);
  const s = TIER_STYLES[badge.tier];

  return (
    <div
      className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 cursor-default transition-all duration-300 ${badge.earned ? s.bg + ' ' + s.border : 'bg-slate-50 border-slate-200 opacity-50 grayscale'} ${animate ? 'animate-badge-pop' : ''}`}
      style={badge.earned && hovered ? { transform: 'translateY(-4px) scale(1.04)', boxShadow: `0 12px 30px ${s.glow}` } : {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={badge.requirement}
    >
      {/* Shine overlay */}
      {badge.earned && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
        </div>
      )}

      {/* Tier chip */}
      <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${s.badge}`}>
        {TIER_LABEL[badge.tier]}
      </span>

      {/* Icon */}
      <div className={`text-3xl leading-none ${!badge.earned ? 'filter grayscale' : ''}`}>
        {badge.earned ? badge.emoji : '🔒'}
      </div>

      {/* Name */}
      <div className={`text-xs font-bold text-center leading-tight ${badge.earned ? s.text : 'text-slate-400'}`}>
        {badge.name}
      </div>

      {/* Description */}
      <div className="text-[10px] text-slate-400 text-center leading-snug px-1">
        {badge.description}
      </div>

      {/* Progress bar for in-progress */}
      {!badge.earned && badge.progress !== undefined && (
        <div className="w-full mt-1">
          <div className="skill-bar-track">
            <div className="skill-bar-fill" style={{ width: `${badge.progress}%` }} />
          </div>
          <div className="text-[9px] text-slate-400 text-center mt-0.5">{badge.progress}% complete</div>
        </div>
      )}

      {/* Earned date */}
      {badge.earned && badge.earnedAt && (
        <div className="text-[9px] text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
          {badge.earnedAt}
        </div>
      )}
    </div>
  );
};

interface AchievementBadgesGridProps {
  badges: AchievementBadge[];
  title?: string;
  compact?: boolean;
}

export const AchievementBadgesGrid: React.FC<AchievementBadgesGridProps> = ({ badges, title = 'Achievement Badges', compact = false }) => {
  const [filter, setFilter] = useState<'all' | 'earned' | 'in_progress'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', 'learning', 'teaching', 'social', 'streak', 'special'];

  const filtered = badges.filter(b => {
    const matchStatus = filter === 'all' ? true : filter === 'earned' ? b.earned : !b.earned && b.progress !== undefined;
    const matchCat = categoryFilter === 'all' ? true : b.category === categoryFilter;
    return matchStatus && matchCat;
  });

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-display font-bold text-slate-900 text-lg">{title}</h3>
          <span className="badge badge-warning">{earnedCount} / {badges.length} earned</span>
        </div>
      </div>

      {/* Filters */}
      {!compact && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'earned', 'in_progress'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'earned' ? 'Earned' : 'In Progress'}
            </button>
          ))}
          <div className="w-px bg-slate-200" />
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all capitalize ${
                categoryFilter === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`}>
        {filtered.map((badge, i) => (
          <BadgeCard key={badge.id} badge={badge} animate={badge.earned && i < 3} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No badges match this filter</p>
        </div>
      )}
    </div>
  );
};

/* ───────────────────────────────────────────────
   Star Rating Component
─────────────────────────────────────────────── */
interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
  totalReviews?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 'md',
  readonly = false,
  showValue = true,
  totalReviews,
}) => {
  const [hovered, setHovered] = useState(0);

  const sizeClass = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' }[size];
  const textClass = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`star-btn transition-all duration-100 ${readonly ? 'cursor-default' : ''}`}
            style={{ transform: !readonly && hovered >= star ? 'scale(1.3)' : 'scale(1)' }}
          >
            <svg viewBox="0 0 24 24" className={sizeClass} fill={display >= star ? '#f59e0b' : '#e2e8f0'} stroke={display >= star ? '#d97706' : '#cbd5e1'} strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        ))}
      </div>
      {showValue && (
        <span className={`${textClass} font-semibold text-slate-700`}>
          {value.toFixed(1)}
          {totalReviews !== undefined && (
            <span className="font-normal text-slate-400 ml-1">({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
};

/* ───────────────────────────────────────────────
   Skill Verification Badge (inline)
─────────────────────────────────────────────── */
interface VerificationBadgeProps {
  score: number;
  level: string;
  date?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ score, level, date }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
    <Shield className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" />
    <span className="text-xs font-bold text-emerald-700">Verified {level}</span>
    <span className="text-[10px] text-emerald-500 font-medium">{score}%</span>
  </div>
);

/* ───────────────────────────────────────────────
   Recommendation Card
─────────────────────────────────────────────── */
interface RecommendationProps {
  teacherName: string;
  teacherAvatar?: string;
  skillName: string;
  matchScore: number;
  reasons: string[];
  rating: number;
  tokenPrice: number;
  isVerified?: boolean;
  onClick?: () => void;
}

export const RecommendationCard: React.FC<RecommendationProps> = ({
  teacherName,
  teacherAvatar,
  skillName,
  matchScore,
  reasons,
  rating,
  tokenPrice,
  isVerified,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="recommendation-card cursor-pointer group"
  >
    <div className="flex items-center gap-3 mb-3">
      {teacherAvatar ? (
        <img src={teacherAvatar} alt={teacherName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-indigo-200 flex items-center justify-center text-lg">
          {teacherName[0]}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-slate-900 text-sm truncate">{teacherName}</div>
        <div className="text-xs text-indigo-700 font-semibold truncate">{skillName}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="text-xs font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full">{matchScore}% match</div>
        <StarRating value={rating} readonly size="sm" showValue={false} />
      </div>
    </div>

    {/* Match reasons */}
    <div className="flex flex-wrap gap-1.5 mb-3">
      {reasons.slice(0, 3).map((r, i) => (
        <span key={i} className="text-[10px] font-semibold bg-white/70 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
          ✓ {r}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {isVerified && <Shield className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" />}
        <span className={`text-[10px] font-semibold ${isVerified ? 'text-emerald-600' : 'text-slate-400'}`}>
          {isVerified ? 'Skill Verified' : 'Unverified'}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-indigo-700">
        <Zap className="w-3 h-3" fill="currentColor" />
        {tokenPrice}/hr
      </div>
    </div>
  </div>
);

/* ───────────────────────────────────────────────
   Default achievement badges generator
─────────────────────────────────────────────── */
export const generateUserBadges = (
  sessionsLearned: number,
  sessionsTaught: number,
  verifiedSkills: number,
  karma: number,
  daysActive: number
): AchievementBadge[] => [
  {
    id: 'first_session',
    name: 'First Step',
    description: 'Completed your first learning session',
    icon: 'BookOpen',
    emoji: '📚',
    tier: 'bronze',
    category: 'learning',
    earned: sessionsLearned >= 1,
    earnedAt: sessionsLearned >= 1 ? 'Recently' : undefined,
    progress: sessionsLearned >= 1 ? 100 : 0,
    requirement: 'Complete 1 learning session',
  },
  {
    id: 'eager_learner',
    name: 'Eager Learner',
    description: 'Completed 5 learning sessions',
    icon: 'BookOpen',
    emoji: '🎓',
    tier: 'silver',
    category: 'learning',
    earned: sessionsLearned >= 5,
    earnedAt: sessionsLearned >= 5 ? 'Recently' : undefined,
    progress: Math.min(100, (sessionsLearned / 5) * 100),
    requirement: 'Complete 5 learning sessions',
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Completed 20 learning sessions',
    icon: 'TrendingUp',
    emoji: '🧠',
    tier: 'gold',
    category: 'learning',
    earned: sessionsLearned >= 20,
    progress: Math.min(100, (sessionsLearned / 20) * 100),
    requirement: 'Complete 20 learning sessions',
  },
  {
    id: 'first_teacher',
    name: 'First Lesson',
    description: 'Taught your first peer session',
    icon: 'Users',
    emoji: '👩‍🏫',
    tier: 'bronze',
    category: 'teaching',
    earned: sessionsTaught >= 1,
    earnedAt: sessionsTaught >= 1 ? 'Recently' : undefined,
    progress: sessionsTaught >= 1 ? 100 : 0,
    requirement: 'Teach 1 peer session',
  },
  {
    id: 'mentor',
    name: 'Campus Mentor',
    description: 'Taught 10 peer sessions',
    icon: 'Award',
    emoji: '🏆',
    tier: 'gold',
    category: 'teaching',
    earned: sessionsTaught >= 10,
    progress: Math.min(100, (sessionsTaught / 10) * 100),
    requirement: 'Teach 10 peer sessions',
  },
  {
    id: 'verified_pro',
    name: 'Verified Pro',
    description: 'Passed a skill verification challenge',
    icon: 'Shield',
    emoji: '✅',
    tier: 'silver',
    category: 'teaching',
    earned: verifiedSkills >= 1,
    earnedAt: verifiedSkills >= 1 ? 'Recently' : undefined,
    progress: verifiedSkills >= 1 ? 100 : 0,
    requirement: 'Pass 1 skill verification quiz',
  },
  {
    id: 'multi_verified',
    name: 'Skill Master',
    description: 'Verified 3 different skills',
    icon: 'Shield',
    emoji: '🛡️',
    tier: 'platinum',
    category: 'teaching',
    earned: verifiedSkills >= 3,
    progress: Math.min(100, (verifiedSkills / 3) * 100),
    requirement: 'Verify 3 different skills',
  },
  {
    id: 'karma_100',
    name: 'SkillPoints Pioneer',
    description: 'Earned 100 SkillPoints',
    icon: 'Flame',
    emoji: '🔥',
    tier: 'bronze',
    category: 'social',
    earned: karma >= 100,
    progress: Math.min(100, (karma / 100) * 100),
    requirement: 'Earn 100 SkillPoints',
  },
  {
    id: 'karma_500',
    name: 'SkillPoints Champion',
    description: 'Earned 500 SkillPoints',
    icon: 'Trophy',
    emoji: '💎',
    tier: 'gold',
    category: 'social',
    earned: karma >= 500,
    progress: Math.min(100, (karma / 500) * 100),
    requirement: 'Earn 500 SkillPoints',
  },
  {
    id: 'week_streak',
    name: '7-Day Streak',
    description: 'Active for 7 consecutive days',
    icon: 'Flame',
    emoji: '🌟',
    tier: 'silver',
    category: 'streak',
    earned: daysActive >= 7,
    progress: Math.min(100, (daysActive / 7) * 100),
    requirement: 'Stay active for 7 days',
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined in the first semester',
    icon: 'Sparkles',
    emoji: '⚡',
    tier: 'platinum',
    category: 'special',
    earned: true,
    earnedAt: 'Oct 2026',
    progress: 100,
    requirement: 'Join SkillSwap early',
  },
];
