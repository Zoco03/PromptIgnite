import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, SlidersHorizontal, Star, Zap, Sparkles, 
  Calendar, CheckCircle2, ArrowRight, ShieldCheck, Info, X, Users, UserPlus
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
    currentUser,
    setIsAuthModalOpen
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
  const [offeredPoints, setOfferedPoints] = useState(20);
  const [requestMessage, setRequestMessage] = useState('');

  const categories = ['All', 'Software & AI', 'Design & UX', 'Hardware & Systems', 'Business & Career'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Match real registered teachers and their verified skills
  const teacherList = useMemo(() => {
    const results: { teacher: any; primarySkill: any; rankingScore: number }[] = [];

    // Filter out current user from teachers list
    const peerTeachers = allUsers.filter(u => u.id !== currentUser?.id);

    peerTeachers.forEach(teacher => {
      const skillsOfTeacher = userSkills.filter(us => us.userId === teacher.id);
      
      const teacherSkills = skillsOfTeacher.length > 0 ? skillsOfTeacher : [{
        id: `usk_default_${teacher.id}`,
        userId: teacher.id,
        skillId: 'general_peer',
        skillName: 'General Academic Mentorship',
        category: 'Software & AI',
        level: 'Intermediate',
        yearsExperience: 2,
        description: teacher.bio || 'Verified campus peer ready to collaborate.',
        tokenPricePerHour: 15,
        isVerified: true,
        verificationScore: 92,
        tags: ['Peer Mentoring', 'Problem Solving'],
        totalSessionsTaught: 0,
        rating: teacher.avgRating || 5.0
      }];

      teacherSkills.forEach(skill => {
        // Query search
        const matchesQuery = searchQuery === '' || 
          skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;

        // Level filter
        const matchesLevel = selectedLevel === 'All' || skill.level === selectedLevel;

        // Rating filter
        const matchesRating = (teacher.avgRating ?? 0) >= minRating;

        // Price filter
        const matchesPrice = (skill.tokenPricePerHour || 15) <= maxPrice;

        // Verified filter
        const matchesVerified = !verifiedOnly || skill.isVerified;

        if (matchesQuery && matchesCategory && matchesLevel && matchesRating && matchesPrice && matchesVerified) {
          const score = calculateTeacherRankingScore(teacher, skill as any);
          results.push({
            teacher,
            primarySkill: skill,
            rankingScore: score || 85
          });
        }
      });
    });

    // Sorting
    return results.sort((a, b) => {
      if (sortBy === 'ranking') return b.rankingScore - a.rankingScore;
      if (sortBy === 'price_asc') return (a.primarySkill.tokenPricePerHour || 15) - (b.primarySkill.tokenPricePerHour || 15);
      if (sortBy === 'price_desc') return (b.primarySkill.tokenPricePerHour || 15) - (a.primarySkill.tokenPricePerHour || 15);
      if (sortBy === 'rating') return (b.teacher.avgRating || 5.0) - (a.teacher.avgRating || 5.0);
      return 0;
    });
  }, [allUsers, userSkills, currentUser?.id, searchQuery, selectedCategory, selectedLevel, minRating, maxPrice, verifiedOnly, sortBy, calculateTeacherRankingScore]);

  const handleOpenBookingModal = (teacher: any, skill: any) => {
    setSelectedTeacherForBooking({ teacher, skill });
    setOfferedPoints(skill.tokenPricePerHour || 15);
    setRequestTopic(`1:1 Mentorship & Hands-on Session on ${skill.skillName}`);
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
      offeredPoints,
      requestMessage
    );

    if (success) {
      setIsRequestModalOpen(false);
      setCurrentTab('requests');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8 pb-16">
      
      {/* ── SEARCH HEADER BANNER ── */}
      <div className="border-b border-[#111111] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#707072] mb-2">
              <span>CAMPUS DISCOVERY & RANKING</span>
              <span>•</span>
              <span className="text-[#111111] font-bold">{teacherList.length} Verified Peer Mentors</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[#111111] uppercase tracking-tight leading-none">
              DISCOVER VERIFIED PEER TEACHERS
            </h1>
            <p className="text-xs sm:text-sm text-[#4b4b4d] mt-2 max-w-2xl leading-relaxed">
              Find verified student mentors, review past session feedback, and request 1:1 sessions with SkillPoints escrow protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWeightsInspector(!showWeightsInspector)}
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 font-bold uppercase tracking-wider"
              title="Inspect Weighted Ranking Algorithm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#007d48]" />
              <span>RANKING ALGORITHM ({sortBy === 'ranking' ? 'ACTIVE' : 'CUSTOM'})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pt-6 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-chip text-xs font-semibold ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithmic Weights Inspector Dialog */}
      {showWeightsInspector && (
        <div className="bg-[#f5f5f5] border-2 border-[#111111] p-6 rounded-none animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#cacacb]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#111111]" />
              <h4 className="font-display text-xl text-[#111111] uppercase tracking-wider">
                Multi-Factor Ranking Score Weight Breakdown
              </h4>
            </div>
            <button 
              onClick={() => setShowWeightsInspector(false)}
              className="text-xs text-[#707072] hover:text-[#111111] font-bold"
            >
              ✕ CLOSE
            </button>
          </div>

          <p className="text-xs text-[#4b4b4d] mt-2">
            Every peer result is scored dynamically against the search query using verified campus signals:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <div className="bg-white border border-[#cacacb] p-3">
              <div className="text-[10px] uppercase font-bold text-[#707072]">Quiz Verification</div>
              <div className="font-display text-2xl text-[#111111] mt-1">25%</div>
              <div className="text-[10px] text-[#707072]">MCQ Score & Pass Badge</div>
            </div>
            <div className="bg-white border border-[#cacacb] p-3">
              <div className="text-[10px] uppercase font-bold text-[#707072]">Peer Rating</div>
              <div className="font-display text-2xl text-[#111111] mt-1">25%</div>
              <div className="text-[10px] text-[#707072]">5-Star Learner Reviews</div>
            </div>
            <div className="bg-white border border-[#cacacb] p-3">
              <div className="text-[10px] uppercase font-bold text-[#707072]">Sessions Taught</div>
              <div className="font-display text-2xl text-[#111111] mt-1">20%</div>
              <div className="text-[10px] text-[#707072]">Hours of Mentorship</div>
            </div>
            <div className="bg-white border border-[#cacacb] p-3">
              <div className="text-[10px] uppercase font-bold text-[#707072]">SkillPoints (SP)</div>
              <div className="font-display text-2xl text-[#111111] mt-1">15%</div>
              <div className="text-[10px] text-[#707072]">Balance & Activity Tier</div>
            </div>
            <div className="bg-white border border-[#cacacb] p-3">
              <div className="text-[10px] uppercase font-bold text-[#707072]">Certifications</div>
              <div className="font-display text-2xl text-[#111111] mt-1">10%</div>
              <div className="text-[10px] text-[#707072]">Verified Credentials</div>
            </div>
            <div className="bg-white border border-[#cacacb] p-3">
              <div className="text-[10px] uppercase font-bold text-[#707072]">Response Speed</div>
              <div className="font-display text-2xl text-[#111111] mt-1">5%</div>
              <div className="text-[10px] text-[#707072]">Fast Responder Badge</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Filter Sidebar + Right 3-Up Product Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white border border-[#e5e5e5] p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
              <span className="font-bold text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
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
                className="text-[11px] text-[#707072] hover:text-[#111111] font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-2">
                Topic / Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#707072] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. PyTorch, Figma, K8s..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f5f5f5] text-[#111111] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                />
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-2">
                Skill Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {levels.map(l => (
                  <button
                    key={l}
                    onClick={() => setSelectedLevel(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedLevel === l ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#111111] hover:bg-[#e5e5e5]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-2">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-[#f5f5f5] border border-[#e5e5e5] text-xs font-semibold text-[#111111] px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="ranking">Algorithmic Best Match (Score)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#707072] tracking-wider mb-2">
                <span>Max Hourly Rate</span>
                <span className="text-[#111111] font-mono font-bold">{maxPrice} ⚡ SP/hr</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#111111] cursor-pointer"
              />
            </div>

            {/* Verified Only Checkbox */}
            <div className="pt-3 border-t border-[#e5e5e5]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#111111]">
                  Verified by Challenge Only
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Product Card Grid (3-Up on Desktop) */}
        <div className="lg:col-span-3">
          {teacherList.length === 0 ? (
            <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-12 text-center space-y-4">
              <Users className="w-12 h-12 text-[#707072] mx-auto" />
              <h3 className="font-display text-3xl text-[#111111] uppercase">No Peer Mentors Found</h3>
              <p className="text-xs text-[#707072] max-w-md mx-auto leading-relaxed">
                All pre-loaded demo accounts have been purged. Create another student profile in another browser tab to simulate live peer discovery!
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary text-xs uppercase font-bold"
              >
                Create Another Student Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {teacherList.map(({ teacher, primarySkill, rankingScore }) => (
                <div
                  key={`${teacher.id}_${primarySkill.id}`}
                  className="product-card flex flex-col justify-between group"
                >
                  {/* Photo area on soft-cloud 1:1 Aspect Ratio */}
                  <div className="relative aspect-square w-full bg-[#f5f5f5] overflow-hidden">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 bg-white/95 text-[#111111] text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-[#cacacb]">
                      Verified Peer
                    </div>

                    {/* Match Score */}
                    <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full border border-[#cacacb] text-[10px] font-mono font-bold text-[#007d48] flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{rankingScore}% Match</span>
                    </div>
                  </div>

                  {/* Metadata area */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Swatch dots */}
                      <div className="flex items-center gap-1.5 pb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#707072]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#007d48]" />
                        <span className="text-[10px] font-mono text-[#007d48] font-bold ml-auto">
                          {teacher.reviewCount && teacher.reviewCount > 0 ? `★ ${teacher.avgRating.toFixed(1)}` : '★ 0.0 (New)'}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono uppercase text-[#707072]">
                        {teacher.department.split('&')[0]}
                      </div>

                      <h3 
                        onClick={() => {
                          setViewedUserId(teacher.id);
                          setCurrentTab('portfolio');
                        }}
                        className="font-bold text-sm text-[#111111] hover:underline cursor-pointer truncate mt-0.5"
                      >
                        {teacher.name}
                      </h3>

                      <p className="text-xs font-semibold text-[#39393b] truncate mt-0.5">
                        {primarySkill.skillName}
                      </p>

                      <p className="text-xs text-[#4b4b4d] mt-1.5 line-clamp-2 leading-relaxed">
                        {primarySkill.description || teacher.bio}
                      </p>
                    </div>

                    {/* Footer / Price & Request CTA */}
                    <div className="pt-3 border-t border-[#f5f5f5] flex items-center justify-between gap-2">
                      <div className="text-xs font-mono font-bold text-[#111111]">
                        ⚡ {primarySkill.tokenPricePerHour || 15} SP/hr
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setViewedUserId(teacher.id);
                            setCurrentTab('portfolio');
                          }}
                          className="btn-secondary !py-1 !px-2.5 text-xs"
                          title="View Public Portfolio"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleOpenBookingModal(teacher, primarySkill)}
                          className="btn-primary !py-1 !px-3.5 text-xs font-bold"
                        >
                          Request
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

      {/* SESSION BOOKING REQUEST MODAL */}
      {isRequestModalOpen && selectedTeacherForBooking && (
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title={`REQUEST 1:1 SESSION WITH ${selectedTeacherForBooking.teacher.name.toUpperCase()}`}
          subtitle={`Skill: ${selectedTeacherForBooking.skill.skillName} • Rate: ${selectedTeacherForBooking.skill.tokenPricePerHour || 15} SP/hr`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendRequestSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-1">
                Session Topic & Scope
              </label>
              <input
                type="text"
                required
                value={requestTopic}
                onChange={(e) => setRequestTopic(e.target.value)}
                placeholder="e.g. Fine-tuning PyTorch LLM with LoRA"
                className="w-full bg-[#f5f5f5] border border-[#e5e5e5] px-3.5 py-2.5 text-xs text-[#111111] rounded-lg focus:bg-white focus:border-[#111111] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-1">
                Your Learning Goal / What You Hope to Achieve
              </label>
              <textarea
                required
                rows={2}
                value={requestGoal}
                onChange={(e) => setRequestGoal(e.target.value)}
                placeholder="e.g. Understand LoRA hyperparams and debug training loss curve on GPU"
                className="w-full bg-[#f5f5f5] border border-[#e5e5e5] px-3.5 py-2.5 text-xs text-[#111111] rounded-lg focus:bg-white focus:border-[#111111] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full bg-[#f5f5f5] border border-[#e5e5e5] px-3 py-2 text-xs text-[#111111] rounded-lg focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-1">
                  Preferred Slot
                </label>
                <select
                  value={requestTime}
                  onChange={(e) => setRequestTime(e.target.value)}
                  className="w-full bg-[#f5f5f5] border border-[#e5e5e5] px-3 py-2 text-xs text-[#111111] rounded-lg focus:bg-white outline-none cursor-pointer"
                >
                  <option value="16:00 - 17:00">16:00 - 17:00 IST</option>
                  <option value="17:00 - 18:00">17:00 - 18:00 IST</option>
                  <option value="18:00 - 19:00">18:00 - 19:00 IST</option>
                  <option value="19:00 - 20:00">19:00 - 20:00 IST</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#707072] tracking-wider mb-1">
                <span>Offered SkillPoints (Held in Escrow Upon Acceptance)</span>
                <span className="text-[#111111] font-bold font-mono">{offeredPoints} ⚡ SP</span>
              </div>
              <input
                type="number"
                min="5"
                max="100"
                value={offeredPoints}
                onChange={(e) => setOfferedPoints(Number(e.target.value))}
                className="w-full bg-[#f5f5f5] border border-[#e5e5e5] px-3.5 py-2 text-xs text-[#111111] rounded-lg focus:bg-white outline-none font-mono"
              />
              <div className="mt-1 text-[10px] text-[#707072] flex items-center justify-between font-mono">
                <span>Your Current Balance: {currentUser.skillpoints || currentUser.walletBalance} SP</span>
                <span className="text-[#007d48]">Escrow released only after session ends</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#707072] tracking-wider block mb-1">
                Note for Mentor
              </label>
              <textarea
                rows={2}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Share any GitHub repo links or questions beforehand..."
                className="w-full bg-[#f5f5f5] border border-[#e5e5e5] px-3.5 py-2 text-xs text-[#111111] rounded-lg focus:bg-white outline-none"
              />
            </div>

            {/* Escrow Safeguard Warning */}
            <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-3 text-[11px] text-[#4b4b4d] flex items-start gap-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#007d48] shrink-0 mt-0.5" />
              <span>
                <strong>Escrow Guarantee:</strong> {offeredPoints} SkillPoints will be held securely in escrow once accepted. If the peer does not show up, points are automatically refunded to your wallet.
              </span>
            </div>

            <div className="pt-3 border-t border-[#e5e5e5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="btn-secondary !py-2.5 !px-5 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary !py-2.5 !px-6 text-xs font-bold uppercase"
              >
                <span>Send Request & Hold Escrow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
