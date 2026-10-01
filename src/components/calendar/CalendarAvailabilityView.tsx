import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, Clock, Plus, Check, 
  Download, ArrowRight, Video, Users 
} from 'lucide-react';
import { PromoBadge } from '../common/Badge';

export const CalendarAvailabilityView: React.FC = () => {
  const { 
    currentUser, 
    liveSessions, 
    workshops, 
    setCurrentTab, 
    setActiveLiveSessionId 
  } = useApp();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Simulated availability state (Day index -> Set of active slot strings)
  const [availability, setAvailability] = useState<Record<number, string[]>>({
    0: ['16:00', '17:00'], // Mon
    2: ['15:00', '16:00', '17:00'], // Wed
    4: ['17:00', '18:00'], // Fri
    5: ['10:00', '11:00', '12:00']  // Sat
  });

  const toggleSlot = (dayIdx: number, slot: string) => {
    setAvailability(prev => {
      const current = prev[dayIdx] || [];
      const exists = current.includes(slot);
      const updated = exists ? current.filter(s => s !== slot) : [...current, slot];
      return { ...prev, [dayIdx]: updated };
    });
  };

  const handleExportICS = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SkillSwap Campus P2P//EN\nSUMMARY:SkillSwap Peer Learning Sessions\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'skillswap-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>SCHEDULE & SLOTS COORDINATION (PRD 3.9)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            CALENDAR & AVAILABILITY GRID
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Toggle your recurring weekly free slots for peer bookings, view confirmed 1:1 sessions, and export your timetable to Google Calendar / Apple iCal (.ics).
          </p>
        </div>

        <button
          onClick={handleExportICS}
          className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          title="Download .ics calendar sync file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>SYNC / EXPORT .ICS</span>
        </button>
      </div>

      {/* 1. WEEKLY AVAILABILITY MATRIX */}
      <div className="bg-canvas border border-hairline p-6 overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
          <h3 className="font-display text-2xl text-ink uppercase tracking-tight">
            WEEKLY RECURRING FREE HOURS (CLICK CELLS TO TOGGLE FREE/BUSY)
          </h3>
          <div className="flex items-center gap-4 text-xs font-semibold text-mute">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-ink rounded-none"></span>
              <span className="text-ink">Open for 1:1 Booking</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-soft-cloud border border-hairline rounded-none"></span>
              <span>Unavailable</span>
            </span>
          </div>
        </div>

        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-2 border border-hairline-soft text-[10px] font-bold uppercase text-mute bg-soft-cloud w-20">Time</th>
              {days.map((day, idx) => (
                <th key={day} className="p-2 border border-hairline-soft text-center text-xs font-bold uppercase text-ink bg-soft-cloud">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td className="p-2 border border-hairline-soft font-mono text-xs text-mute font-bold bg-soft-cloud/50">
                  {time}
                </td>
                {days.map((day, dayIdx) => {
                  const isAvailable = (availability[dayIdx] || []).includes(time);

                  // Check if a live session exists on Friday 17:00
                  const isConfirmedSession = dayIdx === 4 && time === '17:00';

                  return (
                    <td
                      key={dayIdx}
                      onClick={() => !isConfirmedSession && toggleSlot(dayIdx, time)}
                      className={`p-2 border border-hairline-soft text-center text-xs transition-all cursor-pointer select-none ${
                        isConfirmedSession 
                          ? 'bg-sale text-on-primary font-bold cursor-default' 
                          : isAvailable 
                            ? 'bg-ink text-on-primary font-semibold' 
                            : 'bg-canvas hover:bg-soft-cloud text-mute'
                      }`}
                    >
                      {isConfirmedSession ? (
                        <div className="text-[10px] uppercase">
                          ★ 1:1 Booked
                        </div>
                      ) : isAvailable ? (
                        <span className="text-[10px] tracking-wider uppercase">AVAILABLE</span>
                      ) : (
                        <span className="text-hairline">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. UPCOMING CONFIRMED BOOKINGS LIST */}
      <section className="space-y-4">
        <h3 className="font-display text-2xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
          CONFIRMED SESSIONS & UPCOMING WORKSHOPS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveSessions.map(session => (
            <div key={session.id} className="bg-canvas border border-ink p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-hairline-soft">
                  <span className="px-2 py-0.5 bg-ink text-on-primary text-[10px] font-bold rounded-full uppercase">
                    1:1 Live Session Confirmed
                  </span>
                  <span className="text-xs font-bold text-success">
                    🔒 {session.tokenAmount} ⚡ in Escrow
                  </span>
                </div>

                <h4 className="font-display text-2xl text-ink uppercase tracking-tight mt-3">
                  {session.topic}
                </h4>

                <p className="text-xs text-mute mt-1">
                  Skill: {session.skillName} • With {session.teacherName}
                </p>

                <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center gap-4 text-xs font-semibold text-ink">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-mute" />
                    <span>Friday, Oct 2, 2026</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-mute" />
                    <span>17:00 - 18:00 IST</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between">
                <span className="text-[11px] text-mute font-medium">Join window opens 5m before slot</span>
                <button
                  onClick={() => {
                    setActiveLiveSessionId(session.id);
                    setCurrentTab('live_room');
                  }}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>JOIN LIVE ROOM</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
