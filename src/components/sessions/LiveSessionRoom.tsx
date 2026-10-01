import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, 
  Send, Code2, MessageSquare, Edit3, Square, 
  Circle, Trash2, ShieldAlert, Star, CheckCircle2, Clock, Maximize2,
  Users, AlertCircle, Smartphone, Moon, Activity, Eye, Zap, Sparkles,
  PlusCircle, Radio
} from 'lucide-react';
import { VisionDetectionState } from '../study/StudyTrackerView';
import { LiveSession } from '../../types';

export const LiveSessionRoom: React.FC = () => {
  const { 
    currentUser, 
    allUsers,
    liveSessions, 
    activeLiveSessionId, 
    setActiveLiveSessionId,
    completeLiveSession, 
    raiseLiveSessionDispute,
    whiteboardElements,
    addWhiteboardElement,
    clearWhiteboard,
    inSessionMessages,
    sendInSessionMessage,
    setCurrentTab
  } = useApp();

  // Active Live Session Selection
  const activeSession: LiveSession | undefined = liveSessions.find(s => s.id === activeLiveSessionId) || liveSessions[0];
  const otherPeer = allUsers.find(u => u.id !== currentUser?.id);

  // Video & Audio MediaStream States
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTabPanel, setActiveTabPanel] = useState<'whiteboard' | 'chat'>('whiteboard');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Computer Vision in Video Call State
  const [isCvEnabled, setIsCvEnabled] = useState(true);
  const [cvState, setCvState] = useState<VisionDetectionState>('focused');
  const [stressLevel, setStressLevel] = useState<'Normal' | 'Elevated' | 'High'>('Normal');
  const [phoneDetectedCount, setPhoneDetectedCount] = useState(0);
  const [drowsyDetectedCount, setDrowsyDetectedCount] = useState(0);
  const [attentionIndex, setAttentionIndex] = useState(98);
  const [cvNudge, setCvNudge] = useState('🟢 Both peers actively engaged in 1:1 collaborative session.');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const cvCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Timer: 60 minutes countdown
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // In-session chat input
  const [chatInput, setChatInput] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);

  // Whiteboard drawing tool states
  const [drawColor, setDrawColor] = useState<string>('#111111');
  const [stickyText, setStickyText] = useState('');

  // Completion & Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  // Dispute Modal
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');

  // Start Local Webcam MediaStream
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }
      setIsCamOn(true);
      setIsMicOn(true);
    } catch (err: any) {
      console.warn('Webcam stream error:', err);
      setCameraError('Webcam / Microphone access was blocked or not found. Please allow camera permissions.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Toggle Camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const nextState = !isCamOn;
        videoTracks.forEach(t => t.enabled = nextState);
        setIsCamOn(nextState);
      }
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !isMicOn;
        audioTracks.forEach(t => t.enabled = nextState);
        setIsMicOn(nextState);
      }
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } else {
        if (localStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.warn('Screen share cancelled:', err);
    }
  };

  // Computer Vision analysis loop during video call
  useEffect(() => {
    let interval: any;
    let prevData: Uint8ClampedArray | null = null;
    let lowMotionCount = 0;

    if (isCamOn && isCvEnabled) {
      interval = setInterval(() => {
        if (!localVideoRef.current || !cvCanvasRef.current) return;
        const v = localVideoRef.current;
        const c = cvCanvasRef.current;
        const ctx = c.getContext('2d');
        if (!ctx || v.videoWidth === 0) return;

        c.width = 160;
        c.height = 120;
        ctx.drawImage(v, 0, 0, 160, 120);
        const frame = ctx.getImageData(0, 0, 160, 120);
        const d = frame.data;

        let diff = 0;
        let lowerMotion = 0;

        for (let i = 0; i < d.length; i += 4) {
          const b = (d[i] + d[i+1] + d[i+2]) / 3;
          if (prevData) {
            const pDiff = Math.abs(b - prevData[i/4]);
            diff += pDiff;
            const y = Math.floor((i/4)/160);
            if (y > 80 && pDiff > 30) lowerMotion += pDiff;
          }
        }

        const avgMotion = prevData ? diff / (160 * 120) : 0;
        prevData = new Uint8ClampedArray(160 * 120);
        for (let i = 0; i < d.length; i += 4) {
          prevData[i/4] = (d[i] + d[i+1] + d[i+2]) / 3;
        }

        // CV Rules:
        if (avgMotion < 1.0) {
          lowMotionCount++;
          if (lowMotionCount >= 4) {
            setCvState('drowsy');
            setDrowsyDetectedCount(cnt => cnt + 1);
            setCvNudge('⚠️ Drowsiness / low alertness detected. Stay engaged with peer.');
            return;
          }
        } else {
          lowMotionCount = 0;
        }

        if (lowerMotion > 5000 && avgMotion > 12) {
          setCvState('phone_usage');
          setPhoneDetectedCount(cnt => cnt + 1);
          setCvNudge('📱 Phone usage detected during live exchange.');
          return;
        }

        if (avgMotion > 40) {
          setCvState('high_stress');
          setStressLevel('High');
          setCvNudge('⚡ High agitation / erratic movement detected.');
          return;
        }

        setCvState('focused');
        setStressLevel('Normal');
        setCvNudge('🟢 Optimal peer collaboration and attentiveness.');
        setAttentionIndex(idx => Math.min(100, idx + 1));

      }, 1500);
    }

    return () => clearInterval(interval);
  }, [isCamOn, isCvEnabled]);

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
    if (!chatInput.trim() || !currentUser) return;
    const sessId = activeSession ? activeSession.id : 'instant_live_sess';
    sendInSessionMessage(
      sessId, 
      chatInput, 
      isCodeMode ? 'code' : 'text',
      isCodeMode ? 'python' : undefined
    );
    setChatInput('');
  };

  const handleAddSticky = () => {
    if (!stickyText.trim() || !currentUser) return;
    addWhiteboardElement({
      id: `wb_${Date.now()}`,
      type: 'sticky',
      x: 80 + Math.random() * 150,
      y: 80 + Math.random() * 80,
      color: drawColor,
      text: stickyText,
      authorId: currentUser.id
    });
    setStickyText('');
  };

  const handleConfirmEndSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSession) {
      completeLiveSession(activeSession.id, rating, feedback || 'Excellent 1:1 peer exchange session.');
    }
    setIsReviewModalOpen(false);
    setCurrentTab('wallet');
  };

  const handleConfirmDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSession) {
      raiseLiveSessionDispute(activeSession.id, disputeReason, disputeEvidence);
    }
    setIsDisputeModalOpen(false);
  };

  const sessionTopic = activeSession?.topic || '1:1 Interactive Peer Tutoring';
  const pointsStake = activeSession?.tokenAmount || 20;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-6 space-y-6">

      {/* ── 1. ONGOING ACTIVE LIVE VC ROOMS RAIL (PRD / USER REQUEST) ── */}
      <div className="bg-white border-2 border-[#111111] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#d30005] animate-pulse" />
            <h2 className="font-display text-xl uppercase tracking-wider text-[#111111] leading-none">
              ONGOING CAMPUS LIVE VC ROOMS ({liveSessions.length > 0 ? liveSessions.length : 1})
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#707072]">
            1:1 Uncompressed Video & Whiteboard
          </span>
        </div>

        {/* Live Rooms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          
          {/* Primary Active Room */}
          <div className="p-4 bg-[#111111] text-white flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-[#d30005] text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  🔴 Active Room (Now)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">⚡ {pointsStake} SP</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-2 line-clamp-1">{sessionTopic}</h3>
              <p className="text-xs text-[#cacacb] mt-0.5">
                Host: {activeSession?.teacherName || currentUser?.name} · Peer: {activeSession?.learnerName || otherPeer?.name || 'Peer Mentor'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#39393b] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#9e9ea0]">Duration: {formatTime(elapsedSeconds)}</span>
              <button
                onClick={() => {
                  if (activeSession) setActiveLiveSessionId(activeSession.id);
                  startCamera();
                }}
                className="bg-white text-[#111111] text-xs font-bold uppercase px-3 py-1 rounded-full hover:bg-[#e5e5e5] transition-all"
              >
                In Call (Active)
              </button>
            </div>
          </div>

          {/* Secondary Live Sessions (if any other booked calls exist) */}
          {liveSessions.filter(s => s.id !== activeSession?.id).map(sess => (
            <div key={sess.id} className="p-4 bg-[#f5f5f5] border border-[#e5e5e5] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-[#007d48] text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                    ● Upcoming Room
                  </span>
                  <span className="text-[10px] font-mono text-[#111111] font-bold">⚡ {sess.tokenAmount} SP</span>
                </div>
                <h3 className="font-bold text-sm text-[#111111] mt-2 line-clamp-1">{sess.topic}</h3>
                <p className="text-xs text-[#707072] mt-0.5">
                  Host: {sess.teacherName} · Learner: {sess.learnerName}
                </p>
              </div>

              <div className="pt-2 border-t border-[#cacacb] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#707072]">Scheduled 60m</span>
                <button
                  onClick={() => {
                    setActiveLiveSessionId(sess.id);
                    startCamera();
                  }}
                  className="btn-primary !py-1 !px-3 text-xs font-bold uppercase"
                >
                  Join This VC
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ── 2. TOP ROOM STATUS & CONTROLS BAR ── */}
      <div className="bg-[#111111] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#d30005] animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl uppercase tracking-wider text-white leading-none">
                CONNECTED: {sessionTopic}
              </span>
              <span className="badge-tokens text-xs font-mono">
                ⚡ {pointsStake} SkillPoints in Escrow
              </span>
            </div>
            <div className="text-xs font-mono text-[#cacacb] mt-0.5">
              Host: {currentUser?.name} & {otherPeer?.name || 'Peer Mentee'}
            </div>
          </div>
        </div>

        {/* Elapsed Timer & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCvEnabled(!isCvEnabled)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all flex items-center gap-1.5 ${
              isCvEnabled ? 'bg-[#007d48] text-white border-emerald-400' : 'bg-[#262626] text-[#cacacb] border-[#39393b]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isCvEnabled ? 'CV Biometrics: ON' : 'CV Biometrics: OFF'}</span>
          </button>

          <div className="bg-[#262626] border border-[#39393b] px-3.5 py-1.5 rounded-full font-mono text-xs text-emerald-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>SESSION TIME: {formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[#d30005] hover:bg-[#b00004] text-white text-xs font-bold uppercase px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-md"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            End Call & Release Escrow
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* ── 3. MAIN VIDEO & COLLABORATION STAGE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: VIDEO CALL FEEDS & CV TELEMETRY (7 cols) ── */}
        <div className="lg:col-span-7 space-y-4">

          {/* Primary Video Feed (Local Webcam Stream) */}
          <div className="relative bg-black aspect-video w-full border-2 border-[#111111] overflow-hidden flex items-center justify-center shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                transform: !isScreenSharing && isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
                transition: 'transform 0.2s ease'
              }}
              className={`w-full h-full object-cover ${!isCamOn ? 'hidden' : ''}`}
            />
            <canvas ref={cvCanvasRef} className="hidden" />

            {!isCamOn && (
              <div className="text-center p-6 space-y-2">
                <VideoOff className="w-12 h-12 text-[#707072] mx-auto" />
                <p className="text-xs font-mono text-[#cacacb]">Your camera is currently off</p>
              </div>
            )}

            {/* Local User Badge */}
            <div className="absolute top-3 left-3 bg-black/75 text-white px-3 py-1 rounded-full text-xs font-mono border border-white/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>You ({currentUser?.name || 'Student'})</span>
              {isScreenSharing && <span className="text-amber-300">· [Screen Share Active]</span>}
            </div>

            {/* Computer Vision Live Status Tag */}
            {isCamOn && isCvEnabled && (
              <div className="absolute top-3 right-3 z-10">
                {cvState === 'focused' && (
                  <div className="bg-[#007d48]/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>CV: Focused</span>
                  </div>
                )}
                {cvState === 'drowsy' && (
                  <div className="bg-amber-600/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-300">
                    <Moon className="w-3 h-3 text-amber-200" />
                    <span>CV: Drowsy</span>
                  </div>
                )}
                {cvState === 'phone_usage' && (
                  <div className="bg-[#d30005]/95 text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-red-300">
                    <Smartphone className="w-3 h-3 text-white" />
                    <span>CV: Phone In Use</span>
                  </div>
                )}
                {cvState === 'high_stress' && (
                  <div className="bg-purple-900/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-purple-400">
                    <Zap className="w-3 h-3 text-purple-300" />
                    <span>CV: Strain / Agitation</span>
                  </div>
                )}
              </div>
            )}

            {/* In-Call Peer Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-44 aspect-video bg-[#262626] border-2 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-2">
              <img
                src={otherPeer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt="Peer"
                className="w-10 h-10 rounded-full object-cover border border-white mb-1"
              />
              <span className="text-[10px] font-bold text-white truncate max-w-full">
                {otherPeer?.name || 'Peer Mentor'}
              </span>
              <span className="text-[8px] font-mono text-emerald-400">● Connected (Live)</span>
            </div>
          </div>

          {/* Computer Vision Live Telemetry Bar */}
          {isCvEnabled && (
            <div className="p-3 bg-[#111111] text-white border border-[#39393b] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{cvNudge}</span>
              </div>
              <div className="text-[10px] text-[#9e9ea0] hidden sm:block">
                Phone pickups: <strong className="text-red-400">{phoneDetectedCount}</strong> | Stress: <strong className="text-white">{stressLevel}</strong>
              </div>
            </div>
          )}

          {/* Video Control Bar */}
          <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={toggleMic}
              className={`btn-icon-circular ${!isMicOn ? '!bg-[#d30005] !text-white' : ''}`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleCamera}
              className={`btn-icon-circular ${!isCamOn ? '!bg-[#d30005] !text-white' : ''}`}
              title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                isMirrored ? 'bg-[#f5f5f5] text-[#111111] border border-[#cacacb] hover:bg-[#e5e5e5]' : 'bg-[#111111] text-white'
              }`}
              title="Toggle mirrored reflection"
            >
              <span>{isMirrored ? '🪞 Mirrored' : '📷 Unmirrored'}</span>
            </button>

            <button
              onClick={toggleScreenShare}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                isScreenSharing ? 'bg-[#007d48] text-white' : 'bg-[#111111] text-white hover:bg-[#333333]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            </button>

            <button
              onClick={() => setIsDisputeModalOpen(true)}
              className="text-xs text-[#707072] hover:text-[#d30005] underline ml-auto flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Report Dispute
            </button>
          </div>
        </div>

        {/* ── RIGHT: WHITEBOARD & IN-CALL CHAT (5 cols) ── */}
        <div className="lg:col-span-5 bg-white border-2 border-[#111111] flex flex-col h-[520px]">

          {/* Panel Selector Tabs */}
          <div className="flex border-b border-[#111111]">
            <button
              onClick={() => setActiveTabPanel('whiteboard')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
                activeTabPanel === 'whiteboard'
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#f5f5f5] text-[#707072] hover:text-[#111111]'
              }`}
            >
              Interactive Notes & Board
            </button>
            <button
              onClick={() => setActiveTabPanel('chat')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
                activeTabPanel === 'chat'
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#f5f5f5] text-[#707072] hover:text-[#111111]'
              }`}
            >
              In-Session Chat ({inSessionMessages.length})
            </button>
          </div>

          {/* ── WHITEBOARD VIEW ── */}
          {activeTabPanel === 'whiteboard' ? (
            <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">Shared Workspace Sticky Notes</span>
                  <button
                    onClick={clearWhiteboard}
                    className="text-[11px] text-[#d30005] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>

                {/* Sticky Notes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                  {whiteboardElements.map(el => (
                    <div
                      key={el.id}
                      className="p-3 bg-[#fef08a] text-[#111111] border border-amber-300 shadow-sm text-xs space-y-1"
                    >
                      <div className="text-[10px] font-mono text-[#707072]">{el.authorId === currentUser?.id ? 'You' : 'Peer'}:</div>
                      <div className="font-medium whitespace-pre-wrap">{el.text}</div>
                    </div>
                  ))}
                  {whiteboardElements.length === 0 && (
                    <div className="col-span-2 p-6 text-center text-xs text-[#707072] italic border border-dashed border-[#cacacb]">
                      No sticky notes yet. Type a note or code snippet below to share with your peer!
                    </div>
                  )}
                </div>
              </div>

              {/* Add Note Input */}
              <div className="space-y-2 border-t border-[#e5e5e5] pt-3">
                <textarea
                  value={stickyText}
                  onChange={e => setStickyText(e.target.value)}
                  placeholder="Type notes, algorithm steps, or key takeaways..."
                  rows={2}
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none focus:bg-white focus:border-[#111111]"
                />
                <button
                  onClick={handleAddSticky}
                  className="w-full btn-primary !py-2 text-xs font-bold uppercase tracking-wider justify-center"
                >
                  Post to Whiteboard
                </button>
              </div>
            </div>
          ) : (
            /* ── IN-SESSION CHAT VIEW ── */
            <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {inSessionMessages.length === 0 ? (
                  <p className="text-xs text-[#707072] text-center py-12">No chat messages yet.</p>
                ) : (
                  inSessionMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-lg text-xs ${
                        msg.senderId === currentUser?.id
                          ? 'bg-[#111111] text-white ml-6'
                          : 'bg-[#f5f5f5] text-[#111111] mr-6 border border-[#e5e5e5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-70 mb-0.5">
                        <span>{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      {msg.type === 'code' ? (
                        <pre className="p-2 bg-black/20 rounded font-mono text-[11px] overflow-x-auto">{msg.text}</pre>
                      ) : (
                        <div>{msg.text}</div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#e5e5e5] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message to your peer..."
                  className="flex-1 bg-[#f5f5f5] text-xs px-3 py-2 rounded-lg border border-[#e5e5e5] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsCodeMode(!isCodeMode)}
                  className={`p-2 rounded-lg border ${isCodeMode ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#707072]'}`}
                  title="Code snippet mode"
                >
                  <Code2 className="w-4 h-4" />
                </button>
                <button type="submit" className="btn-primary !p-2">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* ── MODAL: COMPLETE SESSION & ESCROW RELEASE ── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111]">
              COMPLETE SESSION & RELEASE ESCROW
            </h2>
            <p className="text-xs text-[#4b4b4d]">
              Rate your peer mentor and confirm completion. <strong>{pointsStake} SkillPoints</strong> will be transferred from escrow to the peer tutor!
            </p>

            <form onSubmit={handleConfirmEndSession} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Peer Rating (1 to 5 Stars):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setRating(st)}
                      className={`text-xl ${rating >= st ? 'text-amber-400' : 'text-[#cacacb]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Feedback & Review:
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Share how this session helped your learning..."
                  rows={3}
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="btn-secondary !py-2 flex-1 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-2 flex-1 text-xs font-bold uppercase justify-center"
                >
                  Confirm & Release Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DISPUTE ESCROW ── */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#d30005] p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#d30005]">
              LOG CAMPUS SESSION DISPUTE
            </h2>
            <p className="text-xs text-[#4b4b4d]">
              Freezes escrow SkillPoints payout pending faculty review if a peer did not show up or violated standards.
            </p>

            <form onSubmit={handleConfirmDispute} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Reason</label>
                <input
                  type="text"
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder="e.g. Peer did not attend scheduled time"
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#111111] mb-1">Evidence / Details</label>
                <textarea
                  value={disputeEvidence}
                  onChange={e => setDisputeEvidence(e.target.value)}
                  placeholder="Explain what occurred..."
                  rows={3}
                  className="w-full bg-[#f5f5f5] text-xs p-2.5 rounded-lg border border-[#e5e5e5] outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="btn-secondary !py-2 flex-1 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#d30005] text-white py-2 px-4 rounded-full text-xs font-bold uppercase flex-1"
                >
                  Freeze & Log Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
