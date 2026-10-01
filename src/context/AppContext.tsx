import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Skill, UserSkill, Certificate, SessionRequest, 
  LiveSession, Workshop, Conversation, Message, Transaction, 
  Goal, StudyLog, Notification, LeaderboardEntry, SkillGapData, 
  Dispute, Review, WhiteboardElement, InSessionMessage, CounterProposal, RequestStatus
} from '../types';
import { 
  INITIAL_USERS, INITIAL_SKILLS, INITIAL_USER_SKILLS, 
  INITIAL_CERTIFICATES, INITIAL_SESSION_REQUESTS, INITIAL_LIVE_SESSIONS, 
  INITIAL_WORKSHOPS, INITIAL_CONVERSATIONS, INITIAL_MESSAGES, 
  INITIAL_TRANSACTIONS, INITIAL_GOALS, INITIAL_STUDY_LOGS, 
  INITIAL_NOTIFICATIONS, INITIAL_LEADERBOARD, INITIAL_SKILL_GAPS, 
  INITIAL_DISPUTES, INITIAL_REVIEWS 
} from '../data/mockData';

export type NavigationTab = 
  | 'dashboard'
  | 'search'
  | 'portfolio'
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
  uploadCertificate: (skillName: string, title: string, issuer: string, fileUrl: string) => void;
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
  
  // Study Tracker & Pomodoro
  studyLogs: StudyLog[];
  logStudySession: (skillName: string, durationMinutes: number, type: 'self_pomodoro' | 'session_learned' | 'session_taught', notes?: string) => void;
  
  // Goals & Milestones
  goals: Goal[];
  createGoal: (title: string, skillName: string, targetDate: string, milestones: string[]) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  
  // Leaderboard & Karma
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('skillswap_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUserId, setCurrentUserId] = useState<string>('usr_aarav');
  const [viewedUserId, setViewedUserId] = useState<string>('usr_meera');

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  // Domain State with LocalStorage Persistence
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('skillswap_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [userSkills, setUserSkills] = useState<UserSkill[]>(() => {
    const saved = localStorage.getItem('skillswap_user_skills');
    return saved ? JSON.parse(saved) : INITIAL_USER_SKILLS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('skillswap_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>(() => {
    const saved = localStorage.getItem('skillswap_requests');
    return saved ? JSON.parse(saved) : INITIAL_SESSION_REQUESTS;
  });

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(() => {
    const saved = localStorage.getItem('skillswap_live_sessions');
    return saved ? JSON.parse(saved) : INITIAL_LIVE_SESSIONS;
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    const saved = localStorage.getItem('skillswap_workshops');
    return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('skillswap_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('skillswap_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('skillswap_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('skillswap_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('skillswap_study_logs');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_LOGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('skillswap_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('skillswap_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [skillGaps, setSkillGaps] = useState<SkillGapData[]>(INITIAL_SKILL_GAPS);
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
  const [activeLiveSessionId, setActiveLiveSessionId] = useState<string | null>('sess_live_1');
  const [activeWorkshopId, setActiveWorkshopId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');

  // Interactive Live Session UI State
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([
    { id: 'wb_1', type: 'text', x: 40, y: 50, color: '#111111', text: '🤖 QLoRA Architecture Diagram & Weight Projections', authorId: 'usr_meera' }
  ]);
  const [inSessionMessages, setInSessionMessages] = useState<InSessionMessage[]>([
    { id: 'ism_1', sessionId: 'sess_live_1', senderId: 'usr_meera', senderName: 'Meera Patel', text: 'Welcome Aarav! Pull up your Jupyter notebook when ready.', timestamp: '17:01', type: 'text' }
  ]);

  // Persist to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('skillswap_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('skillswap_user_skills', JSON.stringify(userSkills));
  }, [userSkills]);

  useEffect(() => {
    localStorage.setItem('skillswap_requests', JSON.stringify(sessionRequests));
  }, [sessionRequests]);

  useEffect(() => {
    localStorage.setItem('skillswap_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('skillswap_goals', JSON.stringify(goals));
  }, [goals]);

  // Switch User Profile
  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Dynamic Teacher Ranking Score (PRD 3.5 formula)
  const calculateTeacherRankingScore = (teacher: User, userSkill: UserSkill): number => {
    // 1. Quiz Verification (0-100) -> 25%
    const quizScore = userSkill.isVerified ? (userSkill.verificationScore || 90) : 0;
    
    // 2. Rating (0-5 scaled to 0-100) -> 25%
    const ratingScore = (userSkill.rating / 5) * 100;

    // 3. Experience / Sessions Taught -> 20%
    const expScore = Math.min(100, (userSkill.totalSessionsTaught * 2) + (userSkill.yearsExperience * 15));

    // 4. Leaderboard / Karma -> 15%
    const karmaScore = Math.min(100, (teacher.karma / 2000) * 100);

    // 5. Relevant Certificates -> 10%
    const hasCert = certificates.some(c => c.userId === teacher.id && c.skillName.toLowerCase().includes(userSkill.skillName.toLowerCase()) && c.status === 'Verified');
    const certScore = hasCert ? 100 : 30;

    // 6. Response rate fit -> 5%
    const responseScore = teacher.badges.some(b => b.name === 'Fast Responder') ? 100 : 80;

    const finalScore = (
      (quizScore * rankingWeights.quiz) +
      (ratingScore * rankingWeights.rating) +
      (expScore * rankingWeights.experience) +
      (karmaScore * rankingWeights.karma) +
      (certScore * rankingWeights.certs) +
      (responseScore * rankingWeights.response)
    );

    return Math.round(finalScore);
  };

  // Submit Verification Quiz (PRD 3.2)
  const submitQuizAttempt = (
    skillId: string, 
    answers: Record<string, number>, 
    targetLevel: 'Beginner' | 'Intermediate' | 'Advanced', 
    pricePerHour: number, 
    description: string
  ) => {
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
    const passed = percentage >= 70; // 70% pass mark

    if (passed) {
      // Add or update UserSkill with Verified badge
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

      // Award Karma & Bonus
      setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            karma: u.karma + 50,
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

      // Log notification
      setNotifications(prev => [
        {
          id: `notif_quiz_${Date.now()}`,
          userId: currentUser.id,
          type: 'certificate_verified',
          title: `Verification Challenge Passed! (${percentage}%)`,
          message: `Your skill "${skill.name}" is now Verified with a public badge. Earned +50 Karma!`,
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
      rating: 5.0
    };
    setUserSkills(prev => [newEntry, ...prev]);
  };

  // Upload Certificate
  const uploadCertificate = (skillName: string, title: string, issuer: string, fileUrl: string) => {
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      userId: currentUser.id,
      skillName,
      title,
      issuer,
      issueDate: new Date().toISOString().split('T')[0],
      fileUrl: fileUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80',
      fileType: 'image',
      status: 'Pending'
    };
    setCertificates(prev => [newCert, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_cert_${Date.now()}`,
        userId: currentUser.id,
        type: 'certificate_verified',
        title: 'Certificate Submitted for Review',
        message: `"${title}" has been submitted to Department Faculty for verification.`,
        timestamp: new Date().toISOString(),
        isRead: false
      },
      ...prev
    ]);
  };

  // Admin Review Certificate
  const adminReviewCertificate = (certId: string, status: 'Verified' | 'Rejected', reason?: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status,
          reviewedBy: currentUser.name,
          reviewedAt: new Date().toISOString().split('T')[0],
          rejectionReason: reason
        };
      }
      return c;
    }));
  };

  // Create Session Request (PRD 3.6)
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
    const teacher = allUsers.find(u => u.id === teacherId);
    const skill = skills.find(s => s.id === skillId) || INITIAL_SKILLS[0];
    if (!teacher) return false;

    // Check learner token balance
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

    // Send in-app notification to teacher
    setNotifications(prev => [
      {
        id: `notif_req_${Date.now()}`,
        userId: teacher.id,
        type: 'request_received',
        title: `New Session Request from ${currentUser.name}`,
        message: `Topic: "${topic}" (${tokenPrice} tokens/hr offered).`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: '/requests'
      },
      ...prev
    ]);

    return true;
  };

  // Accept Request (PRD 3.6: Locks Escrow, Updates Calendar & Creates Live Session)
  const acceptSessionRequest = (requestId: string) => {
    const req = sessionRequests.find(r => r.id === requestId);
    if (!req) return;

    // Lock tokens in Escrow from Learner's wallet
    setAllUsers(prev => prev.map(u => {
      if (u.id === req.learnerId) {
        return {
          ...u,
          walletBalance: u.walletBalance - req.tokenPrice,
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
        balanceAfter: (currentUser.id === req.learnerId ? currentUser.walletBalance - req.tokenPrice : 100),
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

    // Notify learner
    setNotifications(prev => [
      {
        id: `notif_acc_${Date.now()}`,
        userId: req.learnerId,
        type: 'request_accepted',
        title: `Session Confirmed with ${req.teacherName}!`,
        message: `${req.tokenPrice} tokens are now safely held in Escrow. Slot scheduled for ${req.requestedDate}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionUrl: `/sessions/${newSession.id}`
      },
      ...prev
    ]);
  };

  // Reject Request (PRD 3.6)
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

  // Counter-Offer (PRD 3.6: max 3 rounds)
  const counterOfferRequest = (
    requestId: string, 
    tokenPrice: number, 
    proposedDate: string, 
    proposedTime: string, 
    note: string
  ) => {
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

  // Live Session Whiteboard & Chat
  const addWhiteboardElement = (elem: WhiteboardElement) => {
    setWhiteboardElements(prev => [...prev, elem]);
  };

  const clearWhiteboard = () => {
    setWhiteboardElements([]);
  };

  const sendInSessionMessage = (sessionId: string, text: string, type: 'text' | 'code' | 'file' = 'text', codeLang?: string) => {
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

  // Complete Live Session & Escrow Release (PRD 3.7 & 3.12)
  const completeLiveSession = (sessionId: string, rating: number, feedback: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (!session) return;

    // 1. Move escrow tokens from Learner to Teacher wallet
    setAllUsers(prev => prev.map(u => {
      if (u.id === session.learnerId) {
        return {
          ...u,
          escrowBalance: Math.max(0, u.escrowBalance - session.tokenAmount),
          totalHoursLearned: u.totalHoursLearned + 1,
          sessionsCompletedCount: u.sessionsCompletedCount + 1,
          karma: u.karma + 10 // learner karma for completing
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
          karma: u.karma + 40, // teacher karma for teaching
          avgRating: newRating,
          reviewCount: newCount
        };
      }
      return u;
    }));

    // 2. Add Escrow Release transaction ledger
    setTransactions(prev => [
      {
        id: `tx_release_${Date.now()}`,
        userId: session.teacherId,
        type: 'SESSION_ESCROW_RELEASE',
        amount: session.tokenAmount,
        balanceAfter: 360,
        description: `Teaching Payout: 1 hr session on ${session.skillName} with ${session.learnerName}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        referenceId: session.id
      },
      ...prev
    ]);

    // 3. Mark session complete & released
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

    // 4. Save rating & review
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

    // 5. Notifications
    setNotifications(prev => [
      {
        id: `notif_comp_${Date.now()}`,
        userId: session.teacherId,
        type: 'tokens_received',
        title: `+${session.tokenAmount} Tokens Received!`,
        message: `${session.learnerName} rated your session ${rating}⭐ and confirmed completion. Escrow released.`,
        timestamp: new Date().toISOString(),
        isRead: false
      },
      ...prev
    ]);
  };

  // Raise Dispute (PRD 3.7 Escrow Freezing)
  const raiseLiveSessionDispute = (sessionId: string, reason: string, evidence: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (!session) return;

    setLiveSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'disputed',
          escrowStatus: 'Frozen_Disputed'
        };
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

    alert('Dispute logged with Campus Arbiters. Escrow token release is frozen pending faculty review.');
  };

  // Workshops
  const createWorkshop = (wsData: any) => {
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
    const ws = workshops.find(w => w.id === workshopId);
    if (!ws) return false;

    if (currentUser.walletBalance < ws.tokenPricePerPerson) {
      alert(`Insufficient tokens! Need ${ws.tokenPricePerPerson} tokens to enroll.`);
      return false;
    }

    // Debit tokens
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: u.walletBalance - ws.tokenPricePerPerson
        };
      }
      return u;
    }));

    // Record transaction
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

    // Add attendee
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
    const conv = conversations.find(c => c.participantIds.includes(currentUser.id) && c.participantIds.includes(receiverId));
    const conversationId = conv ? conv.id : `conv_${Date.now()}`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachmentUrl
    };

    setMessages(prev => [...prev, newMsg]);

    if (!conv) {
      const receiver = allUsers.find(u => u.id === receiverId);
      if (receiver) {
        setConversations(prev => [
          {
            id: conversationId,
            participantIds: [currentUser.id, receiverId],
            participantDetails: [
              { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, department: currentUser.department },
              { id: receiver.id, name: receiver.name, avatar: receiver.avatar, department: receiver.department }
            ],
            lastMessage: text,
            lastMessageTimestamp: new Date().toISOString(),
            unreadCount: 0
          },
          ...prev
        ]);
      }
    } else {
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: new Date().toISOString()
          };
        }
        return c;
      }));
    }
  };

  // Study Tracker (PRD 3.10)
  const logStudySession = (skillName: string, durationMinutes: number, type: 'self_pomodoro' | 'session_learned' | 'session_taught', notes?: string) => {
    const newLog: StudyLog = {
      id: `sl_${Date.now()}`,
      userId: currentUser.id,
      skillName,
      durationMinutes,
      date: new Date().toISOString().split('T')[0],
      type,
      notes
    };
    setStudyLogs(prev => [newLog, ...prev]);
  };

  // Learning Goals (PRD 3.11)
  const createGoal = (title: string, skillName: string, targetDate: string, milestoneTitles: string[]) => {
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
        karmaReward: 25
      }))
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const updatedMilestones = g.milestones.map(m => {
          if (m.id === milestoneId) {
            const willComplete = !m.completed;
            if (willComplete) {
              // Award Karma
              setAllUsers(uList => uList.map(u => u.id === currentUser.id ? { ...u, karma: u.karma + m.karmaReward } : u));
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

  // Admin Dispute Resolution
  const resolveDispute = (disputeId: string, resolution: 'Resolved_Refund_Learner' | 'Resolved_Release_Teacher', note: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    if (resolution === 'Resolved_Refund_Learner') {
      // Refund tokens back to learner wallet
      setAllUsers(prev => prev.map(u => {
        if (u.id === dispute.openedByUserId) {
          return { ...u, walletBalance: u.walletBalance + dispute.tokenAmount };
        }
        return u;
      }));
    } else {
      // Release tokens to teacher
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
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalance: u.walletBalance + amount } : u));
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

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
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
