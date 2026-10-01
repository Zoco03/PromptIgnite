import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, Pause, RotateCcw, Clock, BookOpen, 
  BarChart2, CheckCircle2, Zap, ArrowRight 
} from 'lucide-react';
import { PromoBadge } from '../common/Badge';

export const StudyTrackerView: React.FC = () => {
  const { 
    currentUser, 
    skills, 
    studyLogs, 
    logStudySession 
  } = useApp();

  // Pomodoro timer state
  const [selectedSkill, setSelectedSkill] = useState(skills[0]?.name || 'AI & Machine Learning (PyTorch & Transformers)');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Clock tick
  useEffect(() => {
    let timer: any;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      // Auto log completed pomodoro
      logStudySession(selectedSkill, durationMinutes, 'self_pomodoro', sessionNotes || 'Focused Pomodoro sprint');
      alert(`🎉 Pomodoro completed! Logged ${durationMinutes} mins to ${selectedSkill}.`);
      setSecondsRemaining(durationMinutes * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining, durationMinutes, selectedSkill, sessionNotes, logStudySession]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(durationMinutes * 60);
  };

  const handleModeChange = (newMode: 'focus' | 'break', mins: number) => {
    setMode(newMode);
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsRunning(false);
  };

  const userLogs = studyLogs.filter(l => l.userId === currentUser.id);
  const totalLearnedMins = userLogs.filter(l => l.type === 'session_learned' || l.type === 'self_pomodoro').reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalTaughtMins = userLogs.filter(l => l.type === 'session_taught').reduce((acc, l) => acc + l.durationMinutes, 0);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
          <span>LEARNING VELOCITY & FOCUS SPRINT (PRD 3.10)</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
          PERSONAL STUDY TRACKER & POMODORO
        </h1>
        <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
          Track deep self-study sprints tagged to university skills, auto-log live tutoring sessions, and monitor your ratio of hours learned vs taught.
        </p>
      </div>

      {/* Main Grid: Left Pomodoro Timer + Right Study Stats & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: ATHLETIC EDITORIAL POMODORO CLOCK (5 cols) */}
        <div className="lg:col-span-5 bg-ink text-on-primary p-8 flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-canvas/20">
              <span className="text-xs font-bold tracking-wider uppercase text-hairline">
                FOCUS INTERVAL SPRINT
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleModeChange('focus', 25)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-full transition-colors ${
                    mode === 'focus' ? 'bg-canvas text-ink' : 'text-hairline hover:text-on-primary'
                  }`}
                >
                  25m Focus
                </button>
                <button
                  onClick={() => handleModeChange('break', 5)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-full transition-colors ${
                    mode === 'break' ? 'bg-canvas text-ink' : 'text-hairline hover:text-on-primary'
                  }`}
                >
                  5m Break
                </button>
              </div>
            </div>

            {/* Skill selector */}
            <div className="mt-6">
              <label className="text-[10px] font-bold uppercase text-hairline tracking-wider block mb-1">
                Tagged Skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-canvas/10 border border-canvas/20 text-on-primary text-xs font-semibold px-3 py-2 rounded-none focus:outline-none"
              >
                {skills.map(s => (
                  <option key={s.id} value={s.name} className="text-ink">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Giant Display Digits (Bebas Neue) */}
            <div className="py-12 text-center">
              <div className="font-display text-8xl sm:text-9xl text-on-primary leading-none tracking-tight">
                {formatTimer(secondsRemaining)}
              </div>
              <div className="text-xs font-bold text-hairline uppercase tracking-widest mt-2">
                {isRunning ? 'Sprint In Progress' : 'Paused / Ready to Launch'}
              </div>
            </div>

            {/* Session Notes input */}
            <div>
              <input
                type="text"
                placeholder="What are you focusing on this sprint? (e.g. Reading LoRA paper)"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-canvas/10 border border-canvas/20 text-on-primary placeholder:text-stone text-xs px-3.5 py-2.5 rounded-none focus:outline-none"
              />
            </div>
          </div>

          {/* Timer Controls */}
          <div className="pt-8 border-t border-canvas/20 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="btn-secondary !bg-canvas/10 !text-on-primary border border-canvas/20 text-xs py-3 px-5 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>

            <button
              onClick={handleStartPause}
              className="btn-outline-image text-xs py-3.5 px-8 flex-1 flex items-center justify-center gap-2"
            >
              {isRunning ? <Pause className="w-4 h-4 fill-ink" /> : <Play className="w-4 h-4 fill-ink" />}
              <span>{isRunning ? 'PAUSE SPRINT' : 'START 25-MIN SPRINT'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT: HOURS LEARNED VS TAUGHT & STUDY LOG MATRIX (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Comparison Bar Card */}
          <div className="bg-canvas border border-hairline p-6">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="font-display text-2xl text-ink uppercase tracking-tight">
                  LEARNING VS TEACHING RATIO
                </h3>
                <p className="text-xs text-mute">Campus balance guideline: 1 hr taught = 1–2 hrs learned</p>
              </div>
              <div className="text-xs font-bold text-ink">
                Total: {((totalLearnedMins + totalTaughtMins) / 60).toFixed(1)} hrs logged
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-soft-cloud p-4 border border-hairline">
                <span className="text-[10px] font-bold uppercase text-mute">Hours Learned</span>
                <div className="font-display text-4xl text-ink mt-1">{(totalLearnedMins / 60).toFixed(1)} hrs</div>
                <div className="text-[11px] text-mute">{userLogs.filter(l => l.type !== 'session_taught').length} study sprints</div>
              </div>

              <div className="bg-soft-cloud p-4 border border-hairline">
                <span className="text-[10px] font-bold uppercase text-mute">Hours Taught</span>
                <div className="font-display text-4xl text-ink mt-1">{(totalTaughtMins / 60).toFixed(1)} hrs</div>
                <div className="text-[11px] text-success font-semibold">Earned {currentUser.walletBalance} ⚡ tokens</div>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-mute mb-1.5">
                <span>Ratio Breakdown</span>
                <span>
                  {Math.round((totalLearnedMins / (totalLearnedMins + totalTaughtMins || 1)) * 100)}% Learning • {Math.round((totalTaughtMins / (totalLearnedMins + totalTaughtMins || 1)) * 100)}% Teaching
                </span>
              </div>
              <div className="w-full bg-soft-cloud h-3 rounded-full overflow-hidden flex">
                <div 
                  className="bg-ink h-full transition-all"
                  style={{ width: `${(totalLearnedMins / (totalLearnedMins + totalTaughtMins || 1)) * 100}%` }}
                />
                <div 
                  className="bg-success h-full transition-all"
                  style={{ width: `${(totalTaughtMins / (totalLearnedMins + totalTaughtMins || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Study Log Feed */}
          <div className="bg-canvas border border-hairline p-6">
            <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
              RECENT STUDY & SESSION ENTRIES
            </h3>

            <div className="divide-y divide-hairline-soft mt-2">
              {userLogs.map(log => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-soft-cloud flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-ink">
                      {log.type === 'session_taught' ? '🎓' : log.type === 'session_learned' ? '📚' : '⚡'}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-ink">{log.skillName}</h4>
                      {log.notes && <p className="text-[11px] text-mute">{log.notes}</p>}
                      <span className="text-[10px] text-stone">{log.date} • {log.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display text-2xl text-ink leading-none">
                      {log.durationMinutes}
                    </span>
                    <span className="text-[10px] font-bold text-mute uppercase ml-1">mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
