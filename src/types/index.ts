export type Department = 
  | 'Computer Science & Engineering'
  | 'Electrical & Electronics'
  | 'Mechanical & Robotics'
  | 'Design & Human-Computer Interaction'
  | 'Business & Management'
  | 'Biotechnology & Data';

export type SkillCategory = 
  | 'Software & AI'
  | 'Design & UX'
  | 'Hardware & Systems'
  | 'Business & Career'
  | 'Academic & Science'
  | 'Creative & Media';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SocialLinks {
  github?: string;
  instagram?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department: Department;
  year: string;
  bio: string;
  avatar: string;
  timezone: string;
  skillpoints: number;
  tokens: number; // Alias for skillpoints
  karma?: number; // Alias for skillpoints
  leaderboardRank: number;
  walletBalance: number;
  escrowBalance: number;
  totalHoursTaught: number;
  totalHoursLearned: number;
  sessionsCompletedCount: number;
  avgRating: number;
  reviewCount: number;
  isVerifiedStudent: boolean;
  joinedDate: string;
  badges: TokenBadge[];
  featuredSkillId?: string;
  socials?: SocialLinks;
  skillsLearning?: string[];
}

export interface TokenBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned: string;
  category: 'teaching' | 'learning' | 'velocity' | 'community';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  iconName: string;
  tags: string[];
  demandCount: number;
  supplyCount: number;
  quizQuestions: QuizQuestion[];
  suggestedPrerequisites?: string[];
  complementarySkills?: string[];
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsExperience: number;
  description: string;
  tokenPricePerHour: number;
  isVerified: boolean;
  verificationScore?: number;
  verifiedAt?: string;
  tags: string[];
  totalSessionsTaught: number;
  rating: number;
  certificateUrl?: string;
  certificateName?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userSkillId?: string;
  skillName: string;
  title: string;
  issuer: string;
  issueDate: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  status: 'Pending' | 'Verified' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  date?: string;
}

export type RequestStatus = 
  | 'pending_teacher'
  | 'pending_learner_counter'
  | 'pending_teacher_counter'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'completed'
  | 'disputed';

export interface CounterProposal {
  proposedBy: string;
  tokenPrice: number;
  proposedDate: string;
  proposedTime: string;
  note: string;
  timestamp: string;
}

export interface SessionRequest {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  skillId: string;
  skillName: string;
  topic: string;
  goal: string;
  requestedDate: string;
  requestedTime: string;
  tokenPrice: number;
  status: RequestStatus;
  message: string;
  counterRounds: CounterProposal[];
  maxRounds: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  confirmedSlot?: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export interface LiveSession {
  id: string;
  requestId: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  skillName: string;
  topic: string;
  tokenAmount: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  durationMinutes: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'disputed';
  escrowStatus: 'Held' | 'Released' | 'Refunded' | 'Frozen_Disputed';
  learnerJoined: boolean;
  teacherJoined: boolean;
  recordingEnabled: boolean;
  whiteboardNotes?: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'line' | 'rect' | 'circle' | 'text' | 'sticky';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  points?: { x: number; y: number }[];
  text?: string;
  authorId: string;
}

export interface InSessionMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: 'text' | 'code' | 'file';
  codeLang?: string;
}

export interface Workshop {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  teacherDepartment: Department;
  title: string;
  description: string;
  skillName: string;
  category: SkillCategory;
  date: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
  enrolledCount: number;
  tokenPricePerPerson: number;
  status: 'upcoming' | 'live' | 'completed';
  agenda: string[];
  attendees: {
    userId: string;
    userName: string;
    userAvatar: string;
    joinedAt: string;
    hasRaisedHand?: boolean;
  }[];
  qaItems: {
    id: string;
    userId: string;
    userName: string;
    question: string;
    upvotes: number;
    isAnswered: boolean;
    timestamp: string;
  }[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantDetails: {
    id: string;
    name: string;
    avatar: string;
    department: Department;
  }[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  relatedRequestId?: string;
}

export type TransactionType = 
  | 'WELCOME_GRANT'
  | 'SESSION_ESCROW_HOLD'
  | 'SESSION_ESCROW_RELEASE'
  | 'SESSION_ESCROW_REFUND'
  | 'WORKSHOP_REGISTRATION'
  | 'WORKSHOP_PAYOUT'
  | 'TOKEN_BONUS'
  | 'FOCUS_REWARD'
  | 'ADMIN_ADJUSTMENT';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  referenceId?: string;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: string;
  completedAt?: string;
  tokenReward: number;
  karmaReward?: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  skillName: string;
  targetDate: string;
  progressPercent: number;
  milestones: Milestone[];
  createdAt: string;
  status?: 'active' | 'completed' | 'paused';
}

export interface StudyLog {
  id: string;
  userId: string;
  skillName: string;
  durationMinutes: number;
  date: string;
  type: 'self_pomodoro' | 'camera_focus' | 'session_learned' | 'session_taught';
  focusScore?: number;
  distractionCount?: number;
  notes?: string;
  tokensAwarded?: number;
}

export type NotificationType = 
  | 'request_received'
  | 'request_accepted'
  | 'request_countered'
  | 'request_rejected'
  | 'session_reminder'
  | 'session_completed'
  | 'tokens_received'
  | 'milestone_achieved'
  | 'new_message'
  | 'dispute_update'
  | 'certificate_verified';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionPayload?: any;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  department: Department;
  topSkill: string;
  tokens: number;
  karma?: number;
  sessionsTaught: number;
  rating: number;
  verifiedSkillsCount: number;
  change: 'up' | 'down' | 'same';
}

export interface SkillGapData {
  skillId: string;
  skillName: string;
  department: Department;
  demandSearchesAndRequests: number;
  supplyTeachers: number;
  availableHoursPerWeek: number;
  gapIndex: number;
  status: 'Critical Gap' | 'Deficit' | 'Balanced' | 'Surplus';
  actionRecommendation: string;
}

export interface Dispute {
  id: string;
  sessionId: string;
  openedByUserId: string;
  openedByUserName: string;
  againstUserId: string;
  againstUserName: string;
  skillName: string;
  tokenAmount: number;
  reason: string;
  evidenceText: string;
  status: 'Open' | 'Under_Review' | 'Resolved_Refund_Learner' | 'Resolved_Release_Teacher';
  createdAt: string;
  resolutionNote?: string;
}

export interface Review {
  id: string;
  sessionId: string;
  teacherId: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  skillName: string;
  rating: number;
  feedback: string;
  createdAt: string;
  date?: string;
  reviewerName?: string;
  skillId?: string;
}
