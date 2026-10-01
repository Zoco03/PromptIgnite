import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, SlidersHorizontal, Star, Zap, Sparkles, 
  Calendar, CheckCircle2, ArrowRight, ShieldCheck, Info, X
} from 'lucide-react';
import { PromoBadge, VerifiedBadge, FilterChip } from '../common/Badge';
import { Modal } from '../common/Modal';

export const TeacherDiscoveryView: React.FC = () => {
  const { 
    allUsers, 
    userSkills, 
    skills, 
    certificates, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    rankingWeights,
    setRankingWeights,
    calculateTeacherRankingScore,
    setViewedUserId,
    setCurrentTab,
    createSessionRequest,
    currentUser
  } = useApp();

  // Local filter states
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'ranking' | 'price_asc' | 'price_desc' | 'rating'>('ranking');
  const [showWeightsInspector, setShowWeightsInspector] = useState<boolean>(false);

  // Booking Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [selectedTeacherForBooking, setSelectedTeacherForBooking] = useState<{ teacher: any; skill: any } | null>(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestGoal, setRequestGoal] = useState('');
  const [requestDate, setRequestDate] = useState('2026-10-05');
  const [requestTime, setRequestTime] = useState('16:00 - 17:00');
  const [offeredTokens, setOfferedTokens] = useState(20);
  const [requestMessage, setRequestMessage] = useState('');

  const categories = ['All', 'Software & AI', 'Design & UX', 'Hardware & Systems', 'Business & Career'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Match teachers and their verified skills
  const teacherList = useMemo(() => {
    const results: { teacher: any; primarySkill: any; rankingScore: number }[] = [];

    allUsers.filter(u => u.role === 'student').forEach(teacher => {
      const skillsOfTeacher = userSkills.filter(us => us.userId === teacher.id);
      
      skillsOfTeacher.forEach(skill => {
        // Query search
        const matchesQuery = searchQuery === '' || 
          skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;

        // Level filter
        const matchesLevel = selectedLevel === 'All' || skill.level === selectedLevel;

        // Rating filter
        const matchesRating = teacher.avgRating >= minRating;

        // Price filter
        const matchesPrice = skill.tokenPricePerHour <= maxPrice;

        // Verified filter
        const matchesVerified = !verifiedOnly || skill.isVerified;

        if (matchesQuery && matchesCategory && matchesLevel && matchesRating && matchesPrice && matchesVerified) {
          const score = calculateTeacherRankingScore(teacher, skill);
          results.push({
            teacher,
            primarySkill: skill,
            rankingScore: score
          });
        }
      });
    });

    // Sorting
    return results.sort((a, b) => {
      if (sortBy === 'ranking') return b.rankingScore - a.rankingScore;
      if (sortBy === 'price_asc') return a.primarySkill.tokenPricePerHour - b.primarySkill.tokenPricePerHour;
      if (sortBy === 'price_desc') return b.primarySkill.tokenPricePerHour - a.primarySkill.tokenPricePerHour;
      if (sortBy === 'rating') return b.teacher.avgRating - a.teacher.avgRating;
      return 0;
    });
  }, [allUsers, userSkills, searchQuery, selectedCategory, selectedLevel, minRating, maxPrice, verifiedOnly, sortBy, calculateTeacherRankingScore]);

  const handleOpenBookingModal = (teacher: any, skill: any) => {
    setSelectedTeacherForBooking({ teacher, skill });
    setOfferedTokens(skill.tokenPricePerHour);
    setRequestTopic(`Mentorship & Hands-on Lab on ${skill.skillName}`);
    setIsRequestModalOpen(true);
  };

  const handleSendRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForBooking) return;

    const success = createSessionRequest(
      selectedTeacherForBooking.teacher.id,
      selectedTeacherForBooking.skill.skillId,
      requestTopic,
      requestGoal,
      requestDate,
      requestTime,
      offeredTokens,
      requestMessage
    );

    if (success) {
      setIsRequestModalOpen(false);
      setCurrentTab('requests');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Header Banner */}
      <div className="border-b border-hairline pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
              <span>CAMPUS DISCOVERY & RANKING</span>
              <span>•</span>
              <span className="text-ink">{teacherList.length} Verified Mentors Found</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
              DISCOVER VERIFIED PEER TEACHERS
            </h1>
            <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
              Search by skill topic, view verification quiz scores, review certificates, and book 1:1 sessions with token escrow protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWeightsInspector(!showWeightsInspector)}
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
              title="Inspect PRD 3.5 Weighted Ranking Algorithm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sale" />
              <span>RANKING ALGORITHM ({sortBy === 'ranking' ? 'ACTIVE' : 'CUSTOM'})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6">
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Algorithmic Weights Inspector Dialog (PRD 3.5 Compliance) */}
      {showWeightsInspector && (
        <div className="bg-soft-cloud border border-hairline p-5 rounded-none animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ink" />
              <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
                PRD Section 3.5: Multi-Factor Ranking Score Breakdown
              </h4>
            </div>
            <button 
              onClick={() => setShowWeightsInspector(false)}
              className="text-xs text-mute hover:text-ink font-bold"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-mute mt-2">
            Every teacher result is scored dynamically against the search query using university-verified signals:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <div className="bg-canvas border border-hairline p-3">
              <div className="text-[10px] uppercase font-bold text-mute">Skill Quiz Verification</div>
              <div className="font-display text-2xl text-ink mt-1">25%</div>
              <div className="text-[10px] text-mute">MCQ Score & Pass Badge</div>
            </div>
            <div className="bg-canvas border border-hairline p-3">
              <div className="text-[10px] uppercase font-bold text-mute">Topic Peer Rating</div>
              <div className="font-display text-2xl text-ink mt-1">25%</div>
              <div className="text-[10px] text-mute">5-Star Learner Reviews</div>
            </div>
            <div className="bg-canvas border border-hairline p-3">
              <div className="text-[10px] uppercase font-bold text-mute">Sessions Taught</div>
              <div className="font-display text-2xl text-ink mt-1">20%</div>
              <div className="text-[10px] text-mute">Hours of Proven Mentorship</div>
            </div>
            <div className="bg-canvas border border-hairline p-3">
              <div className="text-[10px] uppercase font-bold text-mute">Campus Karma Score</div>
              <div className="font-display text-2xl text-ink mt-1">15%</div>
              <div className="text-[10px] text-mute">Milestones & Community Tier</div>
            </div>
            <div className="bg-canvas border border-hairline p-3">
              <div className="text-[10px] uppercase font-bold text-mute">Verified Certificates</div>
              <div className="font-display text-2xl text-ink mt-1">10%</div>
              <div className="text-[10px] text-mute">Faculty Approved Credentials</div>
            </div>
            <div className="bg-canvas border border-hairline p-3">
              <div className="text-[10px] uppercase font-bold text-mute">Response Rate Fit</div>
              <div className="font-display text-2xl text-ink mt-1">5%</div>
              <div className="text-[10px] text-mute">Fast Responder Badge</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Filter Sidebar + Right 3-Up Product Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar (DESIGN-AKTC Section 498) */}
        <aside className="space-y-6">
          <div className="bg-canvas border border-hairline p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <span className="font-semibold text-xs text-ink uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Refine Search
              </span>
              <button 
                onClick={() => {
                  setSelectedLevel('All');
                  setMinRating(0);
                  setMaxPrice(50);
                  setVerifiedOnly(false);
                  setSearchQuery('');
                }}
                className="text-[11px] text-mute hover:text-ink font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-2">
                Topic / Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-mute absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. PyTorch, Figma, K8s..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-pill-input w-full text-xs"
                />
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-2">
                Skill Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {levels.map(l => (
                  <button
                    key={l}
                    onClick={() => setSelectedLevel(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedLevel === l ? 'bg-ink text-on-primary' : 'bg-soft-cloud text-ink hover:bg-hairline-soft'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-2">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline text-xs font-semibold text-ink px-3 py-2 rounded-md focus:outline-none cursor-pointer"
              >
                <option value="ranking">Algorithmic Best Match (Score)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-mute tracking-wider mb-2">
                <span>Max Token Rate</span>
                <span className="text-ink font-semibold">{maxPrice} ⚡ / hr</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-ink cursor-pointer"
              />
            </div>

            {/* Verified Only Checkbox */}
            <div className="pt-3 border-t border-hairline-soft">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-ink rounded cursor-pointer"
                />
                <span className="text-xs font-semibold text-ink">
                  Verified by Challenge Only
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Product Card Grid (3-Up on Desktop) */}
        <div className="lg:col-span-3">
          {teacherList.length === 0 ? (
            <div className="bg-soft-cloud border border-hairline p-12 text-center">
              <h3 className="font-display text-3xl text-ink uppercase">No Mentors Matched Filters</h3>
              <p className="text-xs text-mute mt-2">
                Try widening your price range or clearing keyword filters to discover more campus teachers.
              </p>
              <button
                onClick={() => {
                  setSelectedLevel('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-primary mt-4 text-xs"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {teacherList.map(({ teacher, primarySkill, rankingScore }) => (
                <div
                  key={`${teacher.id}_${primarySkill.id}`}
                  className="bg-canvas border border-hairline flex flex-col justify-between group hover:border-ink transition-all"
                >
                  {/* Photo area on soft-cloud */}
                  <div className="relative aspect-square w-full bg-soft-cloud overflow-hidden">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {primarySkill.isVerified && (
                        <VerifiedBadge score={primarySkill.verificationScore} size="sm" />
                      )}
                      <PromoBadge label={primarySkill.level} />
                    </div>

                    {/* Match Score */}
                    <div className="absolute top-3 right-3 bg-canvas px-2.5 py-1 rounded-full border border-hairline text-xs font-bold text-ink flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-sale" />
                      <span>{rankingScore}% Match</span>
                    </div>
                  </div>

                  {/* Metadata area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Department Tag */}
                      <div className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                        {teacher.department.split('&')[0]}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => {
                            setViewedUserId(teacher.id);
                            setCurrentTab('portfolio');
                          }}
                          className="font-display text-2xl text-ink uppercase tracking-tight hover:underline cursor-pointer leading-tight"
                        >
                          {teacher.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-ink shrink-0">
                          <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                          <span>{primarySkill.rating || teacher.avgRating}</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-charcoal mt-1 line-clamp-1">
                        {primarySkill.skillName}
                      </p>

                      <p className="text-xs text-mute mt-2 line-clamp-2 leading-relaxed">
                        {primarySkill.description || teacher.bio}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {primarySkill.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-soft-cloud text-ink text-[10px] font-medium rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer / Price & Request CTA */}
                    <div className="mt-5 pt-4 border-t border-hairline-soft flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-mute">Price</div>
                        <div className="text-sm font-bold text-ink flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-ink" />
                          <span>{primarySkill.tokenPricePerHour} ⚡</span>
                          <span className="text-[11px] font-normal text-mute">/ hr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setViewedUserId(teacher.id);
                            setCurrentTab('portfolio');
                          }}
                          className="btn-secondary text-xs py-2 px-3"
                          title="View Public Portfolio"
                        >
                          PROFILE
                        </button>
                        <button
                          onClick={() => handleOpenBookingModal(teacher, primarySkill)}
                          className="btn-primary text-xs py-2 px-4"
                        >
                          REQUEST
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SESSION BOOKING REQUEST MODAL (PRD 3.6) */}
      {isRequestModalOpen && selectedTeacherForBooking && (
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title={`REQUEST SESSION WITH ${selectedTeacherForBooking.teacher.name.toUpperCase()}`}
          subtitle={`Skill: ${selectedTeacherForBooking.skill.skillName} • Rate: ${selectedTeacherForBooking.skill.tokenPricePerHour} ⚡/hr`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendRequestSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Session Topic & Scope
              </label>
              <input
                type="text"
                required
                value={requestTopic}
                onChange={(e) => setRequestTopic(e.target.value)}
                placeholder="e.g. Fine-tuning PyTorch LLM with LoRA"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2.5 text-xs text-ink rounded-none focus:outline-none focus:border-ink font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Your Learning Goal / What You Hope to Achieve
              </label>
              <textarea
                required
                rows={2}
                value={requestGoal}
                onChange={(e) => setRequestGoal(e.target.value)}
                placeholder="e.g. Understand LoRA hyperparams and debug training loss curve on GPU"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2.5 text-xs text-ink rounded-none focus:outline-none focus:border-ink font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Preferred Slot
                </label>
                <select
                  value={requestTime}
                  onChange={(e) => setRequestTime(e.target.value)}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none cursor-pointer"
                >
                  <option value="16:00 - 17:00">16:00 - 17:00 IST</option>
                  <option value="17:00 - 18:00">17:00 - 18:00 IST</option>
                  <option value="18:00 - 19:00">18:00 - 19:00 IST</option>
                  <option value="19:00 - 20:00">19:00 - 20:00 IST</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-mute tracking-wider mb-1">
                <span>Offered Tokens (Held in Escrow Upon Acceptance)</span>
                <span className="text-ink font-bold">{offeredTokens} ⚡</span>
              </div>
              <input
                type="number"
                min="5"
                max="100"
                value={offeredTokens}
                onChange={(e) => setOfferedTokens(Number(e.target.value))}
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
              <div className="mt-1 text-[10px] text-mute flex items-center justify-between">
                <span>Your Current Balance: {currentUser.walletBalance} ⚡</span>
                <span className="text-success">Escrow released only after session ends</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Note for Teacher
              </label>
              <textarea
                rows={2}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Share any GitHub repo links or code hurdles beforehand..."
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            {/* Escrow Safeguard Warning */}
            <div className="bg-soft-cloud border border-hairline p-3 text-[11px] text-mute flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span>
                <strong>Escrow Guarantee:</strong> {offeredTokens} tokens will be held securely in escrow once accepted. If the teacher does not show up, tokens are automatically refunded to your wallet.
              </span>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-6"
              >
                <span>SEND REQUEST & ESCROW HOLD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
