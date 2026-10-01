import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Check, X, AlertTriangle, Users, 
  FileText, HelpCircle, Zap, Eye, CheckCircle2 
} from 'lucide-react';
import { PromoBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminConsoleView: React.FC = () => {
  const { 
    currentUser, 
    certificates, 
    adminReviewCertificate, 
    disputes, 
    resolveDispute, 
    allUsers, 
    grantStarterTokens, 
    skills 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'certificates' | 'disputes' | 'users' | 'questions'>('certificates');

  // Certificate modal
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<any | null>(null);

  // Dispute resolution state
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'Resolved_Refund_Learner' | 'Resolved_Release_Teacher'>('Resolved_Refund_Learner');
  const [resolutionNote, setResolutionNote] = useState('');

  // Token adjustment modal
  const [tokenUserId, setTokenUserId] = useState(allUsers[0]?.id || '');
  const [tokenAdjustAmount, setTokenAdjustAmount] = useState(50);
  const [tokenAdjustReason, setTokenAdjustReason] = useState('Faculty Research Assistant Honorarium');

  const pendingCertificates = certificates.filter(c => c.status === 'Pending');
  const openDisputes = disputes.filter(d => d.status === 'Open' || d.status === 'Under_Review');

  const handleResolveDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    resolveDispute(selectedDispute.id, resolutionAction, resolutionNote);
    setSelectedDispute(null);
    setResolutionNote('');
  };

  const handleGrantTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    grantStarterTokens(tokenUserId, tokenAdjustAmount, tokenAdjustReason);
    alert(`Granted ${tokenAdjustAmount} ⚡ to user.`);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>FACULTY & PLATFORM GOVERNANCE (PRD 3.18)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            CAMPUS ADMIN & MODERATION CONSOLE
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Audit student certificate proofs, resolve escrow dispute tribunal cases, manage verification question banks, and monitor token integrity.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-soft-cloud p-1 rounded-full border border-hairline overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              activeTab === 'certificates' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            Certificates ({pendingCertificates.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              activeTab === 'disputes' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            Disputes ({openDisputes.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              activeTab === 'users' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            Tokens & Users
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full transition-colors ${
              activeTab === 'questions' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            Question Banks
          </button>
        </div>
      </div>

      {/* 1. CERTIFICATE REVIEW QUEUE */}
      {activeTab === 'certificates' && (
        <section className="bg-canvas border border-hairline p-6 space-y-4">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
            PENDING CERTIFICATE VERIFICATION QUEUE ({pendingCertificates.length})
          </h3>

          {pendingCertificates.length === 0 ? (
            <div className="p-8 bg-soft-cloud text-center text-xs text-mute">
              No pending certificates requiring review.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCertificates.map(cert => (
                <div key={cert.id} className="p-4 bg-soft-cloud border border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={cert.fileUrl} alt={cert.title} className="w-16 h-12 object-cover border border-hairline" />
                    <div>
                      <h4 className="font-semibold text-xs text-ink">{cert.title}</h4>
                      <p className="text-[11px] text-mute">Skill: {cert.skillName} • Issuer: {cert.issuer} • Date: {cert.issueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCertForPreview(cert)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>PREVIEW</span>
                    </button>
                    <button
                      onClick={() => adminReviewCertificate(cert.id, 'Rejected', 'Insufficient verification issuer link')}
                      className="btn-secondary !text-sale text-xs py-1.5 px-3"
                    >
                      REJECT
                    </button>
                    <button
                      onClick={() => adminReviewCertificate(cert.id, 'Verified')}
                      className="btn-primary !bg-success !text-on-primary text-xs py-1.5 px-4"
                    >
                      APPROVE & VERIFY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 2. DISPUTE RESOLUTION TRIBUNAL */}
      {activeTab === 'disputes' && (
        <section className="bg-canvas border border-hairline p-6 space-y-4">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
            CAMPUS ESCROW DISPUTE CASES ({disputes.length})
          </h3>

          <div className="space-y-4">
            {disputes.map(disp => (
              <div key={disp.id} className="p-5 bg-soft-cloud border border-hairline space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-sale text-on-primary text-[10px] font-bold rounded-full uppercase">
                      Case #{disp.id} • {disp.status}
                    </span>
                    <span className="text-xs font-semibold text-ink">Topic: {disp.skillName}</span>
                  </div>
                  <span className="text-xs font-bold text-ink">🔒 {disp.tokenAmount} ⚡ in Escrow Freeze</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-mute font-bold uppercase text-[10px] block">Claimant (Learner)</span>
                    <span className="font-semibold text-ink">{disp.openedByUserName}</span>
                  </div>
                  <div>
                    <span className="text-mute font-bold uppercase text-[10px] block">Respondent (Teacher)</span>
                    <span className="font-semibold text-ink">{disp.againstUserName}</span>
                  </div>
                </div>

                <div className="bg-canvas p-3 border border-hairline text-xs">
                  <strong className="text-ink">Reason: </strong>{disp.reason}
                  <p className="text-charcoal mt-1 italic">"{disp.evidenceText}"</p>
                </div>

                {disp.status === 'Open' || disp.status === 'Under_Review' ? (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedDispute(disp)}
                      className="btn-primary text-xs py-1.5 px-4"
                    >
                      AUDIT & RESOLVE CASE
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-success font-semibold pt-1">
                    ✓ Resolved: {disp.status} • Note: {disp.resolutionNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. USER MANAGEMENT & TOKEN ADJUSTMENTS */}
      {activeTab === 'users' && (
        <section className="bg-canvas border border-hairline p-6 space-y-6">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
            TOKEN ADJUSTMENTS & CAMPUS ROSTER
          </h3>

          <form onSubmit={handleGrantTokenSubmit} className="bg-soft-cloud border border-hairline p-4 space-y-3">
            <h4 className="font-semibold text-xs text-ink uppercase">Manual Token Adjustment / Research Grant</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-mute block mb-1">Student</label>
                <select
                  value={tokenUserId}
                  onChange={(e) => setTokenUserId(e.target.value)}
                  className="w-full bg-canvas border border-hairline p-2 text-xs text-ink"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.department.split('&')[0]})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-mute block mb-1">Amount (⚡)</label>
                <input
                  type="number"
                  value={tokenAdjustAmount}
                  onChange={(e) => setTokenAdjustAmount(Number(e.target.value))}
                  className="w-full bg-canvas border border-hairline p-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-mute block mb-1">Reason / Grant Title</label>
                <input
                  type="text"
                  value={tokenAdjustReason}
                  onChange={(e) => setTokenAdjustReason(e.target.value)}
                  className="w-full bg-canvas border border-hairline p-2 text-xs text-ink"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="btn-primary text-xs py-2 px-5">
                EXECUTE TOKEN GRANT
              </button>
            </div>
          </form>

          {/* User list */}
          <div className="divide-y divide-hairline-soft">
            {allUsers.map(u => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-4 text-xs font-medium">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h5 className="font-semibold text-ink">{u.name}</h5>
                    <p className="text-[10px] text-mute">{u.email} • {u.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-mute block">Wallet Balance</span>
                    <strong className="text-ink">{u.walletBalance} ⚡</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-mute block">Karma</span>
                    <strong className="text-ink">{u.karma} pts</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. QUESTION BANK MANAGEMENT */}
      {activeTab === 'questions' && (
        <section className="bg-canvas border border-hairline p-6 space-y-4">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
            DOMAIN QUESTION BANKS ({skills.reduce((acc, s) => acc + s.quizQuestions.length, 0)} Total MCQs)
          </h3>

          <div className="space-y-6">
            {skills.map(s => (
              <div key={s.id} className="bg-soft-cloud border border-hairline p-5">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <h4 className="font-display text-xl text-ink uppercase">{s.name}</h4>
                  <span className="text-xs font-bold text-mute">{s.quizQuestions.length} Questions</span>
                </div>

                <div className="space-y-3 mt-3">
                  {s.quizQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-canvas p-3 border border-hairline text-xs">
                      <p className="font-semibold text-ink">{idx + 1}. {q.question}</p>
                      <div className="mt-2 text-[11px] text-success font-semibold">
                        ✓ Correct Answer: {q.options[q.correctIndex]}
                      </div>
                      <p className="text-[10px] text-mute mt-0.5">Explanation: {q.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DISPUTE AUDIT MODAL */}
      {selectedDispute && (
        <Modal
          isOpen={!!selectedDispute}
          onClose={() => setSelectedDispute(null)}
          title={`DISPUTE TRIBUNAL: CASE #${selectedDispute.id}`}
          subtitle={`Escrow Sum: ${selectedDispute.tokenAmount} ⚡`}
          maxWidth="lg"
        >
          <form onSubmit={handleResolveDisputeSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Tribunal Ruling
              </label>
              <select
                value={resolutionAction}
                onChange={(e: any) => setResolutionAction(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none cursor-pointer"
              >
                <option value="Resolved_Refund_Learner">Rule in favor of Learner: Full Refund {selectedDispute.tokenAmount} ⚡</option>
                <option value="Resolved_Release_Teacher">Rule in favor of Teacher: Release {selectedDispute.tokenAmount} ⚡</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Faculty Arbitrator Resolution Note
              </label>
              <textarea
                rows={3}
                required
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="State the findings based on WebRTC presence logs and peer testimony..."
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                EXECUTE RULING & TRANSFER ESCROW
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CERTIFICATE PREVIEW MODAL */}
      {selectedCertForPreview && (
        <Modal
          isOpen={!!selectedCertForPreview}
          onClose={() => setSelectedCertForPreview(null)}
          title="CERTIFICATE AUDIT PREVIEW"
          subtitle={selectedCertForPreview.title}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full bg-soft-cloud border border-hairline overflow-hidden">
              <img src={selectedCertForPreview.fileUrl} alt={selectedCertForPreview.title} className="w-full h-full object-contain" />
            </div>
            <div className="flex justify-end">
              <button onClick={() => setSelectedCertForPreview(null)} className="btn-primary text-xs">
                CLOSE
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
