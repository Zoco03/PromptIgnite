import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, CheckCircle2, AlertCircle, Clock, Zap, 
  HelpCircle, Upload, Plus, ArrowRight, ShieldCheck, RefreshCw, X
} from 'lucide-react';
import { PromoBadge, VerifiedBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const SkillManagerView: React.FC = () => {
  const { 
    currentUser, 
    skills, 
    userSkills, 
    certificates, 
    uploadCertificate, 
    submitQuizAttempt, 
    addNewSkillOffering 
  } = useApp();

  const mySkills = userSkills.filter(us => us.userId === currentUser.id);
  const myCertificates = certificates.filter(c => c.userId === currentUser.id);

  // Verification Quiz Engine Modal State
  const [activeQuizSkill, setActiveQuizSkill] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizTimeRemaining, setQuizTimeRemaining] = useState(180); // 3 minutes
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizResult, setQuizResult] = useState<{ passed: boolean; score: number; total: number } | null>(null);

  // Add Skill Modal State
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [newSkillCatalogId, setNewSkillCatalogId] = useState(skills[0]?.id || '');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newSkillPrice, setNewSkillPrice] = useState(15);
  const [newSkillExp, setNewSkillExp] = useState(2);
  const [newSkillDesc, setNewSkillDesc] = useState('');

  // Upload Certificate Modal State
  const [isUploadCertModalOpen, setIsUploadCertModalOpen] = useState(false);
  const [certSkillName, setCertSkillName] = useState(skills[0]?.name || '');
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certUrl, setCertUrl] = useState('https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80');

  // Quiz Timer
  useEffect(() => {
    let timer: any;
    if (isQuizActive && quizTimeRemaining > 0 && !quizResult) {
      timer = setInterval(() => {
        setQuizTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive, quizTimeRemaining, quizResult]);

  const handleStartQuiz = (skill: any) => {
    setActiveQuizSkill(skill);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizTimeRemaining(180);
    setQuizResult(null);
    setIsQuizActive(true);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizSubmit = () => {
    if (!activeQuizSkill) return;

    const result = submitQuizAttempt(
      activeQuizSkill.id,
      selectedAnswers,
      newSkillLevel,
      newSkillPrice,
      newSkillDesc
    );

    setQuizResult(result);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogSkill = skills.find(s => s.id === newSkillCatalogId);
    if (!catalogSkill) return;

    // Open quiz immediately to verify
    setIsAddSkillModalOpen(false);
    handleStartQuiz(catalogSkill);
  };

  const handleUploadCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadCertificate(certSkillName, certTitle, certIssuer, certUrl);
    setIsUploadCertModalOpen(false);
    setCertTitle('');
    setCertIssuer('');
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>PEER TEACHER ONBOARDING & VERIFICATION (PRD 3.2)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            MY SKILLS & VERIFICATION CHALLENGES
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Pass timed domain quizzes (70% pass mark) to unlock your "Verified Teacher" badge, list your hourly token rate, and appear in search rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadCertModalOpen(true)}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>UPLOAD CERTIFICATE</span>
          </button>
          <button
            onClick={() => setIsAddSkillModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ADD NEW SKILL OFFERING</span>
          </button>
        </div>
      </div>

      {/* 1. MY ACTIVE SKILLS GRID */}
      <section className="space-y-4">
        <h3 className="font-display text-2xl text-ink uppercase tracking-tight">
          MY LISTED SKILLS ({mySkills.length})
        </h3>

        {mySkills.length === 0 ? (
          <div className="bg-soft-cloud border border-hairline p-10 text-center">
            <h4 className="font-display text-2xl text-ink uppercase">No Skills Listed Yet</h4>
            <p className="text-xs text-mute mt-1">
              Add your first skill and complete the quick 5-question challenge to start teaching peers.
            </p>
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="btn-primary text-xs mt-4"
            >
              + ADD YOUR FIRST SKILL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mySkills.map(skill => {
              const catalogMatch = skills.find(s => s.id === skill.skillId);

              return (
                <div 
                  key={skill.id}
                  className="bg-canvas border border-hairline p-6 flex flex-col justify-between hover:border-ink transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase text-mute tracking-wider">
                            {skill.category}
                          </span>
                          {skill.isVerified ? (
                            <VerifiedBadge score={skill.verificationScore} size="sm" />
                          ) : (
                            <span className="px-2 py-0.5 bg-sale/10 text-sale border border-sale/20 text-[10px] font-bold rounded-full uppercase">
                              Verification Pending
                            </span>
                          )}
                          <PromoBadge label={skill.level} />
                        </div>
                        <h4 className="font-display text-2xl text-ink uppercase tracking-tight leading-tight">
                          {skill.skillName}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] uppercase font-bold text-mute">Price</div>
                        <div className="text-base font-bold text-ink flex items-center gap-1 justify-end">
                          <Zap className="w-3.5 h-3.5 fill-ink" />
                          <span>{skill.tokenPricePerHour} ⚡</span>
                          <span className="text-xs text-mute font-normal">/ hr</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal mt-3 leading-relaxed">
                      {skill.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {skill.tags.map(t => (
                        <span key={t} className="px-2.5 py-0.5 bg-soft-cloud text-ink text-[10px] font-medium rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between">
                    <div className="text-xs text-mute">
                      <span>{skill.totalSessionsTaught} sessions taught</span>
                      <span className="mx-2">•</span>
                      <span>Rating: {skill.rating}⭐</span>
                    </div>

                    {!skill.isVerified && catalogMatch && (
                      <button
                        onClick={() => handleStartQuiz(catalogMatch)}
                        className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1"
                      >
                        <span>TAKE CHALLENGE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {skill.isVerified && (
                      <span className="text-xs font-semibold text-success flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Live in Campus Search</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. CAMPUS QUESTION BANKS CATALOG FOR VERIFICATION */}
      <section className="space-y-4">
        <div className="border-b border-hairline pb-3">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight">
            AVAILABLE DOMAIN VERIFICATION CHALLENGES
          </h3>
          <p className="text-xs text-mute font-medium">
            Take a 5-question test authored by university faculty & senior research peers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => {
            const isAlreadyVerified = mySkills.some(ms => ms.skillId === skill.id && ms.isVerified);

            return (
              <div 
                key={skill.id}
                className="bg-soft-cloud border border-hairline p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-mute tracking-wider mb-2">
                    <span>{skill.category}</span>
                    <span>{skill.quizQuestions.length} Questions</span>
                  </div>
                  <h4 className="font-display text-xl text-ink uppercase tracking-tight">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-mute mt-2 line-clamp-2">
                    {skill.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between">
                  <span className="text-[11px] text-mute font-medium">
                    Pass Mark: 70%
                  </span>
                  {isAlreadyVerified ? (
                    <span className="text-xs font-bold text-success flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASSED</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(skill)}
                      className="btn-primary text-xs py-1.5 px-4"
                    >
                      START QUIZ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. VERIFIED CERTIFICATES SUBMITTED */}
      <section className="space-y-4">
        <div className="border-b border-hairline pb-3 flex items-center justify-between">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight">
            SUBMITTED CERTIFICATES ({myCertificates.length})
          </h3>
          <button
            onClick={() => setIsUploadCertModalOpen(true)}
            className="text-xs font-bold uppercase text-ink hover:underline"
          >
            + Upload New
          </button>
        </div>

        {myCertificates.length === 0 ? (
          <div className="bg-soft-cloud border border-hairline p-6 text-center text-xs text-mute">
            No certificates submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCertificates.map(c => (
              <div key={c.id} className="bg-canvas border border-hairline p-4">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-semibold text-xs text-ink">{c.title}</h5>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    c.status === 'Verified' ? 'bg-success text-on-primary' : 'bg-sale text-on-primary'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-[11px] text-mute mt-1">Skill: {c.skillName} • Issuer: {c.issuer}</p>
                <div className="mt-3 aspect-video bg-soft-cloud overflow-hidden border border-hairline">
                  <img src={c.fileUrl} alt={c.title} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INTERACTIVE VERIFICATION CHALLENGE QUIZ MODAL (PRD 3.2) */}
      {isQuizActive && activeQuizSkill && (
        <Modal
          isOpen={isQuizActive}
          onClose={() => {
            if (confirm('Are you sure you want to exit the quiz? Unsaved progress will be lost.')) {
              setIsQuizActive(false);
            }
          }}
          title={`VERIFICATION CHALLENGE: ${activeQuizSkill.name.toUpperCase()}`}
          subtitle={`Pass threshold: 70% • Timed MCQ Challenge • Question ${currentQuestionIndex + 1} of ${activeQuizSkill.quizQuestions.length}`}
          maxWidth="2xl"
        >
          {!quizResult ? (
            <div className="space-y-6">
              {/* Timer Bar */}
              <div className="flex items-center justify-between bg-soft-cloud px-4 py-2.5 border border-hairline">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Clock className="w-4 h-4 text-ink" />
                  <span>Time Remaining:</span>
                  <span className="font-display text-lg tracking-wider">
                    {Math.floor(quizTimeRemaining / 60)}:{(quizTimeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="text-xs text-mute font-medium">
                  {Object.keys(selectedAnswers).length} of {activeQuizSkill.quizQuestions.length} Answered
                </div>
              </div>

              {/* Current Question */}
              {(() => {
                const q = activeQuizSkill.quizQuestions[currentQuestionIndex];
                if (!q) return null;

                return (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm sm:text-base text-ink leading-snug">
                      {currentQuestionIndex + 1}. {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3.5 border cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected 
                                ? 'bg-ink text-on-primary border-ink' 
                                : 'bg-canvas text-ink border-hairline hover:bg-soft-cloud'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected ? 'bg-on-primary text-ink' : 'bg-soft-cloud text-mute'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-xs sm:text-sm font-medium leading-relaxed">
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Quiz Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-hairline">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="btn-secondary text-xs disabled:opacity-40"
                >
                  PREVIOUS
                </button>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex < activeQuizSkill.quizQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="btn-primary text-xs py-2 px-6"
                    >
                      NEXT QUESTION →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      className="btn-primary text-xs py-2 px-8 bg-success hover:bg-success-bright text-on-primary"
                    >
                      SUBMIT QUIZ FOR SCORING
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Results Screen */
            <div className="space-y-6 text-center py-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl font-display ${
                quizResult.passed ? 'bg-success text-on-primary' : 'bg-sale text-on-primary'
              }`}>
                {quizResult.passed ? '✓' : '✕'}
              </div>

              <div>
                <h3 className="font-display text-4xl text-ink uppercase tracking-tight">
                  {quizResult.passed ? 'VERIFICATION CHALLENGE PASSED!' : 'CHALLENGE FAILED (UNDER 70%)'}
                </h3>
                <p className="text-xs text-mute mt-1">
                  You scored {quizResult.score} / {quizResult.total} ({Math.round((quizResult.score / quizResult.total) * 100)}%).
                </p>
              </div>

              {quizResult.passed ? (
                <div className="bg-soft-cloud border border-hairline p-5 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-success uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlocked Benefits:</span>
                  </div>
                  <ul className="text-xs text-charcoal space-y-1 list-disc list-inside">
                    <li>"Verified Teacher" badge awarded on your public portfolio</li>
                    <li>+50 Karma points added to your campus profile</li>
                    <li>Skill listing activated in search rankings with 25% quiz score multiplier</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-soft-cloud border border-hairline p-5 text-left">
                  <p className="text-xs text-mute">
                    Per PRD 3.2 rules, failed attempts have a 24-hour review cooldown. You can review course material, check question explanations, and re-attempt tomorrow.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-hairline flex justify-center">
                <button
                  onClick={() => setIsQuizActive(false)}
                  className="btn-primary text-xs px-8"
                >
                  RETURN TO MY SKILLS
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ADD NEW SKILL OFFERING MODAL */}
      {isAddSkillModalOpen && (
        <Modal
          isOpen={isAddSkillModalOpen}
          onClose={() => setIsAddSkillModalOpen(false)}
          title="ADD NEW SKILL OFFERING"
          subtitle="Select a campus skill and set your pricing parameters"
          maxWidth="lg"
        >
          <form onSubmit={handleAddSkillSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Select Skill from Campus Catalog
              </label>
              <select
                value={newSkillCatalogId}
                onChange={(e) => setNewSkillCatalogId(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                {skills.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e: any) => setNewSkillLevel(e.target.value)}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Years Experience
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newSkillExp}
                  onChange={(e) => setNewSkillExp(Number(e.target.value))}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-mute tracking-wider mb-1">
                <span>Hourly Token Price</span>
                <span className="text-ink font-bold">{newSkillPrice} ⚡</span>
              </div>
              <input
                type="number"
                min="5"
                max="50"
                value={newSkillPrice}
                onChange={(e) => setNewSkillPrice(Number(e.target.value))}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
              <span className="text-[10px] text-mute block mt-1">Campus baseline: 15–20 ⚡ / hour</span>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                What will you teach during 1:1 sessions?
              </label>
              <textarea
                rows={2}
                required
                value={newSkillDesc}
                onChange={(e) => setNewSkillDesc(e.target.value)}
                placeholder="e.g. Deep dive into React custom hooks, state machines, and code reviews."
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddSkillModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                SAVE & TAKE VERIFICATION QUIZ →
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* UPLOAD CERTIFICATE MODAL */}
      {isUploadCertModalOpen && (
        <Modal
          isOpen={isUploadCertModalOpen}
          onClose={() => setIsUploadCertModalOpen(false)}
          title="UPLOAD VERIFIED CERTIFICATE (PRD 3.3)"
          subtitle="Upload credential proofs for Department Faculty audit"
          maxWidth="lg"
        >
          <form onSubmit={handleUploadCertSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Linked Skill
              </label>
              <select
                value={certSkillName}
                onChange={(e) => setCertSkillName(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                {skills.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Certificate Title
              </label>
              <input
                type="text"
                required
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="e.g. DeepLearning.AI Specialization"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Issuing Organization / University
              </label>
              <input
                type="text"
                required
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="e.g. Coursera / Stanford Online / Linux Foundation"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Certificate Image URL / PDF Preview
              </label>
              <input
                type="text"
                value={certUrl}
                onChange={(e) => setCertUrl(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadCertModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                SUBMIT FOR FACULTY REVIEW
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
