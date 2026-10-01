import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video, ArrowRight, Star,
  CheckCircle2, Sparkles, BookOpen,
  UserCheck, Award, ShieldCheck, Target, Camera,
  Clock, Users, FileText, ChevronRight, Layers,
  Code2, Palette, Server, Binary, Briefcase, Zap,
  TrendingUp, Compass, Cpu, MessageSquare
} from 'lucide-react';
import { getAIRecommendations } from '../../services/groqService';

const DISCIPLINES = [
  { id: 'all', name: 'All Disciplines', count: '12 Curricula' },
  { id: 'Software & AI', name: 'Software & AI', count: '4 Curricula' },
  { id: 'Design & UX', name: 'Design & UI/UX', count: '2 Curricula' },
  { id: 'Hardware & Systems', name: 'Cloud & Systems', count: '2 Curricula' },
  { id: 'Algorithms', name: 'Data Structures', count: '2 Curricula' },
  { id: 'Business & Career', name: 'Product & Case', count: '2 Curricula' },
];

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    setCurrentTab,
    setViewedUserId,
    allUsers,
    userSkills,
    skills,
    studyLogs,
    setIsAuthModalOpen,
  } = useApp();

  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [aiRecData, setAiRecData] = useState<{ recommendationText: string; matchedPeerIds: string[]; learningPath: string[] } | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // Filter peers excluding current user
  const peerUsers = allUsers.filter(u => u.id !== currentUser?.id);

  // Fetch Groq AI recommendations
  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    const fetchRecs = async () => {
      setIsLoadingRecs(true);
      const myTeachingSkills = userSkills.filter(us => us.userId === currentUser.id).map(s => s.skillName);
      const peersData = peerUsers.map(p => {
        const pSkills = userSkills.filter(s => s.userId === p.id).map(s => s.skillName);
        return {
          id: p.id,
          name: p.name,
          department: p.department,
          skills: pSkills.length > 0 ? pSkills : ['General Academic Skills'],
          rating: p.avgRating ?? 0.0,
          tokenPrice: 15
        };
      });

      const res = await getAIRecommendations({
        name: currentUser.name,
        department: currentUser.department,
        bio: currentUser.bio,
        skillsTeaching: myTeachingSkills,
        skillsLearning: currentUser.skillsLearning || ['Machine Learning', 'Fullstack Web', 'Cloud DevOps'],
        tokens: currentUser.tokens || currentUser.walletBalance || 0
      }, peersData);

      if (isMounted) {
        setAiRecData(res);
        setIsLoadingRecs(false);
      }
    };

    fetchRecs();
    return () => { isMounted = false; };
  }, [currentUser?.id, allUsers.length]);

  const filteredPeers = selectedDiscipline === 'all'
    ? peerUsers
    : peerUsers.filter(peer => {
        const pSkills = userSkills.filter(s => s.userId === peer.id);
        return pSkills.some(sk => sk.category === selectedDiscipline || sk.skillName.toLowerCase().includes(selectedDiscipline.toLowerCase()));
      });

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-12">

      {/* ── 1. EDITORIAL CAMPAIGN HERO (DESIGN-AKTC campaign-tile) ── */}
      <section className="bg-[#111111] text-white p-6 sm:p-10 md:p-14 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
        {/* Subtle architectural dot grid (right 45%) */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:block" 
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px'
          }} 
        />

        {/* Top Hero Pill Tag */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#007d48] animate-pulse" />
            <span>CAMPUS PEER KNOWLEDGE EXCHANGE</span>
          </div>
        </div>

        {/* Main Headline & Description */}
        <div className="relative z-10 max-w-3xl my-6 space-y-5">
          <h1 className="display-campaign text-white text-4xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[0.92] tracking-tight">
            SWAP SKILLS.<br />
            EARN SKILLPOINTS.<br />
            <span className="text-[#9e9ea0]">OWN YOUR MASTERY.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#cacacb] max-w-2xl leading-relaxed">
            Direct 1:1 verified student tutoring, uncompressed peer video calling, webcam AI vision focus verification, and instant SkillPoints settlement. Zero intermediaries.
          </p>

          {/* Action CTAs: Pill Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setCurrentTab('search')}
              className="btn-outline-on-image text-xs font-bold uppercase tracking-wider !py-3 !px-6"
            >
              <span>Discover Peer Mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentTab('study_tracker')}
              className="btn-secondary text-xs font-bold uppercase tracking-wider !bg-[#262626] !text-white !border-[#39393b] hover:!bg-[#39393b] !py-3 !px-5"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>AI Focus Camera</span>
            </button>

            <button
              onClick={() => setCurrentTab('resume')}
              className="btn-secondary text-xs font-bold uppercase tracking-wider !bg-transparent !text-white !border-[#cacacb] hover:!bg-white/10 !py-3 !px-5"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>AI Resume Builder</span>
            </button>
          </div>
        </div>

        {/* Hero Footer: Authenticated User & SkillPoints Status */}
        <div className="relative z-10 pt-6 border-t border-[#39393b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#9e9ea0]">
          <div>
            STUDENT STATUS: <span className="text-white font-bold">{currentUser?.name || 'GUEST STUDENT'}</span>
            {currentUser?.department && (
              <span className="text-[#cacacb]"> · {currentUser.department.split('&')[0]}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>WALLET BALANCE: <strong className="text-white font-mono">⚡ {currentUser?.skillpoints || currentUser?.tokens || currentUser?.walletBalance || 0} SP</strong></span>
            <span>ESCROW LOCKED: <strong className="text-emerald-400 font-mono">{currentUser?.escrowBalance || 0} SP</strong></span>
          </div>
        </div>
      </section>

      {/* ── 2. DISCIPLINE FILTER CHIPS RAIL (DESIGN-AKTC) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#111111] pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111]">
            SHOP BY DISCIPLINE & DOMAIN
          </h2>
          <span className="text-xs font-mono text-[#707072] uppercase">
            {skills.length} VERIFIED ACADEMIC CURRICULA
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {DISCIPLINES.map(disc => {
            const active = selectedDiscipline === disc.id;
            return (
              <button
                key={disc.id}
                onClick={() => setSelectedDiscipline(disc.id)}
                className={`filter-chip flex items-center gap-2 text-xs font-medium ${active ? 'active' : ''}`}
              >
                <span>{disc.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-[#f5f5f5] text-[#707072]'}`}>
                  {disc.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. GROQ AI RECOMMENDATION ENGINE (DESIGN-AKTC) ── */}
      <section className="bg-white border-2 border-[#111111] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e5e5e5] pb-4 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-[#111111] leading-none">
                AI RECOMMENDATION ENGINE
              </h2>
              <span className="text-[10px] font-mono text-[#707072] uppercase tracking-widest block mt-1">
                GROQ CLOUD LLAMA 3.3 70B VERSATILE · CAMPUS SKILL-GAP MATCHER
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('search')}
            className="btn-secondary !py-2 !px-5 text-xs uppercase tracking-wider font-bold"
          >
            Explore Peer Directory
          </button>
        </div>

        {isLoadingRecs ? (
          <div className="py-10 text-center text-xs text-[#707072] font-mono animate-pulse space-y-2">
            <Sparkles className="w-6 h-6 text-amber-500 mx-auto animate-spin" />
            <div>Computing skill affinities and peer pairings via Groq AI...</div>
          </div>
        ) : aiRecData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Match Analysis & Matched Peers */}
            <div className="lg:col-span-8 space-y-5">
              <div className="p-4 bg-[#f5f5f5] border-l-4 border-[#111111] text-xs sm:text-sm text-[#39393b] leading-relaxed">
                <span className="font-bold text-[#111111] block mb-1">Affinity Intelligence Report:</span>
                {aiRecData.recommendationText}
              </div>

              {peerUsers.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#707072] flex items-center justify-between">
                    <span>Recommended Peer Pairings</span>
                    <span className="font-mono text-[10px]">1:1 Academic Match</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {peerUsers.slice(0, 2).map(peer => {
                      const pSkills = userSkills.filter(s => s.userId === peer.id);
                      const topSkill = pSkills[0];
                      return (
                        <div key={peer.id} className="product-card p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2.5">
                              <img
                                src={peer.avatar}
                                alt={peer.name}
                                className="w-12 h-12 rounded-none object-cover border border-[#111111] bg-[#f5f5f5]"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-sm text-[#111111] truncate">{peer.name}</div>
                                <div className="text-[11px] font-mono text-[#707072] truncate">{peer.department.split('&')[0]}</div>
                                <div className="text-[10px] text-[#007d48] font-bold mt-0.5">
                                  ★ {(peer.avgRating ?? 0.0).toFixed(1)} {peer.reviewCount ? `(${peer.reviewCount})` : '(New)'}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-[#4b4b4d] line-clamp-2 mb-3 leading-relaxed">{peer.bio}</p>
                          </div>

                          <div className="pt-3 border-t border-[#f5f5f5] flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#111111]">
                              ⚡ {topSkill?.tokenPricePerHour || 15} SP/hr
                            </span>
                            <button
                              onClick={() => {
                                setViewedUserId(peer.id);
                                setCurrentTab('portfolio');
                              }}
                              className="btn-primary !py-1.5 !px-4 text-xs font-bold"
                            >
                              Connect
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 border border-dashed border-[#cacacb] text-center text-xs text-[#707072] space-y-2">
                  <p className="font-medium text-[#111111]">No other peer accounts registered yet.</p>
                  <p>Click <strong>"Sign In / Join"</strong> in the top bar to create multiple student profiles and test instant 1:1 peer tutoring!</p>
                </div>
              )}
            </div>

            {/* Right 4 Cols: 4-Step Learning Roadmap */}
            <div className="lg:col-span-4 bg-[#f5f5f5] p-5 border border-[#e5e5e5] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#cacacb] pb-2">
                <Target className="w-4 h-4 text-[#111111]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Personalized Roadmap
                </h3>
              </div>

              <ul className="space-y-3">
                {aiRecData.learningPath.map((step, idx) => (
                  <li key={idx} className="text-xs text-[#39393b] flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : null}
      </section>

      {/* ── 4. FEATURED PEER TEACHERS (DESIGN-AKTC product-card Grid) ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#111111] pb-3">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#111111] leading-none">
              CAMPUS PEER INSTRUCTORS
            </h2>
            <span className="text-[10px] font-mono text-[#707072] uppercase tracking-widest">
              VERIFIED 1:1 PEER TUTORING SESSIONS
            </span>
          </div>

          <button
            onClick={() => setCurrentTab('search')}
            className="text-xs font-bold uppercase tracking-wider text-[#111111] underline hover:no-underline"
          >
            View All ({filteredPeers.length}) →
          </button>
        </div>

        {filteredPeers.length === 0 ? (
          <div className="p-10 text-center bg-[#f5f5f5] border border-[#e5e5e5] space-y-4">
            <Users className="w-10 h-10 text-[#707072] mx-auto" />
            <h3 className="font-display text-2xl uppercase text-[#111111]">NO PEER TEACHERS IN THIS DOMAIN YET</h3>
            <p className="text-xs text-[#707072] max-w-md mx-auto leading-relaxed">
              All demo pre-loaded accounts have been removed. Register another student account on your browser to simulate live exchange!
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-primary text-xs font-bold uppercase tracking-wider"
            >
              Create Another Student Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPeers.map(peer => {
              const pSkills = userSkills.filter(s => s.userId === peer.id);
              const topSkill = pSkills[0];

              return (
                <div key={peer.id} className="product-card flex flex-col justify-between">
                  
                  {/* 1:1 Aspect Ratio Photo Stage (DESIGN-AKTC) */}
                  <div className="relative aspect-square w-full bg-[#f5f5f5] overflow-hidden">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Top-left promo badge */}
                    <div className="absolute top-3 left-3 bg-white/95 text-[#111111] text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-[#cacacb]">
                      Verified Peer
                    </div>
                  </div>

                  {/* Metadata Row below photo stage */}
                  <div className="p-4 space-y-2.5">
                    {/* Swatch dots row (DESIGN-AKTC) */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#707072]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#007d48]" />
                      <span className="text-[10px] font-mono text-[#007d48] font-bold ml-auto">
                        ★ {peer.avgRating || 5.0}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#111111] truncate">{peer.name}</div>
                    <div className="text-xs font-mono text-[#707072] truncate">{peer.department.split('&')[0]}</div>
                    <div className="text-xs text-[#39393b] font-medium truncate">
                      {topSkill?.skillName || 'General Academic Mentorship'}
                    </div>

                    {/* Price Row per DESIGN-AKTC */}
                    <div className="pt-2.5 border-t border-[#f5f5f5] flex items-center justify-between">
                      <span className="font-bold text-xs font-mono text-[#111111]">
                        🪙 {topSkill?.tokenPricePerHour || 15} Tokens/hr
                      </span>
                      <button
                        onClick={() => {
                          setViewedUserId(peer.id);
                          setCurrentTab('portfolio');
                        }}
                        className="btn-primary !py-1 !px-3 text-xs"
                      >
                        Connect
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 5. THREE MEMBER BENEFIT TILES (DESIGN-AKTC member-benefit-card) ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Benefit Card 1: AI Focus Camera */}
        <div
          onClick={() => setCurrentTab('study_tracker')}
          className="p-8 bg-[#111111] text-white cursor-pointer hover:bg-[#222222] transition-all flex flex-col justify-between min-h-[240px] border border-[#111111]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Camera className="w-7 h-7 text-emerald-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9e9ea0] border border-[#39393b] px-2 py-0.5 rounded-full">
                VISION AI
              </span>
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wider text-white">
              AI CAMERA FOCUS MONITOR
            </h3>
            <p className="text-xs text-[#9e9ea0] leading-relaxed">
              Verify your attentiveness during Pomodoro study sprints. Real-time vision tracking and token rewards for completed deep work.
            </p>
          </div>

          <div className="pt-6 font-mono text-xs text-white uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span>Launch Vision Monitor</span>
            <span>→</span>
          </div>
        </div>

        {/* Benefit Card 2: Live Video Room */}
        <div
          onClick={() => setCurrentTab('live_room')}
          className="p-8 bg-[#f5f5f5] text-[#111111] border border-[#e5e5e5] cursor-pointer hover:border-[#111111] transition-all flex flex-col justify-between min-h-[240px]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Video className="w-7 h-7 text-[#d30005]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#707072] border border-[#cacacb] px-2 py-0.5 rounded-full">
                WEBRTC LIVE
              </span>
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
              LIVE 1:1 VIDEO & BOARD
            </h3>
            <p className="text-xs text-[#707072] leading-relaxed">
              1:1 peer video calling with screen sharing, interactive whiteboard notes, camera mirror flip, and escrow token safety.
            </p>
          </div>

          <div className="pt-6 font-mono text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span>Enter Live Room</span>
            <span>→</span>
          </div>
        </div>

        {/* Benefit Card 3: AI Resume Compiler */}
        <div
          onClick={() => setCurrentTab('resume')}
          className="p-8 bg-[#f5f5f5] text-[#111111] border border-[#e5e5e5] cursor-pointer hover:border-[#111111] transition-all flex flex-col justify-between min-h-[240px]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FileText className="w-7 h-7 text-[#1151ff]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#707072] border border-[#cacacb] px-2 py-0.5 rounded-full">
                GROQ AI
              </span>
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
              AI RESUME COMPILER
            </h3>
            <p className="text-xs text-[#707072] leading-relaxed">
              Compile an industry-standard technical resume directly from your verified skills, teaching hours, and GitHub credentials.
            </p>
          </div>

          <div className="pt-6 font-mono text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <span>Compile & Download</span>
            <span>→</span>
          </div>
        </div>

      </section>

    </div>
  );
};
