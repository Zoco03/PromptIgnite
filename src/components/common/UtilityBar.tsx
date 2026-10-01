import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, UserCheck, LogOut, LogIn } from 'lucide-react';

export const UtilityBar: React.FC = () => {
  const {
    currentUser,
    setCurrentTab,
    setViewedUserId,
    isLoggedIn,
    setIsAuthModalOpen,
    logoutUser,
  } = useApp();

  return (
    <div className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs font-medium">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between">

        {/* Left: Status */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SkillSwap Campus Network
          </span>
          <span className="text-slate-700 hidden md:inline">·</span>
          <span className="text-slate-500 hidden md:inline">1 hr teaching ≈ 15–20 ⚡ tokens</span>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Token balance */}
              <button
                onClick={() => setCurrentTab('wallet')}
                className="flex items-center gap-1.5 text-white font-semibold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
              >
                <Zap className="w-3 h-3 text-indigo-400" fill="currentColor" />
                <span>{currentUser.walletBalance} ⚡</span>
              </button>

              {/* My Portfolio shortcut */}
              <button
                onClick={() => { setViewedUserId(currentUser.id); setCurrentTab('portfolio'); }}
                className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>My Portfolio</span>
              </button>

              {/* Sign out */}
              <button
                onClick={logoutUser}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors font-semibold"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-full font-bold transition-all"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
