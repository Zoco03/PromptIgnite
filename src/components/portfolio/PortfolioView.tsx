import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award, CheckCircle2, ShieldCheck,
  Share2, ArrowRight, MessageSquare, Clock, BookOpen,
  FileText, UserCheck, Sparkles, Star,
  Calendar, ExternalLink, Download, Upload,
  Globe, Edit3, X
} from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../common/SocialIcons';

export const PortfolioView: React.FC = () => {
  const {
    viewedUserId,
    allUsers,
    userSkills,
    certificates,
    reviews,
    currentUser,
    setCurrentTab,
    createSessionRequest,
    updateUserProfile,
    uploadCertificate,
  } = useApp();

  const user = allUsers.find(u => u.id === viewedUserId) || currentUser || allUsers[0];
  const isOwnProfile = user?.id === currentUser?.id;

  const userSkillList = userSkills.filter(us => us.userId === user?.id);
  const userCertificates = certificates.filter(c => c.userId === user?.id);
  const userReviews = reviews.filter(r => r.teacherId === user?.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'badges' | 'certificates' | 'reviews'>('overview');
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadCertOpen, setIsUploadCertOpen] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editGithub, setEditGithub] = useState(user?.socials?.github || '');
  const [editInstagram, setEditInstagram] = useState(user?.socials?.instagram || '');
  const [editLinkedin, setEditLinkedin] = useState(user?.socials?.linkedin || '');
  const [editPortfolio, setEditPortfolio] = useState(user?.socials?.portfolio || '');

  // Certificate Upload State
  const [certSkillName, setCertSkillName] = useState(userSkillList[0]?.skillName || 'AI & Machine Learning (PyTorch & Transformers)');
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certFileUrl, setCertFileUrl] = useState('');
  const [previewCertImg, setPreviewCertImg] = useState<string | null>(null);

  // Booking Form State
  const [selectedSkill, setSelectedSkill] = useState(userSkillList[0] || null);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('2026-10-10');
  const [time, setTime] = useState('17:00');
  const [tokens, setTokens] = useState(20);
  const [bookSuccess, setBookSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-xs text-[#707072] bg-[#f5f5f5]">
        No user profile selected. Please log in or choose a peer.
      </div>
    );
  }

  // Handle PFP file upload
  const handlePfpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Certificate Image Upload
  const handleCertImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCertFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      bio: editBio,
      avatar: editAvatar,
      socials: {
        github: editGithub,
        instagram: editInstagram,
        linkedin: editLinkedin,
        portfolio: editPortfolio
      }
    });
    setIsEditProfileOpen(false);
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;
    uploadCertificate(
      certSkillName,
      certTitle,
      certIssuer,
      certFileUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&auto=format&fit=crop&q=80',
      'image'
    );
    setIsUploadCertOpen(false);
    setCertTitle('');
    setCertIssuer('');
    setCertFileUrl('');
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;
    const ok = createSessionRequest(
      user.id,
      selectedSkill.skillId,
      topic || `1:1 on ${selectedSkill.skillName}`,
      'Peer tutoring',
      date,
      time,
      tokens,
      'Looking forward to exchanging skills!'
    );
    if (ok) {
      setBookSuccess(true);
      setTimeout(() => {
        setIsRequestOpen(false);
        setCurrentTab('requests');
      }, 1000);
    }
  };

  const verifiedSkills = userSkillList.filter(us => us.isVerified).length;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8">

      {/* ── PROFILE HERO (DESIGN-AKTC) ── */}
      <section className="bg-[#111111] text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* User Info & Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-none object-cover border-2 border-white bg-[#262626]"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute bottom-0 right-0 bg-white text-[#111111] p-1.5 shadow-md hover:bg-[#e5e5e5] transition-all"
                  title="Change Profile Photo"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl sm:text-4xl uppercase text-white leading-none">
                  {user.name}
                </h1>
                <span className="badge-tokens text-xs">
                  ⚡ {user.skillpoints || user.tokens || user.walletBalance || 0} SkillPoints
                </span>
              </div>

              <div className="text-xs font-mono text-[#cacacb]">
                {user.department} · {user.year}
              </div>

              <p className="text-xs sm:text-sm text-[#9e9ea0] max-w-xl leading-relaxed">
                {user.bio}
              </p>

              {/* Social Media Links */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                {user.socials?.github && (
                  <a
                    href={user.socials.github.startsWith('http') ? user.socials.github : `https://${user.socials.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#cacacb] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span className="underline">GitHub</span>
                  </a>
                )}
                {user.socials?.instagram && (
                  <a
                    href={user.socials.instagram.startsWith('http') ? user.socials.instagram : `https://${user.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#cacacb] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span className="underline">Instagram</span>
                  </a>
                )}
                {user.socials?.linkedin && (
                  <a
                    href={user.socials.linkedin.startsWith('http') ? user.socials.linkedin : `https://${user.socials.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#cacacb] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span className="underline">LinkedIn</span>
                  </a>
                )}
                {user.socials?.portfolio && (
                  <a
                    href={user.socials.portfolio.startsWith('http') ? user.socials.portfolio : `https://${user.socials.portfolio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#cacacb] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="underline">Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="btn-outline-on-image text-xs uppercase tracking-wider font-bold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile & PFP
                </button>
                <button
                  onClick={() => setIsUploadCertOpen(true)}
                  className="bg-[#39393b] hover:bg-[#4b4b4d] text-white rounded-full px-5 py-2.5 text-xs font-semibold flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Certificate
                </button>
                <button
                  onClick={() => setCurrentTab('resume')}
                  className="bg-transparent hover:bg-white/10 text-white border border-[#cacacb] rounded-full px-5 py-2.5 text-xs font-semibold flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  AI Resume
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsRequestOpen(true)}
                className="btn-outline-on-image text-xs uppercase tracking-wider font-bold"
              >
                Request 1:1 Session ({selectedSkill?.tokenPricePerHour || 15}🪙)
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── METRICS SUMMARY ── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-[#f5f5f5] border border-[#e5e5e5]">
          <div className="text-[10px] font-mono uppercase text-[#707072]">HOURS TAUGHT</div>
          <div className="font-display text-2xl text-[#111111] mt-1">{user.totalHoursTaught || 0} HRS</div>
        </div>
        <div className="p-5 bg-[#f5f5f5] border border-[#e5e5e5]">
          <div className="text-[10px] font-mono uppercase text-[#707072]">HOURS LEARNED</div>
          <div className="font-display text-2xl text-[#111111] mt-1">{user.totalHoursLearned || 0} HRS</div>
        </div>
        <div className="p-5 bg-[#f5f5f5] border border-[#e5e5e5]">
          <div className="text-[10px] font-mono uppercase text-[#707072]">VERIFIED SKILLS</div>
          <div className="font-display text-2xl text-[#111111] mt-1">{verifiedSkills}</div>
        </div>
        <div className="p-5 bg-[#f5f5f5] border border-[#e5e5e5]">
          <div className="text-[10px] font-mono uppercase text-[#707072]">PEER RATING</div>
          <div className="font-display text-2xl text-[#007d48] mt-1">
            ★ {(user.avgRating ?? 0.0).toFixed(1)} {user.reviewCount && user.reviewCount > 0 ? `(${user.reviewCount})` : '(New)'}
          </div>
        </div>
      </section>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex border-b border-[#111111] gap-4 overflow-x-auto">
        {[
          { id: 'overview', label: 'OVERVIEW' },
          { id: 'skills', label: `OFFERED SKILLS (${userSkillList.length})` },
          { id: 'badges', label: `ACHIEVEMENT BADGES (${(user.badges || []).length})` },
          { id: 'certificates', label: `VERIFIED CERTIFICATES (${userCertificates.length})` },
          { id: 'reviews', label: `PEER REVIEWS (${userReviews.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
              activeTab === t.id
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-[#707072] hover:text-[#111111]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT: OVERVIEW & SKILLS ── */}
      {activeTab === 'overview' || activeTab === 'skills' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
              SKILLS & TUTORING SPECIALTIES
            </h2>
            {isOwnProfile && (
              <button
                onClick={() => setCurrentTab('skills')}
                className="btn-primary !py-1.5 !px-4 text-xs"
              >
                + Add / Verify New Skill
              </button>
            )}
          </div>

          {userSkillList.length === 0 ? (
            <div className="p-10 text-center bg-[#f5f5f5] border border-[#e5e5e5] text-xs text-[#707072] space-y-3">
              <p>No specific skills listed yet.</p>
              {isOwnProfile && (
                <button
                  onClick={() => setCurrentTab('skills')}
                  className="btn-primary !py-1.5 !px-4 text-xs"
                >
                  Take Verification Challenge
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSkillList.map(skill => (
                <div key={skill.id} className="p-6 bg-white border border-[#e5e5e5] hover:border-[#111111] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base text-[#111111]">{skill.skillName}</h3>
                      {skill.isVerified ? (
                        <span className="badge-pill bg-[#007d48] text-white text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="badge-pill bg-[#f5f5f5] text-[#707072] text-[11px]">
                          Community Peer
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#707072] mb-3">
                      Level: <span className="font-semibold text-[#111111]">{skill.level}</span> · Rate: <span className="font-semibold text-[#111111]">{skill.tokenPricePerHour} Tokens/hr</span>
                    </div>

                    <p className="text-xs text-[#4b4b4d] leading-relaxed mb-4">{skill.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#f5f5f5] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#007d48]">★ {skill.rating || 5.0}</span>
                    {!isOwnProfile && (
                      <button
                        onClick={() => {
                          setSelectedSkill(skill);
                          setIsRequestOpen(true);
                        }}
                        className="btn-primary !py-1 !px-3 text-xs"
                      >
                        Book ({skill.tokenPricePerHour} Tokens)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* ── TAB CONTENT: CERTIFICATES ── */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
              VERIFIED CREDENTIALS & CERTIFICATE UPLOADS
            </h2>
            {isOwnProfile && (
              <button
                onClick={() => setIsUploadCertOpen(true)}
                className="btn-primary !py-1.5 !px-4 text-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New Certificate
              </button>
            )}
          </div>

          {userCertificates.length === 0 ? (
            <div className="p-12 text-center bg-[#f5f5f5] border border-[#e5e5e5] text-xs text-[#707072] space-y-3">
              <Award className="w-8 h-8 mx-auto text-[#9e9ea0]" />
              <p>No certificates uploaded yet.</p>
              {isOwnProfile && (
                <button
                  onClick={() => setIsUploadCertOpen(true)}
                  className="btn-primary !py-1.5 !px-4 text-xs"
                >
                  Upload Certificate Image
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userCertificates.map(cert => (
                <div key={cert.id} className="border border-[#e5e5e5] bg-white p-4 space-y-3">
                  {/* Certificate Image Preview */}
                  <div
                    onClick={() => setPreviewCertImg(cert.fileUrl)}
                    className="aspect-video bg-[#f5f5f5] border border-[#e5e5e5] overflow-hidden cursor-pointer group relative"
                  >
                    <img
                      src={cert.fileUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                      Click to Expand Preview
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#111111]">{cert.title}</h3>
                    <div className="text-xs text-[#707072]">{cert.issuer} · {cert.issueDate}</div>
                    <div className="text-[11px] font-semibold text-[#007d48] mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Status: {cert.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB CONTENT: ACHIEVEMENT BADGES ── */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
                STUDENT ACHIEVEMENT BADGES & MILESTONES
              </h2>
              <p className="text-xs text-[#707072] mt-0.5">
                Earn verified digital badges through teaching sessions, passing verification quizzes, and maintaining focus streaks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#111111] text-white px-3 py-1 rounded-full">
                {(user.badges || []).length} / 8 Unlocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'b_welcome',
                name: 'Campus Pioneer',
                icon: '🎓',
                tier: 'Bronze',
                category: 'Community',
                description: 'Joined SkillSwap campus peer network',
                earned: true,
                dateEarned: user.joinedDate || '2026-01-01'
              },
              {
                id: 'b_early',
                name: 'Early Adopter',
                icon: '⚡',
                tier: 'Platinum',
                category: 'Community',
                description: 'First Semester Founding Peer Member',
                earned: true,
                dateEarned: '2026-01-01'
              },
              {
                id: 'b_step',
                name: 'First Step',
                icon: '📚',
                tier: 'Bronze',
                category: 'Learning',
                description: 'Complete 1 peer learning session',
                earned: (user.totalHoursLearned || 0) >= 1,
                progress: Math.min(100, ((user.totalHoursLearned || 0) / 1) * 100),
                dateEarned: (user.totalHoursLearned || 0) >= 1 ? 'Recently' : undefined
              },
              {
                id: 'b_teacher',
                name: 'First Lesson',
                icon: '👩‍🏫',
                tier: 'Bronze',
                category: 'Teaching',
                description: 'Teach 1 peer exchange session',
                earned: (user.totalHoursTaught || 0) >= 1,
                progress: Math.min(100, ((user.totalHoursTaught || 0) / 1) * 100),
                dateEarned: (user.totalHoursTaught || 0) >= 1 ? 'Recently' : undefined
              },
              {
                id: 'b_verified',
                name: 'Verified Pro',
                icon: '✅',
                tier: 'Silver',
                category: 'Verification',
                description: 'Pass 1 skill verification quiz (70%+)',
                earned: verifiedSkills >= 1,
                progress: Math.min(100, (verifiedSkills / 1) * 100),
                dateEarned: verifiedSkills >= 1 ? 'Verified' : undefined
              },
              {
                id: 'b_focus',
                name: 'Deep Focus Master',
                icon: '🧠',
                tier: 'Gold',
                category: 'AI Focus',
                description: 'Complete 60min camera-verified study focus sprint',
                earned: (user.sessionsCompletedCount || 0) >= 1,
                progress: Math.min(100, ((user.sessionsCompletedCount || 0) / 1) * 100),
                dateEarned: (user.sessionsCompletedCount || 0) >= 1 ? 'Recently' : undefined
              },
              {
                id: 'b_points',
                name: 'SkillPoints Pioneer',
                icon: '🔥',
                tier: 'Bronze',
                category: 'Social',
                description: 'Earn 100 SkillPoints from peer sessions',
                earned: (user.skillpoints || user.tokens || user.walletBalance || 0) >= 100,
                progress: Math.min(100, (((user.skillpoints || user.tokens || user.walletBalance || 0) / 100) * 100)),
                dateEarned: (user.skillpoints || user.tokens || user.walletBalance || 0) >= 100 ? 'Active' : undefined
              },
              {
                id: 'b_star',
                name: 'Top Rated Peer',
                icon: '⭐',
                tier: 'Platinum',
                category: 'Teaching',
                description: 'Maintain 4.8+ rating with 3+ reviews',
                earned: (user.avgRating || 0) >= 4.8 && (user.reviewCount || 0) >= 3,
                progress: Math.min(100, (((user.reviewCount || 0) / 3) * 100)),
                dateEarned: (user.avgRating || 0) >= 4.8 && (user.reviewCount || 0) >= 3 ? 'Top Rated' : undefined
              }
            ].map(b => (
              <div
                key={b.id}
                className={`p-5 border-2 flex flex-col justify-between transition-all ${
                  b.earned
                    ? 'bg-white border-[#111111] shadow-xs'
                    : 'bg-[#f5f5f5] border-[#e5e5e5] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{b.icon}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      b.tier === 'Platinum' ? 'bg-[#111111] text-white' :
                      b.tier === 'Gold' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      b.tier === 'Silver' ? 'bg-slate-200 text-slate-800' :
                      'bg-amber-50 text-amber-800'
                    }`}>
                      {b.tier}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#111111] mb-1">{b.name}</h3>
                  <p className="text-xs text-[#4b4b4d] leading-relaxed mb-3">{b.description}</p>
                </div>

                <div className="pt-3 border-t border-[#e5e5e5]">
                  {b.earned ? (
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#007d48]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked {b.dateEarned && `(${b.dateEarned})`}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#707072]">
                        <span>In Progress</span>
                        <span>{Math.round(b.progress || 0)}%</span>
                      </div>
                      <div className="w-full bg-[#e5e5e5] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#111111] h-full rounded-full transition-all"
                          style={{ width: `${b.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: REVIEWS ── */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
            STUDENT & PEER REVIEWS
          </h2>

          {userReviews.length === 0 ? (
            <div className="p-8 text-center bg-[#f5f5f5] border border-[#e5e5e5] text-xs text-[#707072]">
              No reviews received yet. Complete 1:1 sessions to receive verified student ratings!
            </div>
          ) : (
            <div className="space-y-3">
              {userReviews.map(r => (
                <div key={r.id} className="p-4 bg-white border border-[#e5e5e5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={r.learnerAvatar} alt={r.learnerName} className="w-7 h-7 rounded-full object-cover border border-[#111111]" />
                      <div>
                        <span className="font-bold text-xs text-[#111111]">{r.learnerName}</span>
                        <span className="text-[10px] text-[#707072] ml-2">{r.createdAt}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#007d48]">★ {r.rating}.0</span>
                  </div>
                  <p className="text-xs text-[#4b4b4d] italic">"{r.feedback}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL: EDIT PROFILE & PFP ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <span className="font-display text-2xl uppercase tracking-wider text-[#111111]">EDIT PROFILE & PFP</span>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-[#707072] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Profile Picture (Upload Custom Image)
                </label>
                <div className="flex items-center gap-3">
                  <img src={editAvatar} alt="PFP Preview" className="w-12 h-12 rounded-none object-cover border border-[#111111]" />
                  <label className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111111] text-xs font-semibold px-4 py-2 rounded-full border border-[#cacacb] flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    Select Image File
                    <input type="file" accept="image/*" onChange={handlePfpUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Bio / Mentorship Focus</label>
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                />
              </div>

              {/* Social Accounts */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">Social Media Accounts</label>
                <input
                  type="text"
                  value={editGithub}
                  onChange={e => setEditGithub(e.target.value)}
                  placeholder="GitHub: github.com/username"
                  className="w-full bg-[#f5f5f5] text-xs p-2 rounded-lg border border-[#e5e5e5] outline-none"
                />
                <input
                  type="text"
                  value={editInstagram}
                  onChange={e => setEditInstagram(e.target.value)}
                  placeholder="Instagram: instagram.com/username"
                  className="w-full bg-[#f5f5f5] text-xs p-2 rounded-lg border border-[#e5e5e5] outline-none"
                />
                <input
                  type="text"
                  value={editLinkedin}
                  onChange={e => setEditLinkedin(e.target.value)}
                  placeholder="LinkedIn: linkedin.com/in/username"
                  className="w-full bg-[#f5f5f5] text-xs p-2 rounded-lg border border-[#e5e5e5] outline-none"
                />
                <input
                  type="text"
                  value={editPortfolio}
                  onChange={e => setEditPortfolio(e.target.value)}
                  placeholder="Portfolio Website: myportfolio.dev"
                  className="w-full bg-[#f5f5f5] text-xs p-2 rounded-lg border border-[#e5e5e5] outline-none"
                />
              </div>

              <div className="pt-3">
                <button type="submit" className="w-full btn-primary justify-center text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD CERTIFICATE ── */}
      {isUploadCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <span className="font-display text-2xl uppercase tracking-wider text-[#111111]">UPLOAD CERTIFICATE</span>
              <button onClick={() => setIsUploadCertOpen(false)} className="text-[#707072] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Related Skill</label>
                <input
                  type="text"
                  value={certSkillName}
                  onChange={e => setCertSkillName(e.target.value)}
                  placeholder="e.g. Modern React, Next.js & TypeScript"
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Certificate Title</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={e => setCertTitle(e.target.value)}
                  placeholder="e.g. Certified Kubernetes Administrator (CKA)"
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={certIssuer}
                  onChange={e => setCertIssuer(e.target.value)}
                  placeholder="e.g. Linux Foundation / Coursera / DeepLearning.AI"
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Upload Certificate File (Image)</label>
                <label className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111111] text-xs font-semibold px-4 py-3 rounded-lg border border-[#cacacb] flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  {certFileUrl ? 'Image Loaded (Click to change)' : 'Select PNG / JPG Image'}
                  <input type="file" accept="image/*" onChange={handleCertImageUpload} className="hidden" />
                </label>
              </div>

              <div className="pt-3">
                <button type="submit" className="w-full btn-primary justify-center text-xs">
                  Upload & Verify Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE IMAGE EXPAND PREVIEW ── */}
      {previewCertImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85" onClick={() => setPreviewCertImg(null)}>
          <div className="relative max-w-3xl w-full bg-white p-2">
            <img src={previewCertImg} alt="Certificate Full Preview" className="w-full h-auto max-h-[80vh] object-contain" />
            <button
              onClick={() => setPreviewCertImg(null)}
              className="absolute top-4 right-4 bg-black text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: 1:1 SESSION REQUEST ── */}
      {isRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <span className="font-display text-2xl uppercase tracking-wider text-[#111111]">REQUEST 1:1 SESSION</span>
              <button onClick={() => setIsRequestOpen(false)} className="text-[#707072] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookSuccess ? (
              <div className="p-4 bg-[#f0fdf4] border border-[#007d48] text-xs text-[#007d48] font-bold text-center">
                Session request submitted! Tokens held in Escrow. Redirecting...
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Topic / Objective</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Deep dive into React Hooks & Custom State"
                    className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">Offer Token Amount (Tokens)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={tokens}
                    onChange={e => setTokens(Number(e.target.value))}
                    className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                    required
                  />
                </div>

                <div className="pt-3">
                  <button type="submit" className="w-full btn-primary justify-center text-xs">
                    Send Request & Lock {tokens} Tokens in Escrow
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
