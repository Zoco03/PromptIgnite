import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Calendar, Clock, Zap, Plus, ArrowRight, 
  Hand, ThumbsUp, MessageSquare, Video, Mic, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { PromoBadge, VerifiedBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const WorkshopView: React.FC = () => {
  const { 
    currentUser, 
    workshops, 
    activeWorkshopId, 
    setActiveWorkshopId, 
    createWorkshop, 
    enrollInWorkshop, 
    askWorkshopQA, 
    upvoteWorkshopQA, 
    toggleHandRaise 
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeLiveWs, setActiveLiveWs] = useState<any | null>(null);

  // Create Workshop form state
  const [wsTitle, setWsTitle] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  const [wsSkillName, setWsSkillName] = useState('AI & Machine Learning (PyTorch & Transformers)');
  const [wsDate, setWsDate] = useState('2026-10-08');
  const [wsTime, setWsTime] = useState('17:00');
  const [wsDuration, setWsDuration] = useState(90);
  const [wsCapacity, setWsCapacity] = useState(30);
  const [wsPrice, setWsPrice] = useState(10);
  const [wsAgendaInput, setWsAgendaInput] = useState('1. Architecture review\n2. Hands-on coding\n3. Q&A and Colab Handout');

  // QA question input
  const [newQuestionText, setNewQuestionText] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkshop({
      title: wsTitle.toUpperCase(),
      description: wsDesc,
      skillName: wsSkillName,
      category: 'Software & AI',
      date: wsDate,
      startTime: wsTime,
      durationMinutes: wsDuration,
      capacity: wsCapacity,
      tokenPricePerPerson: wsPrice,
      agenda: wsAgendaInput.split('\n').filter(a => a.trim())
    });
    setIsCreateModalOpen(false);
    setWsTitle('');
    setWsDesc('');
  };

  const handleEnroll = (workshopId: string) => {
    enrollInWorkshop(workshopId);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !activeLiveWs) return;
    askWorkshopQA(activeLiveWs.id, newQuestionText);
    setNewQuestionText('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>GROUP SESSIONS & MASTERCLASSES (PRD 3.7)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            CAMPUS GROUP WORKSHOPS
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Join high-capacity group workshops led by student mentors and senior researchers. Low per-head token fee, interactive Q&A panels, and live code teardowns.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ HOST A GROUP WORKSHOP</span>
        </button>
      </div>

      {/* 1. WORKSHOP LISTING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {workshops.map(ws => {
          const isEnrolled = ws.attendees.some(a => a.userId === currentUser.id);
          const isHost = ws.teacherId === currentUser.id;

          return (
            <div 
              key={ws.id}
              className="bg-canvas border border-hairline p-6 sm:p-8 flex flex-col justify-between hover:border-ink transition-all"
            >
              <div>
                {/* Host Info */}
                <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
                  <div className="flex items-center gap-3">
                    <img
                      src={ws.teacherAvatar}
                      alt={ws.teacherName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-ink">{ws.teacherName} (Host)</h4>
                      <p className="text-[10px] text-mute">{ws.teacherDepartment}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-mute">Entry Fee</div>
                    <div className="text-base font-bold text-ink flex items-center gap-1 justify-end">
                      <Zap className="w-3.5 h-3.5 fill-ink" />
                      <span>{ws.tokenPricePerPerson} ⚡</span>
                      <span className="text-xs text-mute font-normal">/ seat</span>
                    </div>
                  </div>
                </div>

                {/* Title and details */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <PromoBadge label={ws.category} />
                    <span className="text-[11px] font-bold text-mute uppercase">{ws.skillName}</span>
                  </div>

                  <h3 className="font-display text-3xl text-ink uppercase tracking-tight leading-tight">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-charcoal leading-relaxed">
                    {ws.description}
                  </p>
                </div>

                {/* Agenda */}
                <div className="bg-soft-cloud border border-hairline p-4 mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-mute tracking-wider block mb-1">
                    Workshop Schedule & Agenda
                  </span>
                  {ws.agenda.map((ag, idx) => (
                    <div key={idx} className="text-xs text-ink font-mono flex items-start gap-2">
                      <span className="text-mute">›</span>
                      <span>{ag}</span>
                    </div>
                  ))}
                </div>

                {/* Meta stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink pt-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-mute" />
                    <span>{ws.date} at {ws.startTime} IST</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-mute" />
                    <span>{ws.durationMinutes} mins</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-mute" />
                    <span>{ws.enrolledCount} / {ws.capacity} Seats Filled</span>
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between">
                <div className="text-xs text-mute font-medium">
                  {isEnrolled ? (
                    <span className="text-success font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>You are registered!</span>
                    </span>
                  ) : (
                    <span>{ws.capacity - ws.enrolledCount} spots remaining</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLiveWs(ws)}
                    className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>OPEN LIVE ROOM</span>
                  </button>

                  {!isEnrolled && !isHost && (
                    <button
                      onClick={() => handleEnroll(ws.id)}
                      className="btn-primary text-xs py-2 px-5"
                    >
                      JOIN FOR {ws.tokenPricePerPerson} ⚡
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. LIVE INTERACTIVE WORKSHOP ROOM MODAL (PRD 3.7 Workshop Mode) */}
      {activeLiveWs && (
        <Modal
          isOpen={!!activeLiveWs}
          onClose={() => setActiveLiveWs(null)}
          title={`LIVE WORKSHOP: ${activeLiveWs.title}`}
          subtitle={`Host: ${activeLiveWs.teacherName} • ${activeLiveWs.enrolledCount} Attendees Connected`}
          maxWidth="4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Left Stage Video & Hand Raise (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-video bg-charcoal relative border border-hairline overflow-hidden group">
                <img
                  src={activeLiveWs.teacherAvatar}
                  alt={activeLiveWs.teacherName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3 bg-sale text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-canvas"></span>
                  <span>BROADCASTING LIVE</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                  <span className="text-xs font-bold uppercase">{activeLiveWs.teacherName} (Main Stage)</span>
                  <span className="text-[10px] bg-ink/60 px-2 py-0.5 rounded-full">32 Attendees</span>
                </div>
              </div>

              {/* Stage Controls & Raise Hand */}
              <div className="bg-soft-cloud border border-hairline p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHandRaise(activeLiveWs.id)}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Hand className="w-3.5 h-3.5" />
                    <span>RAISE HAND TO SPEAK</span>
                  </button>
                </div>

                <div className="text-xs text-mute font-medium">
                  {activeLiveWs.attendees.filter((a: any) => a.hasRaisedHand).length} Hands Raised
                </div>
              </div>

              {/* Attendee roster */}
              <div className="bg-canvas border border-hairline p-4">
                <span className="text-[10px] font-bold uppercase text-mute tracking-wider block mb-2">
                  Connected Students & Hands Raised
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeLiveWs.attendees.map((att: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-soft-cloud px-2.5 py-1 rounded-full text-xs font-semibold text-ink">
                      <img src={att.userAvatar} alt={att.userName} className="w-4 h-4 rounded-full object-cover" />
                      <span>{att.userName}</span>
                      {att.hasRaisedHand && <span className="text-sale">✋</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Q&A Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-soft-cloud border border-hairline p-4 min-h-[460px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-hairline">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-ink" />
                    <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
                      Live Q&A Board ({activeLiveWs.qaItems.length})
                    </h4>
                  </div>
                  <span className="text-[10px] text-mute font-medium">Ranked by Upvotes</span>
                </div>

                {/* Q&A items list */}
                <div className="space-y-3 mt-3 max-h-[300px] overflow-y-auto pr-1">
                  {activeLiveWs.qaItems.length === 0 ? (
                    <p className="text-xs text-mute text-center py-6">No questions asked yet. Be the first!</p>
                  ) : (
                    activeLiveWs.qaItems.map((q: any) => (
                      <div key={q.id} className="bg-canvas border border-hairline p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-ink font-medium leading-snug">{q.question}</p>
                          <button
                            onClick={() => upvoteWorkshopQA(activeLiveWs.id, q.id)}
                            className="btn-secondary !p-1.5 text-xs flex items-center gap-1 shrink-0"
                            title="Upvote question"
                          >
                            <ThumbsUp className="w-3 h-3 text-ink" />
                            <span className="font-bold">{q.upvotes}</span>
                          </button>
                        </div>
                        <div className="mt-2 text-[10px] text-mute flex items-center justify-between">
                          <span>Asked by {q.userName} at {q.timestamp}</span>
                          {q.isAnswered && (
                            <span className="text-success font-bold">✓ Answered Live</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handleAskQuestion} className="pt-3 border-t border-hairline flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask speaker a question..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="search-pill-input flex-1 text-xs"
                />
                <button type="submit" className="btn-primary text-xs py-2 px-4">
                  POST
                </button>
              </form>
            </div>

          </div>
        </Modal>
      )}

      {/* CREATE WORKSHOP MODAL */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="CREATE CAMPUS GROUP WORKSHOP"
          subtitle="Host a multi-student interactive masterclass"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Workshop Title
              </label>
              <input
                type="text"
                required
                value={wsTitle}
                onChange={(e) => setWsTitle(e.target.value)}
                placeholder="e.g. LLM AGENTS WITH RAG & PYTORCH"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none uppercase font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Description & Learning Outcomes
              </label>
              <textarea
                rows={2}
                required
                value={wsDesc}
                onChange={(e) => setWsDesc(e.target.value)}
                placeholder="Describe what students will build hands-on..."
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={wsDate}
                  onChange={(e) => setWsDate(e.target.value)}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={wsTime}
                  onChange={(e) => setWsTime(e.target.value)}
                  placeholder="17:00 IST"
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={wsCapacity}
                  onChange={(e) => setWsCapacity(Number(e.target.value))}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  min="30"
                  max="180"
                  value={wsDuration}
                  onChange={(e) => setWsDuration(Number(e.target.value))}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                  Token / Seat
                </label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={wsPrice}
                  onChange={(e) => setWsPrice(Number(e.target.value))}
                  className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Agenda Outline (1 line per bullet)
              </label>
              <textarea
                rows={3}
                value={wsAgendaInput}
                onChange={(e) => setWsAgendaInput(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink font-mono rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                PUBLISH GROUP WORKSHOP
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
