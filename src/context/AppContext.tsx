import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, Skill, UserSkill, Certificate, SessionRequest, 
  LiveSession, Workshop, Conversation, Message, Transaction, 
  Goal, StudyLog, Notification, LeaderboardEntry, SkillGapData, 
  Dispute, Review, WhiteboardElement, InSessionMessage, CounterProposal, RequestStatus, SocialLinks
} from '../types';
import { 
  INITIAL_USERS, INITIAL_SKILLS, INITIAL_USER_SKILLS, 
  INITIAL_CERTIFICATES, INITIAL_REQUESTS, INITIAL_LIVE_SESSIONS, 
  INITIAL_WORKSHOPS, INITIAL_CONVERSATIONS, INITIAL_MESSAGES, 
  INITIAL_TRANSACTIONS, INITIAL_GOALS, INITIAL_STUDY_LOGS, 
  INITIAL_NOTIFICATIONS, INITIAL_SKILL_GAPS, 
  INITIAL_DISPUTES, INITIAL_REVIEWS 
} from '../data/mockData';

export type NavigationTab = 
  | 'dashboard'
  | 'search'
  | 'portfolio'
  | 'resume'
  | 'skills'
  | 'sessions'
  | 'live_room'
  | 'workshops'
  | 'requests'
  | 'calendar'
  | 'messages'
  | 'study_tracker'
  | 'goals'
  | 'wallet'
  | 'leaderboard'
  | 'insights'
  | 'admin'
  | 'dept_analytics';

interface AppContextType {
  // Auth & Session
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, password?: string) => boolean;
  registerUser: (userData: Partial<User> & { avatar?: string; socials?: SocialLinks }) => void;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Navigation & Active State
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  currentUser: User;
  setCurrentUserById: (userId: string) => void;
  allUsers: User[];
  
  // Public portfolio viewed user
  viewedUserId: string;
  setViewedUserId: (userId: string) => void;
  
  // Skills & Challenges
  skills: Skill[];
  userSkills: UserSkill[];
  activeQuizSkillId: string | null;
  setActiveQuizSkillId: (skillId: string | null) => void;
  submitQuizAttempt: (skillId: string, answers: Record<string, number>, targetLevel: 'Beginner' | 'Intermediate' | 'Advanced', pricePerHour: number, description: string) => { passed: boolean; score: number; total: number };
  addNewSkillOffering: (skillData: Partial<UserSkill>) => void;
  
  // Certificates
  certificates: Certificate[];
  uploadCertificate: (skillName: string, title: string, issuer: string, fileUrl: string, fileType?: 'image' | 'pdf') => void;
  adminReviewCertificate: (certId: string, status: 'Verified' | 'Rejected', reason?: string) => void;
  
  // Search & Discovery
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  rankingWeights: { quiz: number; rating: number; experience: number; karma: number; certs: number; response: number };
  setRankingWeights: (weights: any) => void;
  calculateTeacherRankingScore: (teacher: User, userSkill: UserSkill) => number;
  
  // Requests & Negotiation
  sessionRequests: SessionRequest[];
  createSessionRequest: (teacherId: string, skillId: string, topic: string, goal: string, date: string, time: string, tokenPrice: number, message: string) => boolean;
  acceptSessionRequest: (requestId: string) => void;
  rejectSessionRequest: (requestId: string, reason: string) => void;
  counterOfferRequest: (requestId: string, tokenPrice: number, proposedDate: string, proposedTime: string, note: string) => void;
  
  // Live Sessions
  liveSessions: LiveSession[];
  activeLiveSessionId: string | null;
  setActiveLiveSessionId: (id: string | null) => void;
  whiteboardElements: WhiteboardElement[];
  addWhiteboardElement: (elem: WhiteboardElement) => void;
  clearWhiteboard: () => void;
  inSessionMessages: InSessionMessage[];
  sendInSessionMessage: (sessionId: string, text: string, type?: 'text' | 'code' | 'file', codeLang?: string) => void;
  completeLiveSession: (sessionId: string, rating: number, feedback: string) => void;
  raiseLiveSessionDispute: (sessionId: string, reason: string, evidence: string) => void;
  
  // Workshops
  workshops: Workshop[];
  activeWorkshopId: string | null;
  setActiveWorkshopId: (id: string | null) => void;
  createWorkshop: (ws: Omit<Workshop, 'id' | 'teacherId' | 'teacherName' | 'teacherAvatar' | 'teacherDepartment' | 'enrolledCount' | 'status' | 'attendees' | 'qaItems'>) => void;
  enrollInWorkshop: (workshopId: string) => boolean;
  askWorkshopQA: (workshopId: string, question: string) => void;
  upvoteWorkshopQA: (workshopId: string, qaId: string) => void;
  toggleHandRaise: (workshopId: string) => void;
  
  // Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Message[];
  sendDirectMessage: (receiverId: string, text: string, attachmentUrl?: string) => void;
  
  // Wallet & Transactions
  transactions: Transaction[];
  grantStarterTokens: (userId: string, amount: number, reason: string) => void;
  
  // Study Tracker & Pomodoro / Camera Focus
  studyLogs: StudyLog[];
  logStudySession: (skillName: string, durationMinutes: number, type: 'self_pomodoro' | 'camera_focus' | 'session_learned' | 'session_taught', notes?: string, focusScore?: number, distractionCount?: number, tokensAwarded?: number) => void;
  
  // Goals & Milestones
  goals: Goal[];
  createGoal: (title: string, skillName: string, targetDate: string, milestones: string[]) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  
  // Leaderboard & Tokens
  leaderboard: LeaderboardEntry[];
  
  // Insights & Dept Gaps
  skillGaps: SkillGapData[];
  
  // Disputes & Admin
  disputes: Dispute[];
  resolveDispute: (disputeId: string, resolution: 'Resolved_Refund_Learner' | 'Resolved_Release_Teacher', note: string) => void;
  
  // Reviews
  reviews: Review[];
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (notifId: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Multi-tab sync BroadcastChannel
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('skillswap_sync_channel')
  : null;

const DEFAULT_GUEST_USER: User = {
  id: 'usr_guest',
  name: 'Student Guest',
  email: 'student@campus.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  year: '1st Year Undergraduate',
  bio: 'Campus student exploring peer learning.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  timezone: 'IST (UTC+5:30)',
  skillpoints: 50,
  tokens: 50,
  karma: 50,
  leaderboardRank: 1,
  walletBalance: 50,
  escrowBalance: 0,
  totalHoursTaught: 0,
  totalHoursLearned: 0,
  sessionsCompletedCount: 0,
  avgRating: 0.0,
  reviewCount: 0,
  isVerifiedStudent: true,
  joinedDate: '2026-01-01',
  badges: [
    {
      id: 'b_welcome',
      name: 'Campus Pioneer',
      icon: '🎓',
      description: 'Joined SkillSwap Campus Network',
      dateEarned: '2026-01-01',
      category: 'community'
    },
    {
      id: 'b_early',
      name: 'Early Adopter',
      icon: '⚡',
      description: 'First Semester Founding Member',
      dateEarned: '2026-01-01',
      category: 'community'
    }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('skillswap_logged_in') === 'true';
  });

  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out any mock accounts (e.g. u1, u2, u3, Meera Patel, Priya Verma, Rohan Gupta)
        const realUsers = parsed.filter((u: any) => 
          u.id.startsWith('usr_') && 
          u.name !== 'Meera Patel' && 
          u.name !== 'Priya Verma' && 
          u.name !== 'Rohan Gupta' &&
          u.name !== 'Alex Chen' &&
          u.name !== 'Sara Khan'
        );
        return realUsers;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('skillswap_current_user_id') || '';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return !isLoggedIn || !currentUserId;
  });

  const [viewedUserId, setViewedUserId] = useState<string>('');

  const currentUser: User = allUsers.find(u => u.id === currentUserId) || (allUsers.length > 0 ? allUsers[0] : DEFAULT_GUEST_USER);

  // Domain State with LocalStorage Persistence
  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_skills');
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  const [userSkills, setUserSkills] = useState<UserSkill[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_user_skills');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((s: any) => 
          s.userId.startsWith('usr_') && 
          !['u1','u2','u3','u4','u5','usr_1','usr_2','usr_3','usr_4','usr_5'].includes(s.userId)
        );
      }
      return INITIAL_USER_SKILLS;
    } catch {
      return INITIAL_USER_SKILLS;
    }
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_certificates');
      return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  });

  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_live_sessions');
      return saved ? JSON.parse(saved) : INITIAL_LIVE_SESSIONS;
    } catch {
      return INITIAL_LIVE_SESSIONS;
    }
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_workshops');
      return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
    } catch {
      return INITIAL_WORKSHOPS;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_goals');
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_study_logs');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_LOGS;
    } catch {
      return INITIAL_STUDY_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('skillswap_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [skillGaps] = useState<SkillGapData[]>(INITIAL_SKILL_GAPS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Search & Active Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rankingWeights, setRankingWeights] = useState({
    quiz: 0.25,
    rating: 0.25,
    experience: 0.20,
    karma: 0.15,
    certs: 0.10,
    response: 0.05
  });

  const [activeQuizSkillId, setActiveQuizSkillId] = useState<string | null>(null);
  const [activeLiveSessionId, setActiveLiveSessionId] = useState<string | null>(null);
  const [activeWorkshopId, setActiveWorkshopId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Interactive Live Session UI State
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [inSessionMessages, setInSessionMessages] = useState<InSessionMessage[]>([]);

  // Cross-tab broadcast dispatcher helper
  const broadcastUpdate = useCallback((type: string, payload?: any) => {
    if (syncChannel) {
      syncChannel.postMessage({ type, payload, timestamp: Date.now() });
    }
  }, []);

  // Listen for multi-tab sync events
  useEffect(() => {
    if (!syncChannel) return;
    const handleSync = (event: MessageEvent) => {
      const { type } = event.data;
      if (type === 'USERS_UPDATED' || type === 'FULL_SYNC') {
        const u = localStorage.getItem('skillswap_users');
        if (u) setAllUsers(JSON.parse(u));
        const us = localStorage.getItem('skillswap_user_skills');
        if (us) setUserSkills(JSON.parse(us));
        const req = localStorage.getItem('skillswap_requests');
        if (req) setSessionRequests(JSON.parse(req));
        const msg = localStorage.getItem('skillswap_messages');
        if (msg) setMessages(JSON.parse(msg));
        const conv = localStorage.getItem('skillswap_conversations');
        if (conv) setConversations(JSON.parse(conv));
        const live = localStorage.getItem('skillswap_live_sessions');
        if (live) setLiveSessions(JSON.parse(live));
        const cert = localStorage.getItem('skillswap_certificates');
        if (cert) setCertificates(JSON.parse(cert));
        const tx = localStorage.getItem('skillswap_transactions');
        if (tx) setTransactions(JSON.parse(tx));
        const st = localStorage.getItem('skillswap_study_logs');
        if (st) setStudyLogs(JSON.parse(st));
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, []);

  // Persist state to localStorage and broadcast
  useEffect(() => {
    localStorage.setItem('skillswap_users', JSON.stringify(allUsers));
    broadcastUpdate('USERS_UPDATED');
  }, [allUsers, broadcastUpdate]);

  useEffect(() => {
    localStorage.setItem('skillswap_user_skills', JSON.stringify(userSkills));
  }, [userSkills]);

  useEffect(() => {
    localStorage.setItem('skillswap_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('skillswap_requests', JSON.stringify(sessionRequests));
  }, [sessionRequests]);

  useEffect(() => {
    localStorage.setItem('skillswap_live_sessions', JSON.stringify(liveSessions));
  }, [liveSessions]);

  useEffect(() => {
    localStorage.setItem('skillswap_workshops', JSON.stringify(workshops));
  }, [workshops]);

  useEffect(() => {
    localStorage.setItem('skillswap_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('skillswap_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('skillswap_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('skillswap_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('skillswap_study_logs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('skillswap_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derive Dynamic Leaderboard from real users
  const leaderboard: LeaderboardEntry[] = allUsers
    .map((u) => {
      const topSk = userSkills.find(s => s.userId === u.id)?.skillName || 'General Skills';
      const verifiedCount = userSkills.filter(s => s.userId === u.id && s.isVerified).length;
      return {
        rank: 1,
        userId: u.id,
        userName: u.name,
        userAvatar: u.avatar,
        department: u.department,
        topSkill: topSk,
        tokens: u.tokens || u.walletBalance || 0,
        karma: u.tokens || u.walletBalance || 0,
        sessionsTaught: u.totalHoursTaught || 0,
        rating: u.avgRating ?? 0.0,
        verifiedSkillsCount: verifiedCount,
        change: 'same' as const
      };
    })
    .sort((a, b) => b.tokens - a.tokens)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  // Switch User Profile
  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem('skillswap_current_user_id', userId);
  };

  // Update User Profile (PFP, Bio, Socials, etc.)
  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          ...data,
          socials: {
            ...u.socials,
            ...(data.socials || {})
          }
        };
      }
      return u;
    }));
  };

  // Dynamic Teacher Ranking Score
  const calculateTeacherRankingScore = (teacher: User, userSkill: UserSkill): number => {
    const quizScore = userSkill.isVerified ? (userSkill.verificationScore || 90) : 0;
    const ratingScore = (userSkill.rating / 5) * 100;
    const expScore = Math.min(100, (userSkill.totalSessionsTaught * 10) + (userSkill.yearsExperience * 20));
    const tokenScore = Math.min(100, ((teacher.tokens || teacher.walletBalance || 0) / 1000) * 100);
    const hasCert = certificates.some(c => c.userId === teacher.id && c.skillName.toLowerCase().includes(userSkill.skillName.toLowerCase()) && c.status === 'Verified');
    const certScore = hasCert ? 100 : 30;
    const responseScore = teacher.badges.some(b => b.name === 'Fast Responder') ? 100 : 80;

    const finalScore = (
      (quizScore * rankingWeights.quiz) +
      (ratingScore * rankingWeights.rating) +
      (expScore * rankingWeights.experience) +
      (tokenScore * rankingWeights.karma) +
      (certScore * rankingWeights.certs) +
      (responseScore * rankingWeights.response)
    );

    return Math.round(finalScore);
  };

  // Submit Verification Quiz
  const submitQuizAttempt = (
    skillId: string, 
    answers: Record<string, number>, 
    targetLevel: 'Beginner' | 'Intermediate' | 'Advanced', 
    pricePerHour: number, 
    description: string
  ) => {
    if (!currentUser) return { passed: false, score: 0, total: 0 };
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return { passed: false, score: 0, total: 0 };

    let correctCount = 0;
    const total = skill.quizQuestions.length;

    skill.quizQuestions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 60; // 60% pass mark

    if (passed) {
      const existingIndex = userSkills.findIndex(us => us.userId === currentUser.id && us.skillId === skillId);
      const newSkillEntry: UserSkill = {
        id: `usk_${currentUser.id}_${skillId}_${Date.now()}`,
        userId: currentUser.id,
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        level: targetLevel,
        yearsExperience: 2,
        description: description || `Verified peer teacher in ${skill.name}.`,
        tokenPricePerHour: pricePerHour || 15,
        isVerified: true,
        verificationScore: percentage,
        verifiedAt: new Date().toISOString().split('T')[0],
        tags: skill.tags,
        totalSessionsTaught: 0,
        rating: 5.0
      };

      if (existingIndex >= 0) {
        setUserSkills(prev => {
          const updated = [...prev];
          updated[existingIndex] = newSkillEntry;
          return updated;
        });
      } else {
        setUserSkills(prev => [newSkillEntry, ...prev]);
      }

      // Award Tokens bonus
      setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            tokens: (u.tokens || 0) + 50,
            walletBalance: u.walletBalance + 50,
            badges: [
              ...u.badges,
              {
                id: `b_quiz_${Date.now()}`,
                name: `${skill.name.split(' ')[0]} Verified`,
                icon: '⚡',
                description: `Passed verification quiz with ${percentage}%`,
                dateEarned: new Date().toISOString().split('T')[0],
                category: 'teaching'
              }
            ]
          };
        }
        return u;
      }));

      // Log transaction
      setTransactions(prev => [
        {
          id: `tx_quiz_${Date.now()}`,
          userId: currentUser.id,
          type: 'TOKEN_BONUS',
          amount: 50,
          balanceAfter: currentUser.walletBalance + 50,
          description: `Skill Quiz Passed: ${skill.name} (+50 Tokens)`,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS'
        },
        ...prev
      ]);

      // Notification
      setNotifications(prev => [
        {
          id: `notif_quiz_${Date.now()}`,
          userId: currentUser.id,
          type: 'certificate_verified',
          title: `Verification Challenge Passed! (${percentage}%)`,
          message: `Your skill "${skill.name}" is now Verified with a public badge. +50 Tokens added!`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/skills'
        },
        ...prev
      ]);
    }

    return { passed, score: correctCount, total };
  };

  const addNewSkillOffering = (skillData: Partial<UserSkill>) => {
    if (!currentUser) return;
    const newEntry: UserSkill = {
      id: `usk_${currentUser.id}_${Date.now()}`,
      userId: currentUser.id,
      skillId: skillData.skillId || 'custom_skill',
      skillName: skillData.skillName || 'Custom Skill',
      category: skillData.category || 'Software & AI',
      level: skillData.level || 'Intermediate',
      yearsExperience: skillData.yearsExperience || 1,
      description: skillData.description || '',
      tokenPricePerHour: skillData.tokenPricePerHour || 15,
      isVerified: false,
      tags: skillData.tags || [],
      totalSessionsTaught: 0,
      rating: 5.0,
      certificateUrl: skillData.certificateUrl,
      certificateName: skillData.certificateName
    };
    setUserSkills(prev => [newEntry, ...prev]);
  };

  // Upload Certificate with image / base64 preview
  const uploadCertificate = (skillName: string, title: string, issuer: string, fileUrl: string, fileType: 'image' | 'pdf' = 'image') => {
    if (!currentUser) return;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      userId: currentUser.id,
      skillName,
      title,
      issuer,
      issueDate: new Date().toISOString().split('T')[0],
      fileUrl: fileUrl,
      fileType: fileType,
      status: 'Verified',
      reviewedBy: 'Groq AI Certificate Verifier',
      reviewedAt: new Date().toISOString().split('T')[0]
    };
    setCertificates(prev => [newCert, ...prev]);

    setUserSkills(prev => prev.map(us => {
      if (us.userId === currentUser.id && us.skillName.toLowerCase() === skillName.toLowerCase()) {
        return { ...us, isVerified: true, certificateUrl: fileUrl, certificateName: title };
      }
      return us;
    }));

    setNotifications(prev => [
      {
        id: `notif_cert_${Date.now()}`,
        userId: currentUser.id,
        type: 'certificate_verified',
        title: 'Certificate Verified & Approved!',
        message: `"${title}" has been verified. Your verified badge is now active on your portfolio!`,
        timestamp: new Date().toISOString(),
        isRead: false
      },
      ...prev
    ]);
  };

  const adminReviewCertificate = (certId: string, status: 'Verified' | 'Rejected', reason?: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status,
          reviewedBy: currentUser?.name || 'Faculty Admin',
          reviewedAt: new Date().toISOString().split('T')[0],
          rejectionReason: reason
        };
      }
      return c;
    }));
  };

  // Create Session Request
  const createSessionRequest = (
    teacherId: string, 
    skillId: string, 
    topic: string, 
    goal: string, 
    date: string, 
    time: string, 
    tokenPrice: number, 
    message: string
  ): boolean => {
    if (!currentUser) return false;
    const teacher = allUsers.find(u => u.id === teacherId);
    const skill = skills.find(s => s.id === skillId) || INITIAL_SKILLS[0];
    if (!teacher) return false;

    if (currentUser.walletBalance < tokenPrice) {
      alert(`Insufficient tokens! You need ${tokenPrice} tokens, but currently have ${currentUser.walletBalance}.`);
      return false;
    }

    const newRequest: SessionRequest = {
      id: `req_${Date.now()}`,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherAvatar: teacher.avatar,
      skillId: skill.id,
      skillName: skill.name,
      topic,
      goal,
      requestedDate: date,
      requestedTime: time,
      tokenPrice,
      status: 'pending_teacher',
      message,
      counterRounds: [],
      maxRounds: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSessionRequests(prev => [newRequest, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_req_${Date.now()}`,
        userId: teacher.id,
        type: 'request_received',
        title: `New Session Request from ${currentUser.name}`,
        message: `Topic: "${topic}" (${tokenPrice} tokens offered).`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: '/requests'
      },
      ...prev
    ]);

    return true;
  };

  // Accept Request
  const acceptSessionRequest = (requestId: string) => {
    const req = sessionRequests.find(r => r.id === requestId);
    if (!req) return;

    // Lock tokens in Escrow from Learner's wallet
    setAllUsers(prev => prev.map(u => {
      if (u.id === req.learnerId) {
        return {
          ...u,
          walletBalance: Math.max(0, u.walletBalance - req.tokenPrice),
          escrowBalance: u.escrowBalance + req.tokenPrice
        };
      }
      return u;
    }));

    // Record Escrow Hold transaction
    setTransactions(prev => [
      {
        id: `tx_escrow_${Date.now()}`,
        userId: req.learnerId,
        type: 'SESSION_ESCROW_HOLD',
        amount: -req.tokenPrice,
        balanceAfter: (currentUser?.id === req.learnerId ? (currentUser.walletBalance - req.tokenPrice) : 50),
        description: `Escrow Hold: 1:1 Session with ${req.teacherName} on ${req.skillName}`,
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        referenceId: req.id
      },
      ...prev
    ]);

    // Update Request status
    setSessionRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'accepted',
          updatedAt: new Date().toISOString(),
          confirmedSlot: {
            date: r.requestedDate,
            startTime: r.requestedTime.split('-')[0]?.trim() || '16:00',
            endTime: r.requestedTime.split('-')[1]?.trim() || '17:00'
          }
        };
      }
      return r;
    }));

    // Spawn confirmed LiveSession
    const newSession: LiveSession = {
      id: `sess_${Date.now()}`,
      requestId: req.id,
      teacherId: req.teacherId,
      teacherName: req.teacherName,
      teacherAvatar: req.teacherAvatar,
      learnerId: req.learnerId,
      learnerName: req.learnerName,
      learnerAvatar: req.learnerAvatar,
      skillName: req.skillName,
      topic: req.topic,
      tokenAmount: req.tokenPrice,
      scheduledStartTime: `${req.requestedDate}T16:00:00Z`,
      scheduledEndTime: `${req.requestedDate}T17:00:00Z`,
      durationMinutes: 60,
      status: 'upcoming',
      escrowStatus: 'Held',
      learnerJoined: false,
      teacherJoined: false,
      recordingEnabled: false
    };

    setLiveSessions(prev => [newSession, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_acc_${Date.now()}`,
        userId: req.learnerId,
        type: 'request_accepted',
        title: `Session Confirmed with ${req.teacherName}!`,
        message: `${req.tokenPrice} tokens are held in Escrow. Live video room unlocked.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: `/sessions/${newSession.id}`
      },
      ...prev
    ]);
  };

  const rejectSessionRequest = (requestId: string, reason: string) => {
    setSessionRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected',
          rejectionReason: reason,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  const counterOfferRequest = (
    requestId: string, 
    tokenPrice: number, 
    proposedDate: string, 
    proposedTime: string, 
    note: string
  ) => {
    if (!currentUser) return;
    setSessionRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const isTeacher = currentUser.id === r.teacherId;
        const newCounter: CounterProposal = {
          proposedBy: currentUser.id,
          tokenPrice,
          proposedDate,
          proposedTime,
          note,
          timestamp: new Date().toISOString()
        };

        const updatedRounds = [...r.counterRounds, newCounter];
        const newStatus: RequestStatus = isTeacher ? 'pending_learner_counter' : 'pending_teacher_counter';

        return {
          ...r,
          tokenPrice,
          requestedDate: proposedDate,
          requestedTime: proposedTime,
          status: updatedRounds.length >= r.maxRounds ? 'expired' : newStatus,
          counterRounds: updatedRounds,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  const addWhiteboardElement = (elem: WhiteboardElement) => {
    setWhiteboardElements(prev => [...prev, elem]);
  };

  const clearWhiteboard = () => {
    setWhiteboardElements([]);
  };

  const sendInSessionMessage = (sessionId: string, text: string, type: 'text' | 'code' | 'file' = 'text', codeLang?: string) => {
    if (!currentUser) return;
    const newMsg: InSessionMessage = {
      id: `ism_${Date.now()}`,
      sessionId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      codeLang
    };
    setInSessionMessages(prev => [...prev, newMsg]);
  };

  const completeLiveSession = (sessionId: string, rating: number, feedback: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (!session) return;

    setAllUsers(prev => prev.map(u => {
      if (u.id === session.learnerId) {
        return {
          ...u,
          escrowBalance: Math.max(0, u.escrowBalance - session.tokenAmount),
          totalHoursLearned: u.totalHoursLearned + 1,
          sessionsCompletedCount: u.sessionsCompletedCount + 1,
          tokens: (u.tokens || 0) + 10,
          karma: (u.tokens || 0) + 10
        };
      }
      if (u.id === session.teacherId) {
        const newCount = u.reviewCount + 1;
        const newRating = Number(((u.avgRating * u.reviewCount + rating) / newCount).toFixed(2));
        return {
          ...u,
          walletBalance: u.walletBalance + session.tokenAmount,
          totalHoursTaught: u.totalHoursTaught + 1,
          sessionsCompletedCount: u.sessionsCompletedCount + 1,
          tokens: (u.tokens || 0) + session.tokenAmount + 25,
          karma: (u.tokens || 0) + session.tokenAmount + 25,
          avgRating: newRating,
          reviewCount: newCount
        };
      }
      return u;
    }));

    setTransactions(prev => [
      {
        id: `tx_release_${Date.now()}`,
        userId: session.teacherId,
        type: 'SESSION_ESCROW_RELEASE',
        amount: session.tokenAmount,
        balanceAfter: 200,
        description: `Teaching Payout: 1 hr session on ${session.skillName} with ${session.learnerName}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        referenceId: session.id
      },
      ...prev
    ]);

    setLiveSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'completed',
          escrowStatus: 'Released',
          actualEndTime: new Date().toISOString()
        };
      }
      return s;
    }));

    if (feedback) {
      setReviews(prev => [
        {
          id: `rev_${Date.now()}`,
          sessionId: session.id,
          teacherId: session.teacherId,
          learnerId: session.learnerId,
          learnerName: session.learnerName,
          learnerAvatar: session.learnerAvatar,
          skillName: session.skillName,
          rating,
          feedback,
          createdAt: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
    }

    setNotifications(prev => [
      {
        id: `notif_comp_${Date.now()}`,
        userId: session.teacherId,
        type: 'tokens_received',
        title: `+${session.tokenAmount} Tokens Received!`,
        message: `${session.learnerName} confirmed session completion (${rating}⭐). Tokens deposited to your wallet.`,
        timestamp: new Date().toISOString(),
        isRead: false
      },
      ...prev
    ]);
  };

  const raiseLiveSessionDispute = (sessionId: string, reason: string, evidence: string) => {
    if (!currentUser) return;
    const session = liveSessions.find(s => s.id === sessionId);
    if (!session) return;

    setLiveSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'disputed', escrowStatus: 'Frozen_Disputed' };
      }
      return s;
    }));

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      sessionId: session.id,
      openedByUserId: currentUser.id,
      openedByUserName: currentUser.name,
      againstUserId: currentUser.id === session.teacherId ? session.learnerId : session.teacherId,
      againstUserName: currentUser.id === session.teacherId ? session.learnerName : session.teacherName,
      skillName: session.skillName,
      tokenAmount: session.tokenAmount,
      reason,
      evidenceText: evidence,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    setDisputes(prev => [newDispute, ...prev]);
    alert('Dispute logged. Escrow token release is frozen pending faculty review.');
  };

  // Workshops
  const createWorkshop = (wsData: any) => {
    if (!currentUser) return;
    const newWs: Workshop = {
      id: `ws_${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherAvatar: currentUser.avatar,
      teacherDepartment: currentUser.department,
      title: wsData.title,
      description: wsData.description,
      skillName: wsData.skillName,
      category: wsData.category,
      date: wsData.date,
      startTime: wsData.startTime,
      durationMinutes: wsData.durationMinutes,
      capacity: wsData.capacity,
      enrolledCount: 0,
      tokenPricePerPerson: wsData.tokenPricePerPerson,
      status: 'upcoming',
      agenda: wsData.agenda || ['Introduction & Overview', 'Live Hands-on Coding', 'Group Q&A'],
      attendees: [],
      qaItems: []
    };
    setWorkshops(prev => [newWs, ...prev]);
  };

  const enrollInWorkshop = (workshopId: string): boolean => {
    if (!currentUser) return false;
    const ws = workshops.find(w => w.id === workshopId);
    if (!ws) return false;

    if (currentUser.walletBalance < ws.tokenPricePerPerson) {
      alert(`Insufficient tokens! Need ${ws.tokenPricePerPerson} tokens to enroll.`);
      return false;
    }

    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: u.walletBalance - ws.tokenPricePerPerson
        };
      }
      return u;
    }));

    setTransactions(prev => [
      {
        id: `tx_ws_${Date.now()}`,
        userId: currentUser.id,
        type: 'WORKSHOP_REGISTRATION',
        amount: -ws.tokenPricePerPerson,
        balanceAfter: currentUser.walletBalance - ws.tokenPricePerPerson,
        description: `Enrolled in Workshop: ${ws.title} by ${ws.teacherName}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        referenceId: ws.id
      },
      ...prev
    ]);

    setWorkshops(prev => prev.map(w => {
      if (w.id === workshopId) {
        return {
          ...w,
          enrolledCount: w.enrolledCount + 1,
          attendees: [
            ...w.attendees,
            {
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              joinedAt: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return w;
    }));

    return true;
  };

  const askWorkshopQA = (workshopId: string, question: string) => {
    if (!currentUser) return;
    setWorkshops(prev => prev.map(w => {
      if (w.id === workshopId) {
        return {
          ...w,
          qaItems: [
            ...w.qaItems,
            {
              id: `qa_${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              question,
              upvotes: 1,
              isAnswered: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return w;
    }));
  };

  const upvoteWorkshopQA = (workshopId: string, qaId: string) => {
    setWorkshops(prev => prev.map(w => {
      if (w.id === workshopId) {
        return {
          ...w,
          qaItems: w.qaItems.map(q => q.id === qaId ? { ...q, upvotes: q.upvotes + 1 } : q)
        };
      }
      return w;
    }));
  };

  const toggleHandRaise = (workshopId: string) => {
    if (!currentUser) return;
    setWorkshops(prev => prev.map(w => {
      if (w.id === workshopId) {
        return {
          ...w,
          attendees: w.attendees.map(a => {
            if (a.userId === currentUser.id) {
              return { ...a, hasRaisedHand: !a.hasRaisedHand };
            }
            return a;
          })
        };
      }
      return w;
    }));
  };

  // Direct Messaging
  const sendDirectMessage = (receiverId: string, text: string, attachmentUrl?: string) => {
    if (!currentUser) return;
    
    const existingConv = conversations.find(c => 
      c.participantIds.includes(currentUser.id) && c.participantIds.includes(receiverId)
    );

    const convId = existingConv ? existingConv.id : `conv_${Date.now()}`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachmentUrl
    };

    setMessages(prev => [...prev, newMsg]);

    if (!existingConv) {
      const receiver = allUsers.find(u => u.id === receiverId);
      if (receiver) {
        const newConv: Conversation = {
          id: convId,
          participantIds: [currentUser.id, receiverId],
          participantDetails: [
            { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, department: currentUser.department },
            { id: receiver.id, name: receiver.name, avatar: receiver.avatar, department: receiver.department }
          ],
          lastMessage: text,
          lastMessageTimestamp: new Date().toISOString(),
          unreadCount: 0
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(convId);
      }
    } else {
      setConversations(prev => prev.map(c => {
        if (c.id === existingConv.id) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: new Date().toISOString()
          };
        }
        return c;
      }));
      setActiveConversationId(existingConv.id);
    }
  };

  // Study Tracker & Focus Sessions
  const logStudySession = (
    skillName: string, 
    durationMinutes: number, 
    type: 'self_pomodoro' | 'camera_focus' | 'session_learned' | 'session_taught', 
    notes?: string,
    focusScore?: number,
    distractionCount?: number,
    tokensAwarded: number = 10
  ) => {
    if (!currentUser) return;
    const newLog: StudyLog = {
      id: `sl_${Date.now()}`,
      userId: currentUser.id,
      skillName,
      durationMinutes,
      date: new Date().toISOString().split('T')[0],
      type,
      notes,
      focusScore,
      distractionCount,
      tokensAwarded
    };
    setStudyLogs(prev => [newLog, ...prev]);

    if (tokensAwarded > 0) {
      setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            tokens: (u.tokens || 0) + tokensAwarded,
            karma: (u.tokens || 0) + tokensAwarded,
            walletBalance: u.walletBalance + tokensAwarded
          };
        }
        return u;
      }));

      setTransactions(prev => [
        {
          id: `tx_focus_${Date.now()}`,
          userId: currentUser.id,
          type: 'FOCUS_REWARD',
          amount: tokensAwarded,
          balanceAfter: currentUser.walletBalance + tokensAwarded,
          description: `Focus Study Reward: ${durationMinutes} mins on ${skillName} (+${tokensAwarded} Tokens)`,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS'
        },
        ...prev
      ]);
    }
  };

  // Goals
  const createGoal = (title: string, skillName: string, targetDate: string, milestoneTitles: string[]) => {
    if (!currentUser) return;
    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      userId: currentUser.id,
      title,
      skillName,
      targetDate,
      progressPercent: 0,
      createdAt: new Date().toISOString().split('T')[0],
      milestones: milestoneTitles.map((t, idx) => ({
        id: `m_${Date.now()}_${idx}`,
        title: t,
        completed: false,
        targetDate,
        tokenReward: 25,
        karmaReward: 25
      }))
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    if (!currentUser) return;
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const updatedMilestones = g.milestones.map(m => {
          if (m.id === milestoneId) {
            const willComplete = !m.completed;
            if (willComplete) {
              setAllUsers(uList => uList.map(u => u.id === currentUser.id ? { 
                ...u, 
                tokens: (u.tokens || 0) + m.tokenReward,
                karma: (u.tokens || 0) + m.tokenReward,
                walletBalance: u.walletBalance + m.tokenReward
              } : u));
            }
            return {
              ...m,
              completed: willComplete,
              completedAt: willComplete ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...g,
          milestones: updatedMilestones,
          progressPercent
        };
      }
      return g;
    }));
  };

  const resolveDispute = (disputeId: string, resolution: 'Resolved_Refund_Learner' | 'Resolved_Release_Teacher', note: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    if (resolution === 'Resolved_Refund_Learner') {
      setAllUsers(prev => prev.map(u => {
        if (u.id === dispute.openedByUserId) {
          return { ...u, walletBalance: u.walletBalance + dispute.tokenAmount };
        }
        return u;
      }));
    } else {
      setAllUsers(prev => prev.map(u => {
        if (u.id === dispute.againstUserId) {
          return { ...u, walletBalance: u.walletBalance + dispute.tokenAmount };
        }
        return u;
      }));
    }

    setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status: resolution, resolutionNote: note } : d));
  };

  const grantStarterTokens = (userId: string, amount: number, reason: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      tokens: (u.tokens || 0) + amount,
      karma: (u.tokens || 0) + amount,
      walletBalance: u.walletBalance + amount 
    } : u));
    setTransactions(prev => [
      {
        id: `tx_grant_${Date.now()}`,
        userId,
        type: 'ADMIN_ADJUSTMENT',
        amount,
        balanceAfter: 150,
        description: `Admin Grant: ${reason}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      },
      ...prev
    ]);
  };

  // Authentication handlers
  const loginUser = (email: string, password?: string): boolean => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUserId(user.id);
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      localStorage.setItem('skillswap_logged_in', 'true');
      localStorage.setItem('skillswap_current_user_id', user.id);
      return true;
    }
    return false;
  };

  const registerUser = (userData: Partial<User> & { avatar?: string; socials?: SocialLinks }) => {
    const newUserId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: userData.name || 'New Student',
      email: userData.email || `${newUserId}@campus.edu`,
      role: 'student',
      department: userData.department || 'Computer Science & Engineering',
      year: userData.year || '1st Year Undergraduate',
      bio: userData.bio || 'Campus learner exploring peer skill exchange.',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      timezone: 'IST (UTC+5:30)',
      skillpoints: 50,
      tokens: 50,
      karma: 50,
      leaderboardRank: allUsers.length + 1,
      walletBalance: 50,
      escrowBalance: 0,
      totalHoursTaught: 0,
      totalHoursLearned: 0,
      sessionsCompletedCount: 0,
      avgRating: 0.0,
      reviewCount: 0,
      isVerifiedStudent: true,
      joinedDate: new Date().toISOString().split('T')[0],
      socials: userData.socials || {},
      skillsLearning: userData.skillsLearning || [],
      badges: [
        {
          id: `b_welcome_${Date.now()}`,
          name: 'Campus Pioneer',
          icon: '🎓',
          description: 'Joined SkillSwap Campus Network',
          dateEarned: new Date().toISOString().split('T')[0],
          category: 'community'
        },
        {
          id: `b_early_${Date.now()}`,
          name: 'Early Adopter',
          icon: '⚡',
          description: 'First Semester Founding Member',
          dateEarned: new Date().toISOString().split('T')[0],
          category: 'community'
        },
        {
          id: `b_learner_${Date.now()}`,
          name: 'First Step',
          icon: '📚',
          description: 'Ready for 1:1 Peer Sessions',
          dateEarned: new Date().toISOString().split('T')[0],
          category: 'learning'
        }
      ]
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUserId);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    localStorage.setItem('skillswap_logged_in', 'true');
    localStorage.setItem('skillswap_current_user_id', newUserId);

    setTransactions(prev => [
      {
        id: `tx_welcome_${Date.now()}`,
        userId: newUserId,
        type: 'WELCOME_GRANT',
        amount: 50,
        balanceAfter: 50,
        description: 'Campus Onboarding Welcome Grant (+50 SkillPoints)',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      },
      ...prev
    ]);
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setCurrentUserId('');
    setIsAuthModalOpen(true);
    localStorage.removeItem('skillswap_logged_in');
    localStorage.removeItem('skillswap_current_user_id');
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginUser,
      registerUser,
      logoutUser,
      updateUserProfile,
      currentTab,
      setCurrentTab,
      currentUser,
      setCurrentUserById,
      allUsers,
      viewedUserId,
      setViewedUserId,
      skills,
      userSkills,
      activeQuizSkillId,
      setActiveQuizSkillId,
      submitQuizAttempt,
      addNewSkillOffering,
      certificates,
      uploadCertificate,
      adminReviewCertificate,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      rankingWeights,
      setRankingWeights,
      calculateTeacherRankingScore,
      sessionRequests,
      createSessionRequest,
      acceptSessionRequest,
      rejectSessionRequest,
      counterOfferRequest,
      liveSessions,
      activeLiveSessionId,
      setActiveLiveSessionId,
      whiteboardElements,
      addWhiteboardElement,
      clearWhiteboard,
      inSessionMessages,
      sendInSessionMessage,
      completeLiveSession,
      raiseLiveSessionDispute,
      workshops,
      activeWorkshopId,
      setActiveWorkshopId,
      createWorkshop,
      enrollInWorkshop,
      askWorkshopQA,
      upvoteWorkshopQA,
      toggleHandRaise,
      conversations,
      activeConversationId,
      setActiveConversationId,
      messages,
      sendDirectMessage,
      transactions,
      grantStarterTokens,
      studyLogs,
      logStudySession,
      goals,
      createGoal,
      toggleMilestone,
      leaderboard,
      skillGaps,
      disputes,
      resolveDispute,
      reviews,
      notifications,
      markNotificationRead,
      clearAllNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
