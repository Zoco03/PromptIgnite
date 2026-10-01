import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentTab } = useApp();

  return (
    <footer className="bg-white border-t border-[#e5e5e5] mt-16 pt-12 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">

        {/* Brand & 4 Column Layout per DESIGN-AKTC spec */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">

          {/* Col 1: Platform & Vision */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="SkillSwap" className="w-6 h-6 object-contain" />
              <span className="font-display text-xl uppercase tracking-wider text-[#111111]">SKILLSWAP</span>
            </div>
            <ul className="space-y-2 text-xs text-[#707072] font-medium">
              <li><button onClick={() => setCurrentTab('search')} className="hover:text-[#111111]">Discover Peer Mentors</button></li>
              <li><button onClick={() => setCurrentTab('study_tracker')} className="hover:text-[#111111]">AI Camera Focus Monitor</button></li>
              <li><button onClick={() => setCurrentTab('resume')} className="hover:text-[#111111]">AI Resume Builder</button></li>
              <li><button onClick={() => setCurrentTab('skills')} className="hover:text-[#111111]">Skill Quizzes & Verification</button></li>
              <li><button onClick={() => setCurrentTab('portfolio')} className="hover:text-[#111111]">Student Portfolio</button></li>
            </ul>
          </div>

          {/* Col 2: Token Economy & Governance */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
              TOKEN ECONOMY
            </h4>
            <ul className="space-y-2 text-xs text-[#707072] font-medium">
              <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-[#111111]">Append-Only Token Ledger</button></li>
              <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-[#111111]">Escrow Safe Lock & Release</button></li>
              <li><button onClick={() => setCurrentTab('leaderboard')} className="hover:text-[#111111]">Tokens Leaderboard</button></li>
              <li><span className="text-[#9e9ea0]">Anti-Collusion Verification</span></li>
              <li><span className="text-[#9e9ea0]">Zero Real-Money Policy</span></li>
            </ul>
          </div>

          {/* Col 3: Live Video & Study */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
              LIVE SESSIONS & TOOLS
            </h4>
            <ul className="space-y-2 text-xs text-[#707072] font-medium">
              <li><button onClick={() => setCurrentTab('live_room')} className="hover:text-[#111111]">1:1 Video Call Room</button></li>
              <li><button onClick={() => setCurrentTab('messages')} className="hover:text-[#111111]">Direct Campus Chat</button></li>
              <li><button onClick={() => setCurrentTab('requests')} className="hover:text-[#111111]">Session Requests & Slots</button></li>
              <li><button onClick={() => setCurrentTab('study_tracker')} className="hover:text-[#111111]">Pomodoro Focus Timer</button></li>
            </ul>
          </div>

          {/* Col 4: Design Architecture */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
              DESIGN SPECIFICATION
            </h4>
            <ul className="space-y-2 text-xs text-[#707072] font-medium">
              <li><span className="text-[#111111]">DESIGN-AKTC High-Contrast System</span></li>
              <li><span className="text-[#111111]">Bebas Neue Display Typography</span></li>
              <li><span className="text-[#111111]">Pure #111111 Ink & #F5F5F5 Surface</span></li>
              <li><span className="text-[#111111]">Pill CTA Geometry (Rounded-Full)</span></li>
              <li><span className="text-[#111111]">Groq AI Vision & Recommendation Engine</span></li>
            </ul>
          </div>
        </div>

        {/* Fine Print Utility Bar */}
        <div className="pt-6 border-t border-[#e5e5e5] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#707072] font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111111]">SKILLSWAP CAMPUS P2P</span>
            <span>•</span>
            <span>Verified Student Learning Network</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 SkillSwap Platform. All rights reserved.</span>
            <span>Campus Honor Code</span>
            <span>Zero Pre-loaded Fake Users</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
