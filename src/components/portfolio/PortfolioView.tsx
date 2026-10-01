import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, Zap, Award, CheckCircle2, ShieldCheck, 
  Calendar, Share2, Printer, ArrowRight, MessageSquare, Clock, BookOpen, FileText
} from 'lucide-react';
import { PromoBadge, VerifiedBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const PortfolioView: React.FC = () => {
  const { 
    viewedUserId, 
    allUsers, 
    userSkills, 
    certificates, 
    reviews, 
    currentUser, 
    setCurrentTab,
    createSessionRequest 
  } = useApp();

  const user = allUsers.find(u => u.id === viewedUserId) || currentUser;
  const isOwnProfile = user.id === currentUser.id;

  const userSkillList = userSkills.filter(us => us.userId === user.id);
  const userCertificates = certificates.filter(c => c.userId === user.id);
  const userReviews = reviews.filter(r => r.teacherId === user.id);

  // Selected Certificate for preview modal
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  // Quick Request Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedSkillForBooking, setSelectedSkillForBooking] = useState<any>(userSkillList[0] || null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestGoal, setRequestGoal] = useState('');
  const [requestDate, setRequestDate] = useState('2026-10-05');
  const [requestTime, setRequestTime] = useState('17:00 - 18:00');
  const [offeredTokens, setOfferedTokens] = useState(20);
  const [requestMessage, setRequestMessage] = useState('');

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Public Portfolio link copied to clipboard!');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSendRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillForBooking) return;

    const success = createSessionRequest(
      user.id,
      selectedSkillForBooking.skillId,
      requestTopic || `1:1 Session on ${selectedSkillForBooking.skillName}`,
      requestGoal || 'Peer tutoring & code review',
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
    <div className="space-y-12 pb-16">
      
      {/* 1. PORTFOLIO HERO & IMPACT HEADER (DESIGN-AKTC Section 443 & PRD 3.4) */}
      <section className="bg-canvas border border-hairline p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left: Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-soft-cloud overflow-hidden border border-hairline shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {user.isVerifiedStudent && (
                <div className="absolute bottom-2 right-2 bg-ink text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span>✓</span>
                  <span>CAMPUS VERIFIED</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <PromoBadge label={user.year} />
                <span className="text-xs font-bold text-mute uppercase">{user.department}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl text-ink uppercase tracking-tight leading-none">
                {user.name}
              </h1>

              <p className="text-xs sm:text-sm text-charcoal max-w-xl leading-relaxed">
                {user.bio}
              </p>

              {/* Karma & Rating Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-xs font-bold text-ink">
                  <Star className="w-4 h-4 fill-ink text-ink" />
                  <span>{user.avgRating}</span>
                  <span className="text-mute font-normal">({user.reviewCount} student reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-ink">
                  <Zap className="w-4 h-4 fill-ink" />
                  <span>{user.karma} Karma Points</span>
                  <span className="text-success font-semibold">(Rank #{user.leaderboardRank})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 w-full lg:w-auto">
            {!isOwnProfile && (
              <button
                onClick={() => {
                  setSelectedSkillForBooking(userSkillList[0] || null);
                  setOfferedTokens(userSkillList[0]?.tokenPricePerHour || 20);
                  setIsRequestModalOpen(true);
                }}
                className="btn-primary text-xs py-3 px-8 text-center"
              >
                <span>REQUEST 1:1 SESSION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareProfile}
                className="btn-secondary text-xs py-2.5 px-4 flex-1 flex items-center justify-center gap-1.5"
                title="Share Profile Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="btn-secondary text-xs py-2.5 px-4 flex-1 flex items-center justify-center gap-1.5"
                title="Export PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF EXPORT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Impact Bar Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-hairline-soft">
          <div>
            <div className="text-[10px] uppercase font-bold text-mute">Hours Taught</div>
            <div className="font-display text-3xl sm:text-4xl text-ink mt-0.5">{user.totalHoursTaught} hrs</div>
            <div className="text-[10px] text-mute">Verified Peer Tutoring</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-mute">Hours Learned</div>
            <div className="font-display text-3xl sm:text-4xl text-ink mt-0.5">{user.totalHoursLearned} hrs</div>
            <div className="text-[10px] text-mute">Personal Skill Growth</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-mute">Sessions Completed</div>
            <div className="font-display text-3xl sm:text-4xl text-ink mt-0.5">{user.sessionsCompletedCount}</div>
            <div className="text-[10px] text-success font-semibold">100% Escrow Released</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-mute">Earned Karma Badges</div>
            <div className="font-display text-3xl sm:text-4xl text-ink mt-0.5">{user.badges.length}</div>
            <div className="text-[10px] text-mute">Community Honors</div>
          </div>
        </div>
      </section>

      {/* 2. VERIFIED SKILLS SHOWCASE (PRD 3.2 & 3.4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <h2 className="font-display text-3xl text-ink uppercase tracking-tight">
              VERIFIED SKILLS & MENTORSHIP OFFERINGS
            </h2>
            <p className="text-xs text-mute font-medium">
              Passed university MCQ challenges with 70%+ score threshold
            </p>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setCurrentTab('skills')}
              className="btn-secondary text-xs py-2 px-4"
            >
              + ADD & VERIFY NEW SKILL
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userSkillList.map((skill) => (
            <div 
              key={skill.id}
              className="bg-canvas border border-hairline p-6 flex flex-col justify-between hover:border-ink transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-mute tracking-wider">
                        {skill.category}
                      </span>
                      {skill.isVerified && (
                        <VerifiedBadge score={skill.verificationScore} size="sm" />
                      )}
                      <PromoBadge label={skill.level} />
                    </div>
                    <h3 className="font-display text-2xl text-ink uppercase tracking-tight leading-tight">
                      {skill.skillName}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold uppercase text-mute">Token Rate</div>
                    <div className="text-base font-bold text-ink flex items-center gap-0.5 justify-end">
                      <Zap className="w-3.5 h-3.5 fill-ink" />
                      <span>{skill.tokenPricePerHour} ⚡</span>
                      <span className="text-xs text-mute font-normal">/hr</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-charcoal mt-3 leading-relaxed">
                  {skill.description}
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {skill.tags.map(t => (
                    <span key={t} className="px-2.5 py-0.5 bg-soft-cloud text-ink text-[10px] font-medium rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between text-xs text-mute">
                <div className="flex items-center gap-3">
                  <span>{skill.totalSessionsTaught} sessions taught</span>
                  <span>•</span>
                  <span>{skill.yearsExperience} yrs exp</span>
                </div>
                {!isOwnProfile && (
                  <button
                    onClick={() => {
                      setSelectedSkillForBooking(skill);
                      setOfferedTokens(skill.tokenPricePerHour);
                      setIsRequestModalOpen(true);
                    }}
                    className="btn-primary text-xs py-1.5 px-4"
                  >
                    BOOK THIS SKILL
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CERTIFICATES & CREDENTIALS (PRD 3.3) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div>
            <h2 className="font-display text-3xl text-ink uppercase tracking-tight">
              VERIFIED CERTIFICATES & CREDENTIALS
            </h2>
            <p className="text-xs text-mute font-medium">
              Uploaded credentials verified by Department Faculty
            </p>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setCurrentTab('skills')}
              className="btn-secondary text-xs py-2 px-4"
            >
              UPLOAD CERTIFICATE
            </button>
          )}
        </div>

        {userCertificates.length === 0 ? (
          <div className="bg-soft-cloud border border-hairline p-8 text-center text-xs text-mute">
            No certificates uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCertificates.map(cert => (
              <div 
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="bg-canvas border border-hairline overflow-hidden group cursor-pointer hover:border-ink transition-all"
              >
                <div className="aspect-video w-full bg-soft-cloud relative overflow-hidden">
                  <img
                    src={cert.fileUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cert.status === 'Verified' ? 'bg-success text-on-primary' : 'bg-sale text-on-primary'
                    }`}>
                      {cert.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase text-mute block">
                    {cert.skillName}
                  </span>
                  <h4 className="font-semibold text-xs text-ink mt-0.5 line-clamp-1">
                    {cert.title}
                  </h4>
                  <p className="text-[11px] text-mute mt-1">
                    Issuer: {cert.issuer} • {cert.issueDate}
                  </p>
                  {cert.reviewedBy && (
                    <p className="text-[10px] text-success font-semibold mt-2 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified by {cert.reviewedBy}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. STUDENT TESTIMONIALS & REVIEWS */}
      <section className="space-y-4">
        <div className="border-b border-hairline pb-3">
          <h2 className="font-display text-3xl text-ink uppercase tracking-tight">
            CAMPUS LEARNER REVIEWS & ENDORSEMENTS ({userReviews.length})
          </h2>
          <p className="text-xs text-mute font-medium">
            Post-session verified ratings directly tied to completed escrow transfers
          </p>
        </div>

        {userReviews.length === 0 ? (
          <div className="bg-soft-cloud border border-hairline p-8 text-center text-xs text-mute">
            No session reviews logged yet.
          </div>
        ) : (
          <div className="space-y-3">
            {userReviews.map(rev => (
              <div key={rev.id} className="bg-canvas border border-hairline p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.learnerAvatar}
                      alt={rev.learnerName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-ink">{rev.learnerName}</h4>
                      <p className="text-[10px] text-mute">Topic: {rev.skillName} • {rev.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-ink">
                    <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                    <span>{rev.rating}.0 / 5.0</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal mt-3 leading-relaxed pl-12">
                  "{rev.feedback}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title={selectedCert.title.toUpperCase()}
          subtitle={`Skill: ${selectedCert.skillName} • Issuer: ${selectedCert.issuer}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full bg-soft-cloud border border-hairline overflow-hidden">
              <img
                src={selectedCert.fileUrl}
                alt={selectedCert.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-mute pt-2 border-t border-hairline">
              <span>Status: <strong className="text-ink">{selectedCert.status}</strong></span>
              <span>Issue Date: <strong className="text-ink">{selectedCert.issueDate}</strong></span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCert(null)}
                className="btn-primary text-xs"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* QUICK SESSION REQUEST MODAL */}
      {isRequestModalOpen && (
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title={`REQUEST SESSION WITH ${user.name.toUpperCase()}`}
          subtitle={`Selected Skill: ${selectedSkillForBooking?.skillName || 'General Mentorship'}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendRequestSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Choose Skill Offering
              </label>
              <select
                value={selectedSkillForBooking?.skillId}
                onChange={(e) => {
                  const s = userSkillList.find(us => us.skillId === e.target.value);
                  setSelectedSkillForBooking(s);
                  if (s) setOfferedTokens(s.tokenPricePerHour);
                }}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                {userSkillList.map(s => (
                  <option key={s.skillId} value={s.skillId}>
                    {s.skillName} ({s.tokenPricePerHour} ⚡/hr)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Topic & Specific Goal
              </label>
              <input
                type="text"
                required
                value={requestTopic}
                onChange={(e) => setRequestTopic(e.target.value)}
                placeholder="e.g. Model architecture critique & backprop debugging"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
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
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                >
                  <option value="16:00 - 17:00">16:00 - 17:00 IST</option>
                  <option value="17:00 - 18:00">17:00 - 18:00 IST</option>
                  <option value="18:00 - 19:00">18:00 - 19:00 IST</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-mute tracking-wider mb-1">
                <span>Offered Tokens (Escrow Hold)</span>
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
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                CONFIRM & SEND REQUEST
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
