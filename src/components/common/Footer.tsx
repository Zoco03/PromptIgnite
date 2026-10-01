import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentTab } = useApp();

  return (
    <footer className="bg-canvas border-t border-hairline mt-16 pt-12 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* 4 Column Layout per DESIGN-AKTC spec */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          {/* Col 1: Platform & Vision */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-ink mb-4">
              SkillSwap Platform
            </h4>
            <ul className="space-y-2 text-xs text-mute font-medium">
              <li><button onClick={() => setCurrentTab('search')} className="hover:text-ink">Discover Peer Teachers</button></li>
              <li><button onClick={() => setCurrentTab('workshops')} className="hover:text-ink">Group Workshops</button></li>
              <li><button onClick={() => setCurrentTab('skills')} className="hover:text-ink">Verification Challenges</button></li>
              <li><button onClick={() => setCurrentTab('portfolio')} className="hover:text-ink">Automated Portfolio</button></li>
              <li><button onClick={() => setCurrentTab('study_tracker')} className="hover:text-ink">Focus Pomodoro Timer</button></li>
            </ul>
          </div>

          {/* Col 2: Token Economy & Governance */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-ink mb-4">
              Token Economy
            </h4>
            <ul className="space-y-2 text-xs text-mute font-medium">
              <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-ink">Append-Only Ledger</button></li>
              <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-ink">Escrow Safeguards</button></li>
              <li><button onClick={() => setCurrentTab('leaderboard')} className="hover:text-ink">Karma Point Rules</button></li>
              <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-ink">Anti-Collusion Bounds</button></li>
              <li><span className="text-stone">Zero Real-Money Policy</span></li>
            </ul>
          </div>

          {/* Col 3: Campus & Faculty */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-ink mb-4">
              Campus & Faculty
            </h4>
            <ul className="space-y-2 text-xs text-mute font-medium">
              <li><button onClick={() => setCurrentTab('dept_analytics')} className="hover:text-ink">Department Skill Gap Index</button></li>
              <li><button onClick={() => setCurrentTab('insights')} className="hover:text-ink">Complementary Skill Graph</button></li>
              <li><button onClick={() => setCurrentTab('admin')} className="hover:text-ink">Certificate Verification Queue</button></li>
              <li><button onClick={() => setCurrentTab('admin')} className="hover:text-ink">Question Bank Authoring</button></li>
              <li><button onClick={() => setCurrentTab('admin')} className="hover:text-ink">Dispute Resolution Tribunal</button></li>
            </ul>
          </div>

          {/* Col 4: Design Architecture */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-ink mb-4">
              Design Architecture
            </h4>
            <ul className="space-y-2 text-xs text-mute font-medium">
              <li><span className="text-ink">Bebas Neue Display Lockup</span></li>
              <li><span className="text-ink">Pure #111111 Ink & #F5F5F5 Stage</span></li>
              <li><span className="text-ink">Pill Geometry (Rounded Full)</span></li>
              <li><span className="text-ink">Zero Drop Shadow Philosophy</span></li>
              <li><span className="text-ink">WCAG AAA Accessible Contrast</span></li>
            </ul>
          </div>
        </div>

        {/* Fine Print Utility Bar */}
        <div className="pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-mute font-medium">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">SKILLSWAP CAMPUS P2P v1.0</span>
            <span>•</span>
            <span>Domain-Verified Student Learning Network</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© 2026 SkillSwap Platform. Built for University Excellence.</span>
            <span>Terms & Honor Code</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
