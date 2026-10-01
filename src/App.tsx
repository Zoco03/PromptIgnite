import React from 'react';
import { useApp } from './context/AppContext';
import { UtilityBar } from './components/common/UtilityBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DashboardView } from './components/dashboard/DashboardView';
import { TeacherDiscoveryView } from './components/search/TeacherDiscoveryView';
import { PortfolioView } from './components/portfolio/PortfolioView';
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

export const App: React.FC = () => {
  const { currentTab } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'search':
        return <TeacherDiscoveryView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'skills':
        return <SkillManagerView />;
      case 'live_room':
        return <LiveSessionRoom />;
      case 'workshops':
        return <WorkshopView />;
      case 'requests':
        return <RequestsAndNegotiationView />;
      case 'messages':
        return <MessagingView />;
      case 'calendar':
        return <CalendarAvailabilityView />;
      case 'study_tracker':
        return <StudyTrackerView />;
      case 'goals':
        return <GoalsView />;
      case 'wallet':
        return <WalletView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'insights':
        return <InsightsView />;
      case 'admin':
        return <AdminConsoleView />;
      case 'dept_analytics':
        return <DepartmentAnalyticsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-sans selection:bg-ink selection:text-on-primary">
      {/* Top 36px Utility Strip */}
      <UtilityBar />

      {/* Primary Sticky Header */}
      <Navbar />

      {/* Main Page Content Canvas */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pt-8">
        {renderActiveView()}
      </main>

      {/* 4-Column Minimal Footer */}
      <Footer />
    </div>
  );
};
