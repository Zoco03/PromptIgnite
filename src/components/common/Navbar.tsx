import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  Search, Bell, Video, BookOpen, Wallet,
  Menu, X, CheckCircle2, MessageSquare, LogOut,
  UserCheck, Award, FileText, Sparkles, UserPlus, LogIn,
  Zap, Camera, ChevronDown, Trophy, ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    allUsers,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setViewedUserId,
    sessionRequests,
    conversations,
    isLoggedIn,
    setIsAuthModalOpen,
    logoutUser,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen]       = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen]     = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;
  const pendingReqs  = sessionRequests.filter(r =>
    (r.teacherId === currentUser?.id && r.status === 'pending_teacher') ||
    (r.learnerId === currentUser?.id && r.status === 'pending_learner_counter')
  ).length;
  const unreadMsgs   = conversations.reduce((a, c) => a + (c.unreadCount || 0), 0);

  // Core Primary Nav Links
  const PRIMARY_NAV: { id: NavigationTab; label: string; badge?: number }[] = [
    { id: 'dashboard',      label: 'EXPLORE' },
    { id: 'search',         label: 'PEER MENTORS' },
    { id: 'study_tracker',  label: 'AI FOCUS' },
    { id: 'live_room',      label: 'LIVE VC' },
    { id: 'messages',       label: 'CHAT', badge: unreadMsgs },
    { id: 'resume',         label: 'RESUME' },
  ];

  // Secondary Tools in "More" Menu
  const SECONDARY_NAV: { id: NavigationTab; label: string; icon: any; badge?: number }[] = [
    { id: 'portfolio',    label: 'My Portfolio', icon: UserCheck },
    { id: 'skills',       label: 'Verify Skills (Quiz)', icon: ShieldCheck },
    { id: 'requests',     label: 'Session Requests', icon: MessageSquare, badge: pendingReqs },
    { id: 'wallet',       label: 'SkillPoints Ledger', icon: Zap },
    { id: 'leaderboard',  label: 'Leaderboard', icon: Trophy },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentTab('search');
  };

  const goPortfolio = () => {
    if (currentUser) setViewedUserId(currentUser.id);
    setCurrentTab('portfolio');
    setIsUserMenuOpen(false);
  };

  const currentPoints = currentUser?.skillpoints || currentUser?.tokens || currentUser?.walletBalance || 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5] select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── LEFT: BRAND LOGO LOCKUP ── */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden btn-icon-circular !w-9 !h-9"
            aria-label="Toggle navigation drawer"
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <img
              src="/logo.png"
              alt="SkillSwap Logo"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="font-display text-2xl tracking-widest text-[#111111] leading-none block">
                SKILLSWAP
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#707072] uppercase block">
                CAMPUS NETWORK
              </span>
            </div>
          </button>
        </div>

        {/* ── MIDDLE: CLEAN STREAMLINED NAVIGATION ── */}
        <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
          {PRIMARY_NAV.map(link => {
            const active = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`relative px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-[#39393b] hover:text-[#111111] hover:bg-[#f5f5f5]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && link.badge > 0 ? (
                  <span className="bg-[#d30005] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1 ${
                SECONDARY_NAV.some(n => n.id === currentTab)
                  ? 'bg-[#111111] text-white'
                  : 'text-[#39393b] hover:text-[#111111] hover:bg-[#f5f5f5]'
              }`}
            >
              <span>MORE</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-[#111111] shadow-2xl z-50 p-2 space-y-1">
                {SECONDARY_NAV.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'portfolio' && currentUser) setViewedUserId(currentUser.id);
                        setCurrentTab(item.id);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded flex items-center justify-between ${
                        currentTab === item.id ? 'bg-[#111111] text-white' : 'hover:bg-[#f5f5f5] text-[#111111]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-[#d30005] text-white text-[9px] px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* ── RIGHT: SEARCH + LIVE VC + SKILLPOINTS + NOTIF + USER ── */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Search Pill */}
          <form onSubmit={handleSearch} className="relative hidden xl:block">
            <Search className="w-3.5 h-3.5 text-[#707072] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search peer skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-pill w-32 xl:w-36 text-xs !py-1 !pl-8"
            />
          </form>

          {/* Live VC Button */}
          <button
            onClick={() => setCurrentTab('live_room')}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all ${
              currentTab === 'live_room'
                ? 'bg-[#d30005] text-white'
                : 'bg-[#111111] text-white hover:bg-[#262626]'
            }`}
            title="Join 1:1 Live Video Call"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <Video className="w-3.5 h-3.5" />
            <span className="text-[11px]">Live VC</span>
          </button>

          {/* SkillPoints Pill */}
          {currentUser && (
            <button
              onClick={() => setCurrentTab('wallet')}
              className="bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111111] border border-[#cacacb] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
              title="SkillPoints Balance"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-mono">{currentPoints}</span>
              <span className="hidden sm:inline text-[10px] text-[#707072] font-mono">SP</span>
            </button>
          )}

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserMenuOpen(false); }}
              className="btn-icon-circular !w-9 !h-9 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#111111]" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#d30005] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#111111] shadow-2xl z-50 p-4">
                <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-2 mb-3">
                  <span className="font-display text-lg uppercase tracking-wider text-[#111111]">NOTIFICATIONS</span>
                  {unreadNotifs > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-[#707072] hover:text-[#111111] underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#707072] text-center py-6">No notifications right now.</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded border text-xs cursor-pointer transition-colors ${
                          n.isRead ? 'bg-[#f5f5f5] border-transparent' : 'bg-white border-[#111111]'
                        }`}
                      >
                        <div className="font-semibold text-[#111111] mb-0.5">{n.title}</div>
                        <div className="text-[#4b4b4d] text-[11px] leading-relaxed">{n.message}</div>
                        <div className="text-[10px] text-[#707072] mt-1 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f5f5f5] transition-all border border-transparent hover:border-[#e5e5e5]"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#111111]"
                />
                <span className="hidden md:block text-xs font-bold text-[#111111] max-w-[80px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {/* User Dropdown (No switch active account) */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#111111] shadow-2xl z-50 p-4">
                  <div className="border-b border-[#e5e5e5] pb-3 mb-3">
                    <div className="font-bold text-sm text-[#111111]">{currentUser.name}</div>
                    <div className="text-xs text-[#707072] truncate">{currentUser.email}</div>
                    <div className="text-[11px] text-[#007d48] font-bold mt-1 flex items-center gap-1 font-mono">
                      <Zap className="w-3 h-3 fill-[#007d48]" />
                      <span>{currentPoints} SkillPoints (SP)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={goPortfolio}
                      className="w-full text-left text-xs p-2 rounded hover:bg-[#f5f5f5] font-semibold text-[#111111] flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      My Portfolio
                    </button>
                    <button
                      onClick={() => { setCurrentTab('resume'); setIsUserMenuOpen(false); }}
                      className="w-full text-left text-xs p-2 rounded hover:bg-[#f5f5f5] font-semibold text-[#111111] flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      AI Resume Builder
                    </button>
                    <button
                      onClick={() => { setIsAuthModalOpen(true); setIsUserMenuOpen(false); }}
                      className="w-full text-left text-xs p-2 rounded hover:bg-[#f5f5f5] font-semibold text-[#111111] flex items-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Create Account
                    </button>
                    <button
                      onClick={() => { logoutUser(); setIsUserMenuOpen(false); }}
                      className="w-full text-left text-xs p-2 rounded hover:bg-[#fef2f2] font-semibold text-[#d30005] flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-primary !py-1.5 !px-4 text-xs font-bold"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#e5e5e5] px-4 py-3 space-y-1">
          {[...PRIMARY_NAV, ...SECONDARY_NAV].map(link => (
            <button
              key={link.id}
              onClick={() => {
                if (link.id === 'portfolio' && currentUser) setViewedUserId(currentUser.id);
                setCurrentTab(link.id);
                setIsMobileOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full flex items-center justify-between ${
                currentTab === link.id
                  ? 'bg-[#111111] text-white'
                  : 'text-[#39393b] hover:bg-[#f5f5f5]'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && link.badge > 0 && (
                <span className="bg-[#d30005] text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
