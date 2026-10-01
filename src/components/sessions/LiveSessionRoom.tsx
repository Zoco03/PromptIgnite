import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, 
  Send, Code2, Paperclip, MessageSquare, Edit3, Square, 
  Circle, Trash2, ShieldAlert, Star, CheckCircle2, Zap, Clock, Maximize2
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const LiveSessionRoom: React.FC = () => {
  const { 
    currentUser, 
    liveSessions, 
    activeLiveSessionId, 
    completeLiveSession, 
    raiseLiveSessionDispute,
    whiteboardElements,
    addWhiteboardElement,
    clearWhiteboard,
    inSessionMessages,
    sendInSessionMessage,
    setCurrentTab
  } = useApp();

  const activeSession = liveSessions.find(s => s.id === activeLiveSessionId) || liveSessions[0];

  // Video & Audio Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTabPanel, setActiveTabPanel] = useState<'whiteboard' | 'chat'>('whiteboard');

  // Timer: 60 minutes countdown
  const [elapsedSeconds, setElapsedSeconds] = useState(1450); // 24m 10s elapsed
  const totalDurationSeconds = 3600; // 60 mins

  // In-session chat input
  const [chatInput, setChatInput] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);

  // Whiteboard drawing tool states
  const [activeTool, setActiveTool] = useState<'pen' | 'rect' | 'circle' | 'sticky'>('pen');
  const [drawColor, setDrawColor] = useState<string>('#111111');
  const [stickyText, setStickyText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  // Completion & Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Dispute Modal
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');

  // Clock tick
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeSession) return;
    sendInSessionMessage(
      activeSession.id, 
      chatInput, 
      isCodeMode ? 'code' : 'text',
      isCodeMode ? 'python' : undefined
    );
    setChatInput('');
  };

  const handleAddSticky = () => {
    if (!stickyText.trim()) return;
    addWhiteboardElement({
      id: `wb_${Date.now()}`,
      type: 'sticky',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100,
      color: drawColor,
      text: stickyText,
      authorId: currentUser.id
    });
    setStickyText('');
  };

  const handleConfirmEndSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;
    completeLiveSession(activeSession.id, rating, feedback);
    setIsReviewModalOpen(false);
  };

  const handleConfirmDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;
    raiseLiveSessionDispute(activeSession.id, disputeReason, disputeEvidence);
    setIsDisputeModalOpen(false);
  };

  if (!activeSession) {
    return (
      <div className="bg-soft-cloud border border-hairline p-12 text-center">
        <h3 className="font-display text-3xl text-ink uppercase">No Active Live Session</h3>
        <p className="text-xs text-mute mt-2">Book a session or accept a request to join the live WebRTC room.</p>
        <button onClick={() => setCurrentTab('search')} className="btn-primary text-xs mt-4">
          DISCOVER TEACHERS
        </button>
      </div>
    );
  }

  const isTeacher = currentUser.id === activeSession.teacherId;

  return (
    <div className="space-y-4 pb-16">
      
      {/* Session Header Bar */}
      <div className="bg-ink text-on-primary p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-sale animate-ping shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-hairline">
                LIVE 1:1 WEBRTC SESSION
              </span>
              <span className="text-hairline">•</span>
              <span className="text-xs text-success font-semibold">🔒 {activeSession.tokenAmount} ⚡ in Escrow</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-on-primary uppercase tracking-tight leading-none mt-0.5">
              {activeSession.topic}
            </h2>
          </div>
        </div>

        {/* Real-time Session Timer (PRD 3.7) */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-canvas/10 px-3.5 py-1.5 rounded-full border border-canvas/20 flex items-center gap-2 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-on-primary" />
            <span>Elapsed: <strong>{formatTime(elapsedSeconds)}</strong></span>
            <span className="text-hairline">/ {formatTime(totalDurationSeconds)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDisputeModalOpen(true)}
              className="px-3 py-1.5 bg-sale text-on-primary text-xs font-semibold rounded-full hover:bg-sale-deep transition-all flex items-center gap-1"
              title="Dispute / Freeze Escrow"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FREEZE ESCROW</span>
            </button>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-primary !bg-success !text-on-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>END SESSION & RELEASE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Live Room Workspace: Left Video Feeds + Right Tabbed Interactive Surface (Whiteboard / Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
        
        {/* LEFT COLUMN: 2-Up Video Feeds & Hardware Controls (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Video Feed 1: Teacher */}
          <div className="relative aspect-video bg-charcoal overflow-hidden border border-hairline group">
            <img
              src={activeSession.teacherAvatar}
              alt={activeSession.teacherName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
              <span className="text-xs font-bold tracking-tight uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                {activeSession.teacherName} (Teacher)
              </span>
              <span className="text-[10px] bg-ink/60 px-2 py-0.5 rounded-full">HD 1080p</span>
            </div>
          </div>

          {/* Video Feed 2: Learner or Screen Share Preview */}
          <div className="relative aspect-video bg-charcoal overflow-hidden border border-hairline group">
            {isScreenSharing ? (
              <div className="w-full h-full bg-ink p-4 flex flex-col justify-center items-center text-center text-on-primary">
                <Monitor className="w-8 h-8 text-info animate-pulse mb-2" />
                <span className="text-xs font-bold uppercase">Sharing Jupyter Notebook Screen</span>
                <span className="text-[10px] text-hairline mt-1">PyTorch CUDA Tensor Operations</span>
              </div>
            ) : isCamOn ? (
              <img
                src={activeSession.learnerAvatar}
                alt={activeSession.learnerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-ink flex items-center justify-center text-mute text-xs">
                Camera Disabled
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
              <span className="text-xs font-bold tracking-tight uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                {activeSession.learnerName} (Learner)
              </span>
              <span className="text-[10px] bg-ink/60 px-2 py-0.5 rounded-full">Mic Active</span>
            </div>
          </div>

          {/* Media Hardware Control Bar (Pills & Circular Buttons) */}
          <div className="bg-canvas border border-hairline p-3 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`btn-icon-circular ${!isMicOn ? '!bg-sale !text-on-primary' : ''}`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsCamOn(!isCamOn)}
              className={`btn-icon-circular ${!isCamOn ? '!bg-sale !text-on-primary' : ''}`}
              title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`btn-icon-circular ${isScreenSharing ? '!bg-info !text-on-primary' : ''}`}
              title="Share Screen"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-icon-circular !bg-sale !text-on-primary"
              title="Leave / End Session"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Whiteboard & In-Session Chat (8 cols on lg) */}
        <div className="lg:col-span-8 bg-canvas border border-hairline flex flex-col justify-between">
          
          {/* Surface Tab Header */}
          <div className="border-b border-hairline px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTabPanel('whiteboard')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-tight rounded-full transition-colors ${
                  activeTabPanel === 'whiteboard' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
                }`}
              >
                Shared Whiteboard
              </button>
              <button
                onClick={() => setActiveTabPanel('chat')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-tight rounded-full transition-colors ${
                  activeTabPanel === 'chat' ? 'bg-ink text-on-primary' : 'text-mute hover:text-ink'
                }`}
              >
                Live Chat ({inSessionMessages.length})
              </button>
            </div>

            {activeTabPanel === 'whiteboard' && (
              <div className="flex items-center gap-2">
                {/* Swatch color picker */}
                <div className="flex items-center gap-1 bg-soft-cloud px-2 py-1 rounded-full border border-hairline">
                  {['#111111', '#d30005', '#1151ff', '#007d48'].map(c => (
                    <button
                      key={c}
                      onClick={() => setDrawColor(c)}
                      className={`w-3.5 h-3.5 rounded-full transition-transform ${drawColor === c ? 'scale-125 ring-2 ring-offset-1 ring-ink' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <button
                  onClick={clearWhiteboard}
                  className="btn-icon-circular !w-7 !h-7 text-mute hover:text-sale"
                  title="Clear Whiteboard"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Body: Whiteboard or Live Chat */}
          {activeTabPanel === 'whiteboard' ? (
            <div className="flex-1 bg-soft-cloud relative p-6 overflow-hidden min-h-[420px] flex flex-col justify-between select-none">
              
              {/* Whiteboard Elements Overlay */}
              <div className="space-y-4">
                <div className="bg-canvas border border-hairline p-4 max-w-md shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-mute block mb-1">
                    Shared Session Notes & Agenda
                  </span>
                  <p className="text-xs text-ink leading-relaxed font-mono">
                    {activeSession.whiteboardNotes || '1. Review PyTorch 2.4 Compile optimizations\n2. Inspect torch.nn.MultiheadAttention tensors\n3. Fine-tuning LoRA adapters'}
                  </p>
                </div>

                {whiteboardElements.map(el => (
                  <div 
                    key={el.id}
                    className="p-3 bg-canvas border border-ink text-xs font-medium max-w-xs shadow-md animate-in zoom-in-95"
                    style={{ borderColor: el.color }}
                  >
                    <div className="text-[9px] font-bold uppercase text-mute mb-0.5">Sticky Note</div>
                    <p className="text-ink">{el.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Sticky Note Toolbar */}
              <div className="mt-4 pt-3 border-t border-hairline flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type note to pin on shared canvas..."
                  value={stickyText}
                  onChange={(e) => setStickyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSticky()}
                  className="search-pill-input flex-1 text-xs"
                />
                <button
                  onClick={handleAddSticky}
                  className="btn-primary text-xs py-2 px-5"
                >
                  PIN NOTE
                </button>
              </div>
            </div>
          ) : (
            /* Live In-Session Chat */
            <div className="flex-1 flex flex-col justify-between p-4 min-h-[420px]">
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
                {inSessionMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-mute mb-0.5">
                      <span className="font-semibold text-ink">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {msg.type === 'code' ? (
                      <pre className="p-3 bg-ink text-on-primary text-xs font-mono rounded-none max-w-lg overflow-x-auto border border-hairline">
                        <code>{msg.text}</code>
                      </pre>
                    ) : (
                      <div className={`p-3 text-xs leading-relaxed max-w-md ${
                        msg.senderId === currentUser.id ? 'bg-ink text-on-primary' : 'bg-soft-cloud text-ink border border-hairline'
                      }`}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-hairline flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCodeMode(!isCodeMode)}
                  className={`btn-icon-circular ${isCodeMode ? '!bg-ink !text-on-primary' : ''}`}
                  title="Toggle Code Snippet Mode"
                >
                  <Code2 className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={isCodeMode ? "Paste Python/JS code snippet..." : "Type in-session message..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="search-pill-input flex-1 text-xs font-mono"
                />

                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* SESSION COMPLETION & ESCROW RELEASE MODAL (PRD 3.7 & 3.12) */}
      {isReviewModalOpen && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="CONFIRM SESSION COMPLETION"
          subtitle={`Escrow Amount: ${activeSession.tokenAmount} ⚡ will be transferred to ${activeSession.teacherName}`}
          maxWidth="lg"
        >
          <form onSubmit={handleConfirmEndSession} className="space-y-4 text-left">
            <div className="bg-soft-cloud border border-hairline p-4">
              <div className="flex items-center justify-between text-xs text-ink font-semibold">
                <span>Session Duration:</span>
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink font-semibold mt-1">
                <span>Escrow Release Status:</span>
                <span className="text-success font-bold">Ready to Release</span>
              </div>
            </div>

            {/* 5-Star Rating */}
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-2">
                Rate Mentorship Quality (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-ink text-ink' : 'text-hairline'}`} />
                  </button>
                ))}
                <span className="text-xs font-bold text-ink ml-2">{rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Feedback Review */}
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Public Endorsement / Review (Added to Portfolio)
              </label>
              <textarea
                rows={3}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe how helpful the session was and what you built together..."
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="btn-secondary text-xs"
              >
                BACK TO CALL
              </button>
              <button
                type="submit"
                className="btn-primary !bg-success !text-on-primary text-xs py-2.5 px-6"
              >
                RELEASE {activeSession.tokenAmount} ⚡ & COMPLETE
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DISPUTE TRIBUNAL MODAL */}
      {isDisputeModalOpen && (
        <Modal
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          title="FREEZE ESCROW & LOG DISPUTE"
          subtitle="Escrow funds will be held in freeze pending Department Faculty Tribunal audit"
          maxWidth="lg"
        >
          <form onSubmit={handleConfirmDispute} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Reason for Dispute
              </label>
              <select
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                <option value="">Select reason...</option>
                <option value="Teacher/Learner No-Show">Participant did not join slot</option>
                <option value="Severe Audio/Video Technical Failure">Severe connection disruption / early exit</option>
                <option value="Off-Topic or Inadequate Instruction">Instruction did not match agreed topic</option>
                <option value="Harassment or Code of Conduct Violation">Code of conduct violation</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Evidence & Description
              </label>
              <textarea
                rows={3}
                required
                value={disputeEvidence}
                onChange={(e) => setDisputeEvidence(e.target.value)}
                placeholder="Explain the timeline of events for faculty review..."
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary !bg-sale !text-on-primary text-xs"
              >
                SUBMIT DISPUTE & FREEZE ESCROW
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
