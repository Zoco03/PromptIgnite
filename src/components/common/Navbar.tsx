import React, { useState } from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  Search, Bell, Video, BookOpen, User, Wallet, 
  Flame, BarChart3, ShieldCheck, Menu, X, ArrowUpRight, CheckCircle2, MessageSquare
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    currentUser, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    markNotificationRead,
    clearAllNotifications,
    setViewedUserId,
    liveSessions,
    sessionRequests,
    conversations
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const pendingRequestsCount = sessionRequests.filter(r => 
    (currentUser.id === r.teacherId && r.status === 'pending_teacher') ||
    (currentUser.id === r.learnerId && r.status === 'pending_learner_counter')
  ).length;

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navLinks: { id: NavigationTab; label: string; badge?: number }[] = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'search', label: 'DISCOVER TEACHERS' },
    { id: 'workshops', label: 'WORKSHOPS' },
    { id: 'skills', label: 'MY SKILLS & QUIZ' },
    { id: 'requests', label: 'REQUESTS & ESCROW', badge: pendingRequestsCount },
    { id: 'messages', label: 'MESSAGES', badge: totalUnreadMessages },
    { id: 'study_tracker', label: 'FOCUS TIMER' },
    { id: 'goals', label: 'GOALS' },
    { id: 'wallet', label: 'WALLET LEDGER' },
    { id: 'leaderboard', label: 'CAMPUS RANK' },
    ...(currentUser.role === 'admin' ? [
      { id: 'admin' as NavigationTab, label: 'ADMIN CONSOLE' },
      { id: 'dept_analytics' as NavigationTab, label: 'SKILL GAP ANALYTICS' }
    ] : [
      { id: 'dept_analytics' as NavigationTab, label: 'SKILL GAPS' }
    ])
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentTab('search');
  };

  const handleOpenMyPortfolio = () => {
    setViewedUserId(currentUser.id);
    setCurrentTab('portfolio');
  };

  return (
    <header className="sticky top-0 z-40 bg-canvas border-b border-hairline-soft">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden btn-icon-circular"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 bg-ink rounded-full flex items-center justify-center text-on-primary font-display text-2xl tracking-tighter shadow-xs group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <span className="font-display text-2xl tracking-tight leading-none text-ink block">
                SKILLSWAP
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-mute uppercase block">
                CAMPUS TOKEN ECONOMY
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Primary Navigation */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {navLinks.slice(0, 8).map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`relative px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors whitespace-nowrap ${
                  isActive ? 'text-ink' : 'text-mute hover:text-ink'
                }`}
              >
                {link.label}
                {link.badge && link.badge > 0 ? (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-sale text-on-primary text-[10px] font-bold rounded-full">
                    {link.badge}
                  </span>
                ) : null}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-ink rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Cluster: Search, Live Room Quick Join, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Search Pill Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-44 lg:w-56">
            <Search className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search skills, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-pill-input w-full text-xs"
            />
          </form>

          {/* Quick Live Room Join Button (PRD 3.7) */}
          <button 
            onClick={() => setCurrentTab('live_room')}
            className="flex items-center gap-1.5 bg-ink text-on-primary text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-charcoal active:scale-95 transition-all shadow-xs"
            title="Open Live WebRTC Interactive Session Room"
          >
            <span className="w-2 h-2 rounded-full bg-sale animate-ping"></span>
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LIVE ROOM</span>
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="btn-icon-circular relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-ink" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-sale rounded-full ring-2 ring-canvas" />
              )}
            </button>

            {/* Notifications Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-canvas border border-hairline rounded-none shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-hairline">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-ink uppercase tracking-tight">Notifications</h4>
                    {unreadNotifCount > 0 && (
                      <span className="px-2 py-0.5 bg-soft-cloud text-ink text-[11px] font-medium rounded-full">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-[11px] text-mute hover:text-ink font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-hairline-soft py-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-mute">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`py-3 px-1 transition-colors cursor-pointer ${n.isRead ? 'opacity-70' : 'bg-soft-cloud/50'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-ink leading-snug">{n.title}</p>
                          <span className="text-[10px] text-mute whitespace-nowrap">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal mt-1 leading-normal">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User Avatar / Portfolio Button */}
          <button
            onClick={handleOpenMyPortfolio}
            className="flex items-center gap-2 pl-1 group"
            title="View Automated Public Portfolio (PRD 3.4)"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-ink/10 group-hover:ring-ink transition-all"
              />
              {currentUser.isVerifiedStudent && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-ink text-on-primary rounded-full flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-semibold text-ink block leading-none truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-medium text-mute block mt-0.5">
                {currentUser.karma} Karma
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-canvas border-b border-hairline px-4 py-4 space-y-2 animate-in slide-in-from-top-4">
          <div className="pb-3 mb-2 border-b border-hairline-soft">
            <input
              type="text"
              placeholder="Search skills, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-pill-input w-full text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-full text-xs font-semibold tracking-tight ${
                  currentTab === link.id ? 'bg-ink text-on-primary' : 'bg-soft-cloud text-ink'
                }`}
              >
                {link.label}
                {link.badge ? ` (${link.badge})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
