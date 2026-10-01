import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DashboardView } from './components/dashboard/DashboardView';
import { TeacherDiscoveryView } from './components/search/TeacherDiscoveryView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { ResumeBuilderView } from './components/resume/ResumeBuilderView';
import { SkillManagerView } from './components/skills/SkillManagerView';
import { LiveSessionRoom } from './components/sessions/LiveSessionRoom';
import { WorkshopView } from './components/sessions/WorkshopView';
import { RequestsAndNegotiationView } from './components/sessions/RequestsAndNegotiationView';
import { MessagingView } from './components/messages/MessagingView';
import { CalendarAvailabilityView } from './components/calendar/CalendarAvailabilityView';
import { StudyTrackerView } from './components/study/StudyTrackerView';
import { GoalsView } from './components/goals/GoalsView';
import { WalletView } from './components/wallet/WalletView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { InsightsView } from './components/insights/InsightsView';
import { AdminConsoleView } from './components/admin/AdminConsoleView';
import { DepartmentAnalyticsView } from './components/admin/DepartmentAnalyticsView';
import { AuthModal } from './components/auth/AuthModal';

const renderView = (tab: string) => {
  switch (tab) {
    case 'dashboard':      return <DashboardView />;
    case 'search':         return <TeacherDiscoveryView />;
    case 'portfolio':      return <PortfolioView />;
    case 'resume':         return <ResumeBuilderView />;
    case 'skills':         return <SkillManagerView />;
    case 'live_room':      return <LiveSessionRoom />;
    case 'workshops':      return <WorkshopView />;
    case 'requests':       return <RequestsAndNegotiationView />;
    case 'messages':       return <MessagingView />;
    case 'calendar':       return <CalendarAvailabilityView />;
    case 'study_tracker':  return <StudyTrackerView />;
    case 'goals':          return <GoalsView />;
    case 'wallet':         return <WalletView />;
    case 'leaderboard':    return <LeaderboardView />;
    case 'insights':       return <InsightsView />;
    case 'admin':          return <AdminConsoleView />;
    case 'dept_analytics': return <DepartmentAnalyticsView />;
    default:               return <DashboardView />;
  }
};

export const App: React.FC = () => {
  const { currentTab, isLoggedIn, isAuthModalOpen, setIsAuthModalOpen } = useApp();

  /* ── Auth Gate: show auth modal over clean landing if not logged in ── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-between">
        <div className="p-6 flex items-center justify-between border-b border-[#39393b]">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SkillSwap" className="w-8 h-8 object-contain invert" />
            <span className="font-display text-2xl uppercase tracking-wider">SKILLSWAP</span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-outline-on-image text-xs"
          >
            Sign In / Register
          </button>
        </div>

        <div className="max-w-3xl mx-auto text-center px-6 py-16 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9e9ea0]">CAMPUS PEER EXCHANGE</span>
          <h1 className="font-display text-5xl sm:text-7xl uppercase text-white leading-none">
            LEARN FROM PEERS.<br />
            BUILD REAL EXPERTISE.
          </h1>
          <p className="text-sm text-[#cacacb] max-w-lg mx-auto">
            A peer-to-peer campus skill exchange platform. Connect directly with students to trade skills, video call, and earn verified tokens.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-outline-on-image text-sm font-bold uppercase tracking-wider py-3.5 px-8"
            >
              Get Started with 50 Tokens →
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-[#39393b] text-center text-xs text-[#707072] font-mono">
          DESIGN-AKTC EDITORIAL SYSTEM · UNIVERSITY CAMPUS NETWORK
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={true} onClose={() => setIsAuthModalOpen(false)} initialMode="register" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      {/* Sticky header */}
      <Navbar />

      {/* Main canvas */}
      <main className="flex-1 w-full">
        {renderView(currentTab)}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth modal (for switching/re-auth) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode="login"
        />
      )}
    </div>
  );
};
