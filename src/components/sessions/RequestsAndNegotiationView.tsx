import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, X, RefreshCw, Clock, Zap, ShieldCheck, 
  MessageSquare, Calendar, ArrowRight, User
} from 'lucide-react';
import { PromoBadge, VerifiedBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const RequestsAndNegotiationView: React.FC = () => {
  const { 
    currentUser, 
    sessionRequests, 
    acceptSessionRequest, 
    rejectSessionRequest, 
    counterOfferRequest,
    setCurrentTab,
    setActiveLiveSessionId,
    liveSessions
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'outgoing'>('incoming');

  // Counter Modal state
  const [selectedRequestForCounter, setSelectedRequestForCounter] = useState<any | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(20);
  const [counterDate, setCounterDate] = useState<string>('2026-10-04');
  const [counterTime, setCounterTime] = useState<string>('17:00 - 18:00');
  const [counterNote, setCounterNote] = useState<string>('');

  // Reject Modal state
  const [selectedRequestForReject, setSelectedRequestForReject] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const incomingRequests = sessionRequests.filter(r => r.teacherId === currentUser.id);
  const outgoingRequests = sessionRequests.filter(r => r.learnerId === currentUser.id);

  const displayedList = activeSubTab === 'incoming' ? incomingRequests : outgoingRequests;

  const handleOpenCounterModal = (req: any) => {
    setSelectedRequestForCounter(req);
    setCounterPrice(req.tokenPrice);
    setCounterDate(req.requestedDate);
    setCounterTime(req.requestedTime);
    setCounterNote('');
  };

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForCounter) return;
    counterOfferRequest(
      selectedRequestForCounter.id,
      counterPrice,
      counterDate,
      counterTime,
      counterNote
    );
    setSelectedRequestForCounter(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForReject) return;
    rejectSessionRequest(selectedRequestForReject.id, rejectReason);
    setSelectedRequestForReject(null);
  };

  const handleJoinLive = (requestId: string) => {
    const live = liveSessions.find(s => s.requestId === requestId || s.id === requestId);
    if (live) {
      setActiveLiveSessionId(live.id);
    } else {
      setActiveLiveSessionId(requestId);
    }
    setCurrentTab('live_room');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>MULTI-ROUND NEGOTIATION & ESCROW WORKFLOW (PRD 3.6)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            SESSION REQUESTS & ESCROW
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Review incoming tutoring requests or manage your outgoing session bookings. Accept slots to lock tokens in escrow, propose counter-offers (up to 3 rounds), or decline with feedback.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-soft-cloud p-1 rounded-full border border-hairline">
          <button
            onClick={() => setActiveSubTab('incoming')}
            className={`px-5 py-2 text-xs font-bold uppercase rounded-full transition-colors ${
              activeSubTab === 'incoming' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            Incoming Teaching ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveSubTab('outgoing')}
            className={`px-5 py-2 text-xs font-bold uppercase rounded-full transition-colors ${
              activeSubTab === 'outgoing' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
            }`}
          >
            Outgoing Learning ({outgoingRequests.length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {displayedList.length === 0 ? (
        <div className="bg-soft-cloud border border-hairline p-12 text-center">
          <h3 className="font-display text-3xl text-ink uppercase">No Requests in this Queue</h3>
          <p className="text-xs text-mute mt-2">
            {activeSubTab === 'incoming' 
              ? 'List more skills or pass verification challenges to receive peer tutoring requests.'
              : 'Search for peer teachers to send your first session request.'}
          </p>
          <button 
            onClick={() => setCurrentTab('search')} 
            className="btn-primary text-xs mt-4"
          >
            DISCOVER TEACHERS
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedList.map(req => {
            const isTeacher = currentUser.id === req.teacherId;
            const requiresAction = 
              (isTeacher && (req.status === 'pending_teacher' || req.status === 'pending_teacher_counter')) ||
              (!isTeacher && req.status === 'pending_learner_counter');

            return (
              <div 
                key={req.id}
                className={`bg-canvas border p-6 transition-all ${
                  requiresAction ? 'border-ink shadow-sm' : 'border-hairline'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline-soft">
                  <div className="flex items-center gap-3">
                    <img
                      src={isTeacher ? req.learnerAvatar : req.teacherAvatar}
                      alt={isTeacher ? req.learnerName : req.teacherName}
                      className="w-11 h-11 rounded-full object-cover border border-hairline"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-mute tracking-wider">
                          {isTeacher ? 'Learner Request' : 'Teaching Mentor'}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          req.status === 'accepted' ? 'bg-success text-on-primary' :
                          req.status === 'rejected' ? 'bg-sale text-on-primary' :
                          req.status === 'expired' ? 'bg-mute text-on-primary' : 'bg-ink text-on-primary'
                        }`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl text-ink uppercase tracking-tight mt-0.5">
                        {isTeacher ? req.learnerName : req.teacherName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center">
                    <div className="text-[10px] uppercase font-bold text-mute">Escrow Agreed Rate</div>
                    <div className="text-base font-bold text-ink flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-ink" />
                      <span>{req.tokenPrice} ⚡</span>
                      <span className="text-xs text-mute font-normal">/ hour</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="py-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-mute block">Topic & Scope</span>
                    <h4 className="text-sm font-semibold text-ink mt-0.5">{req.topic}</h4>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-mute block">Specific Goal</span>
                    <p className="text-xs text-charcoal mt-0.5 leading-relaxed">{req.goal}</p>
                  </div>

                  {req.message && (
                    <div className="bg-soft-cloud p-3 border border-hairline text-xs text-charcoal">
                      <span className="font-semibold text-ink">Note: </span>
                      <span>"{req.message}"</span>
                    </div>
                  )}

                  {/* Schedule slot */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-mute" />
                      <span>Date: {req.requestedDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-mute" />
                      <span>Slot: {req.requestedTime}</span>
                    </span>
                    <span className="text-mute font-normal">
                      Round {req.counterRounds.length} / {req.maxRounds} max
                    </span>
                  </div>

                  {/* Negotiation Rounds History (PRD 3.6) */}
                  {req.counterRounds.length > 0 && (
                    <div className="bg-soft-cloud border border-hairline p-3 mt-3 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-mute tracking-wider block">
                        Negotiation Counter-Offer History
                      </span>
                      {req.counterRounds.map((round, idx) => (
                        <div key={idx} className="text-xs text-charcoal flex items-start gap-2 pt-1 border-t border-hairline-soft first:border-0 first:pt-0">
                          <span className="font-bold text-ink">Round {idx + 1}:</span>
                          <span>
                            Proposed <strong>{round.tokenPrice} ⚡</strong> for {round.proposedDate} ({round.proposedTime}). 
                            {round.note && <em className="text-mute ml-1">"{round.note}"</em>}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {req.rejectionReason && (
                    <div className="bg-sale/10 border border-sale/20 p-3 text-xs text-sale font-medium">
                      <strong>Decline Reason:</strong> {req.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-hairline-soft flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-mute font-medium">
                    {req.status === 'accepted' ? (
                      <span className="text-success font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Escrow Locked • Confirmed in Calendar</span>
                      </span>
                    ) : (
                      <span>Auto-expires if unconfirmed within 48h</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'accepted' ? (
                      <button
                        onClick={() => handleJoinLive(req.id)}
                        className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                      >
                        <span>ENTER LIVE ROOM</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : requiresAction ? (
                      <>
                        <button
                          onClick={() => setSelectedRequestForReject(req)}
                          className="btn-secondary !text-sale text-xs py-2 px-4"
                        >
                          DECLINE
                        </button>
                        <button
                          onClick={() => handleOpenCounterModal(req)}
                          className="btn-secondary text-xs py-2 px-4"
                        >
                          COUNTER-OFFER
                        </button>
                        <button
                          onClick={() => acceptSessionRequest(req.id)}
                          className="btn-primary text-xs py-2 px-6"
                        >
                          ACCEPT & LOCK ESCROW
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-mute font-medium">
                        Waiting on other participant...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COUNTER OFFER MODAL (PRD 3.6) */}
      {selectedRequestForCounter && (
        <Modal
          isOpen={!!selectedRequestForCounter}
          onClose={() => setSelectedRequestForCounter(null)}
          title="PROPOSE COUNTER-OFFER"
          subtitle={`Counter Round ${selectedRequestForCounter.counterRounds.length + 1} of 3`}
          maxWidth="lg"
        >
          <form onSubmit={handleCounterSubmit} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-mute tracking-wider mb-1">
                <span>Propose Token Rate</span>
                <span className="text-ink font-bold">{counterPrice} ⚡</span>
              </div>
              <input
                type="number"
                min="5"
                max="60"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={counterDate}
                  onChange={(e) => setCounterDate(e.target.value)}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Proposed Time
                </label>
                <select
                  value={counterTime}
                  onChange={(e) => setCounterTime(e.target.value)}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                >
                  <option value="15:00 - 16:00">15:00 - 16:00 IST</option>
                  <option value="16:00 - 17:00">16:00 - 17:00 IST</option>
                  <option value="17:00 - 18:00">17:00 - 18:00 IST</option>
                  <option value="18:00 - 19:00">18:00 - 19:00 IST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Reason / Note for Counter
              </label>
              <textarea
                rows={2}
                required
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="e.g. I have a lab conflict at 16:00; can we do 17:00 at 16 tokens?"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRequestForCounter(null)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                SEND COUNTER-OFFER
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* REJECT REQUEST MODAL */}
      {selectedRequestForReject && (
        <Modal
          isOpen={!!selectedRequestForReject}
          onClose={() => setSelectedRequestForReject(null)}
          title="DECLINE SESSION REQUEST"
          subtitle="Provide a reason so the learner can refine their request or choose another mentor"
          maxWidth="md"
        >
          <form onSubmit={handleRejectSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Decline Reason
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                <option value="">Select reason...</option>
                <option value="Schedule fully booked this week">Schedule fully booked this week</option>
                <option value="Topic is outside my current research scope">Topic is outside my current research scope</option>
                <option value="Token offer does not match complexity">Token offer does not match complexity</option>
                <option value="Upcoming university exams">Upcoming university exams</option>
              </select>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRequestForReject(null)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary !bg-sale !text-on-primary text-xs"
              >
                CONFIRM DECLINE
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
