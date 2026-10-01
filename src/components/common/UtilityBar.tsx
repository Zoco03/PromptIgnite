import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, HelpCircle, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export const UtilityBar: React.FC = () => {
  const { currentUser, setCurrentUserById, allUsers, setCurrentTab } = useApp();

  return (
    <div className="bg-soft-cloud text-charcoal border-b border-hairline text-xs font-medium tracking-tight">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between">
        {/* Left status item */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-ink font-semibold">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            CAMPUS PEER EXCHANGE
          </span>
          <span className="text-hairline hidden md:inline">|</span>
          <span className="text-mute hidden md:inline">Token Ratio: 1 hr ≈ 15–20 ⚡ (Zero Real Money)</span>
        </div>

        {/* Right cluster: persona switcher & utility links */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentTab('wallet')}
            className="hidden sm:flex items-center gap-1 text-ink hover:text-charcoal font-medium bg-canvas px-2.5 py-0.5 rounded-full border border-hairline shadow-xs active:scale-95 transition-transform"
          >
            <Zap className="w-3.5 h-3.5 text-ink fill-ink" />
            <span>Balance: <strong className="font-semibold">{currentUser.walletBalance} ⚡</strong></span>
            {currentUser.escrowBalance > 0 && (
              <span className="text-mute text-[11px] ml-1">({currentUser.escrowBalance} in Escrow)</span>
            )}
          </button>

          {/* Quick Persona Switcher for pair testing all roles */}
          <div className="flex items-center gap-1.5 bg-canvas px-2 py-0.5 rounded-full border border-hairline">
            <Users className="w-3.5 h-3.5 text-mute" />
            <span className="text-[11px] text-mute uppercase font-semibold">Switch Persona:</span>
            <select 
              value={currentUser.id}
              onChange={(e) => setCurrentUserById(e.target.value)}
              className="bg-transparent text-ink font-semibold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'admin' ? 'Faculty Admin' : u.id === 'usr_meera' ? 'Top Teacher' : 'Learner'})
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setCurrentTab('insights')}
            className="hidden lg:flex items-center gap-1 text-mute hover:text-ink transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};
