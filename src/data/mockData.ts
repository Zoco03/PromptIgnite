import { 
  User, Skill, UserSkill, Certificate, SessionRequest, 
  LiveSession, Workshop, Conversation, Message, Transaction, 
  Goal, StudyLog, Notification, LeaderboardEntry, SkillGapData, Dispute, Review
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: '2nd Year Undergraduate',
    bio: 'Passionate frontend developer exploring deep learning and computer vision. Active campus hackathon winner.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    timezone: 'IST (UTC+5:30)',
    karma: 420,
    leaderboardRank: 12,
    walletBalance: 110,
    escrowBalance: 25,
    totalHoursTaught: 14,
    totalHoursLearned: 38,
    sessionsCompletedCount: 16,
    avgRating: 4.8,
    reviewCount: 9,
    isVerifiedStudent: true,
    joinedDate: '2026-01-15',
    badges: [
      { id: 'b1', name: 'Fast Responder', icon: '⚡', description: 'Replies to requests in under 15 mins', dateEarned: '2026-02-10', category: 'community' },
      { id: 'b2', name: 'Knowledge Pioneer', icon: '🌱', description: 'Completed 10+ learning milestones', dateEarned: '2026-02-28', category: 'learning' },
      { id: 'b3', name: 'React Artisan', icon: '⚛️', description: 'Passed React verification challenge with 95%', dateEarned: '2026-03-05', category: 'teaching' },
    ],
    featuredSkillId: 'sk_react',
  },
  {
    id: 'usr_meera',
    name: 'Meera Patel',
    email: 'meera.patel@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: '4th Year Senior (Pre-Doc)',
    bio: 'Published ML researcher (NeurIPS workshop). Teaching PyTorch, Transformers, and LLM fine-tuning to junior peers.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    timezone: 'IST (UTC+5:30)',
    karma: 1850,
    leaderboardRank: 1,
    walletBalance: 340,
    escrowBalance: 30,
    totalHoursTaught: 94,
    totalHoursLearned: 18,
    sessionsCompletedCount: 68,
    avgRating: 4.95,
    reviewCount: 52,
    isVerifiedStudent: true,
    joinedDate: '2025-08-20',
    badges: [
      { id: 'b4', name: 'Master Mentor', icon: '👑', description: 'Taught over 75+ hours with 4.9+ rating', dateEarned: '2026-01-10', category: 'teaching' },
      { id: 'b5', name: 'Campus AI Lead', icon: '🤖', description: 'Host of premier campus AI workshop', dateEarned: '2026-02-01', category: 'teaching' },
      { id: 'b6', name: 'Top Ranked #1', icon: '🏆', description: 'Rank 1 on all-campus Karma Leaderboard', dateEarned: '2026-03-01', category: 'velocity' },
    ],
    featuredSkillId: 'sk_aiml',
  },
  {
    id: 'usr_rohan',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@campus.edu',
    role: 'student',
    department: 'Design & Human-Computer Interaction',
    year: '3rd Year Undergraduate',
    bio: 'Product designer focusing on accessible UI, typography hierarchy, and Figma component libraries.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    timezone: 'IST (UTC+5:30)',
    karma: 980,
    leaderboardRank: 4,
    walletBalance: 175,
    escrowBalance: 0,
    totalHoursTaught: 46,
    totalHoursLearned: 22,
    sessionsCompletedCount: 31,
    avgRating: 4.85,
    reviewCount: 26,
    isVerifiedStudent: true,
    joinedDate: '2025-09-12',
    badges: [
      { id: 'b7', name: 'Design Craft', icon: '🎨', description: 'Verified UI/UX Expert', dateEarned: '2025-11-20', category: 'teaching' },
      { id: 'b8', name: 'Sprint Guide', icon: '🚀', description: 'Hosted 5 Design Review Sprints', dateEarned: '2026-01-15', category: 'community' },
    ],
    featuredSkillId: 'sk_uiux',
  },
  {
    id: 'usr_priya',
    name: 'Priya Verma',
    email: 'priya.verma@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: '4th Year Undergraduate',
    bio: 'Distributed Systems & Cloud architect. Certified Kubernetes Admin (CKA). Teaching Docker, Go, and Microservices.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timezone: 'IST (UTC+5:30)',
    karma: 1240,
    leaderboardRank: 3,
    walletBalance: 210,
    escrowBalance: 0,
    totalHoursTaught: 58,
    totalHoursLearned: 15,
    sessionsCompletedCount: 42,
    avgRating: 4.92,
    reviewCount: 38,
    isVerifiedStudent: true,
    joinedDate: '2025-08-10',
    badges: [
      { id: 'b9', name: 'Cloud Specialist', icon: '☁️', description: '50+ hours teaching distributed infra', dateEarned: '2026-01-05', category: 'teaching' },
    ],
    featuredSkillId: 'sk_cloud',
  },
  {
    id: 'usr_admin',
    name: 'Dean Vikram Rao (Admin)',
    email: 'dean.rao@campus.edu',
    role: 'admin',
    department: 'Computer Science & Engineering',
    year: 'Faculty & Dean of Academics',
    bio: 'Campus SkillSwap Administrator & Faculty Lead. Reviewing departmental skill demands, certificates, and question banks.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    timezone: 'IST (UTC+5:30)',
    karma: 5000,
    leaderboardRank: 0,
    walletBalance: 1000,
    escrowBalance: 0,
    totalHoursTaught: 0,
    totalHoursLearned: 0,
    sessionsCompletedCount: 0,
    avgRating: 5.0,
    reviewCount: 0,
    isVerifiedStudent: true,
    joinedDate: '2025-01-01',
    badges: [
      { id: 'b0', name: 'Platform Arbiter', icon: '⚖️', description: 'Faculty administrator and arbitrator', dateEarned: '2025-01-01', category: 'community' }
    ]
  }
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'sk_aiml',
    name: 'AI & Machine Learning (PyTorch & Transformers)',
    category: 'Software & AI',
    description: 'Foundations of gradient descent, neural networks, computer vision, attention mechanisms, and fine-tuning HuggingFace models.',
    iconName: 'Brain',
    tags: ['PyTorch', 'Transformers', 'Deep Learning', 'Computer Vision', 'LLMs'],
    demandCount: 142,
    supplyCount: 18,
    suggestedPrerequisites: ['Python Programming', 'Linear Algebra & Calculus'],
    complementarySkills: ['Statistics & Probability', 'Data Visualization', 'MLOps & Deployment'],
    quizQuestions: [
      {
        id: 'q_ai_1',
        question: 'What is the primary mathematical reason for using backpropagation over brute-force finite differences to compute gradients?',
        options: [
          'It is easier to implement on CPUs',
          'It computes gradients of all parameters in a single reverse pass using chain rule in O(N) complexity',
          'It removes the need for activation functions',
          'It prevents gradient explosion completely'
        ],
        correctIndex: 1,
        explanation: 'Backpropagation leverages the chain rule during the backward pass to evaluate gradients for all weights in linear time proportional to the graph size.'
      },
      {
        id: 'q_ai_2',
        question: 'In self-attention, what is the purpose of dividing the query-key dot product by sqrt(d_k)?',
        options: [
          'To normalize the output to zero mean',
          'To prevent dot products from growing large in magnitude and pushing softmax into vanishing gradient regions',
          'To reduce matrix memory footprint',
          'To convert floating-point values into integers'
        ],
        correctIndex: 1,
        explanation: 'Scaling by 1/sqrt(d_k) prevents large dot products that would produce extremely small gradients in the softmax function.'
      },
      {
        id: 'q_ai_3',
        question: 'Which loss function is standard for multi-class classification with one-hot encoded labels?',
        options: [
          'Mean Squared Error (MSE)',
          'Categorical Cross-Entropy Loss (Log Loss)',
          'Hinge Loss',
          'Cosine Similarity Loss'
        ],
        correctIndex: 1,
        explanation: 'Categorical cross-entropy measures the divergence between the true distribution and predicted softmax probability distribution.'
      },
      {
        id: 'q_ai_4',
        question: 'What does Dropout do during model training?',
        options: [
          'Permanently deletes unimportant weights to compress model',
          'Randomly zeroes out activations with probability p to prevent co-adaptation and overfitting',
          'Decreases learning rate dynamically',
          'Normalizes batches across channels'
        ],
        correctIndex: 1,
        explanation: 'Dropout forces neural networks to learn redundant representations by randomly disabling neurons during each forward pass.'
      },
      {
        id: 'q_ai_5',
        question: 'What is the advantage of using Adam optimizer over vanilla SGD with constant learning rate?',
        options: [
          'It computes exact second-order Hessians',
          'It maintains individual adaptive learning rates for each parameter based on first and second moment estimates',
          'It guarantees finding the global minimum in non-convex losses',
          'It requires zero memory overhead'
        ],
        correctIndex: 1,
        explanation: 'Adam computes adaptive learning rates for each parameter by tracking exponentially decaying averages of past gradients and squared gradients.'
      }
    ]
  },
  {
    id: 'sk_react',
    name: 'Modern React, Next.js & TypeScript',
    category: 'Software & AI',
    description: 'Declarative component design, custom hooks, state machines, server-side rendering, and production web architecture.',
    iconName: 'Code2',
    tags: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'State Management'],
    demandCount: 118,
    supplyCount: 32,
    suggestedPrerequisites: ['Modern JavaScript (ES6+)', 'HTML & CSS'],
    complementarySkills: ['UI/UX Design Systems', 'GraphQL & REST APIs', 'Node.js Backend'],
    quizQuestions: [
      {
        id: 'q_re_1',
        question: 'What is the rule regarding the dependency array of useEffect in React?',
        options: [
          'You should only include primitives',
          'All reactive values (props, state, and derived functions) referenced inside must be declared in the dependencies',
          'It is purely optional and doesn\'t affect execution',
          'Leave it empty for every hook to prevent re-renders'
        ],
        correctIndex: 1,
        explanation: 'React linter and runtime require all reactive variables used in the effect to be in the dependency array to prevent stale closures.'
      },
      {
        id: 'q_re_2',
        question: 'Why does React require a unique "key" prop when rendering arrays of components?',
        options: [
          'To style elements automatically',
          'To help React identify which items have changed, added, or removed for efficient DOM reconciliation',
          'To pass props secretly to children',
          'To bind events to global window'
        ],
        correctIndex: 1,
        explanation: 'Keys give elements a stable identity between renders, allowing React to minimize expensive DOM mutations.'
      },
      {
        id: 'q_re_3',
        question: 'What does useCallback hook return in React?',
        options: [
          'The executed result of the function',
          'A memoized version of the callback function that only changes when dependencies change',
          'A promise that resolves on unmount',
          'A ref to the DOM element'
        ],
        correctIndex: 1,
        explanation: 'useCallback memoizes the function reference to prevent unnecessary child re-renders that rely on reference equality.'
      },
      {
        id: 'q_re_4',
        question: 'In TypeScript with React, what is the type of a function component that accepts children?',
        options: [
          'React.FC<React.PropsWithChildren<Props>> or explicit { children: React.ReactNode }',
          'String',
          'HTMLElement',
          'Array<any>'
        ],
        correctIndex: 0,
        explanation: 'React.PropsWithChildren or explicit React.ReactNode type safely handles child node elements, strings, numbers, and fragments.'
      },
      {
        id: 'q_re_5',
        question: 'What is the key benefit of React Server Components (RSC) in Next.js App Router?',
        options: [
          'They allow client-side alert dialogs',
          'Zero client-side JavaScript bundle overhead for static server rendering and direct database access',
          'They replace CSS styling completely',
          'They disable browser caching'
        ],
        correctIndex: 1,
        explanation: 'Server Components execute exclusively on the server, keeping large dependencies out of the client bundle.'
      }
    ]
  },
  {
    id: 'sk_uiux',
    name: 'UI/UX & Design Systems (Figma & Tokens)',
    category: 'Design & UX',
    description: 'Atomic design tokens, typography scales, accessibility (WCAG AA/AAA), auto-layout, micro-interactions, and component architecture.',
    iconName: 'Palette',
    tags: ['Figma', 'Design Systems', 'Typography', 'WCAG Accessibility', 'Prototyping'],
    demandCount: 88,
    supplyCount: 14,
    suggestedPrerequisites: ['Visual Design Principles'],
    complementarySkills: ['Frontend React', 'User Research & Personas', 'Animation & Motion'],
    quizQuestions: [
      {
        id: 'q_ui_1',
        question: 'What is the minimum contrast ratio required by WCAG 2.1 AA for normal body text against its background?',
        options: [
          '3:1',
          '4.5:1',
          '7:1',
          '10:1'
        ],
        correctIndex: 1,
        explanation: 'WCAG AA requires a 4.5:1 ratio for regular text and 3:1 for large text (18pt or 14pt bold).'
      },
      {
        id: 'q_ui_2',
        question: 'What is a "Design Token" in a modern design system?',
        options: [
          'A cryptocurrency used to buy Figma plugins',
          'A named entity storing visual attributes (color, spacing, font, radius) that bridges design and multi-platform code',
          'A physical badge awarded to designers',
          'A copyright watermark'
        ],
        correctIndex: 1,
        explanation: 'Design tokens are single sources of truth for design values like colors, font-sizes, and spacing across web and mobile.'
      },
      {
        id: 'q_ui_3',
        question: 'Why is an 8px base grid universally adopted in digital product design?',
        options: [
          'Because 8 is considered lucky',
          'Most screen resolutions are divisible by 8 or 4, scaling cleanly without subpixel blur across standard display densities (1x, 2x, 3x)',
          'It is required by browser vendors',
          'It restricts text sizes to 8px'
        ],
        correctIndex: 1,
        explanation: 'The 8pt grid scales gracefully across modern high-density screens and ensures harmonious spatial rhythm.'
      },
      {
        id: 'q_ui_4',
        question: 'In UX research, what is a "cognitive walkthrough"?',
        options: [
          'Walking around the campus while thinking',
          'A usability inspection method where evaluators step through action sequences to ensure first-time users can accomplish goals',
          'An eye-tracking hardware test',
          'A speed typing exam'
        ],
        correctIndex: 1,
        explanation: 'Cognitive walkthroughs evaluate learnability for new users step-by-step through specific task flows.'
      },
      {
        id: 'q_ui_5',
        question: 'What is the purpose of "Auto-Layout" in Figma?',
        options: [
          'Automatically deletes unused frames',
          'Creates responsive containers with dynamic padding, spacing, and flex alignment equivalent to CSS Flexbox',
          'Generates AI images',
          'Converts designs to PDF'
        ],
        correctIndex: 1,
        explanation: 'Auto-layout mimics CSS flexbox, allowing frames to adjust size dynamically as content or screen bounds change.'
      }
    ]
  },
  {
    id: 'sk_cloud',
    name: 'Cloud Infrastructure & DevOps (Docker, K8s, AWS)',
    category: 'Hardware & Systems',
    description: 'Containerization, Kubernetes orchestration, CI/CD pipelines, Terraform infrastructure-as-code, and cloud scalability.',
    iconName: 'Server',
    tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    demandCount: 96,
    supplyCount: 11,
    suggestedPrerequisites: ['Linux Shell', 'Networking Basics'],
    complementarySkills: ['Backend Node/Go', 'System Design', 'Cybersecurity'],
    quizQuestions: [
      {
        id: 'q_cl_1',
        question: 'What is the key difference between a Docker container and a Virtual Machine (VM)?',
        options: [
          'Containers include their own full guest OS kernel, whereas VMs share host kernel',
          'Containers share the host OS kernel and isolate processes at user space, making them lightweight and fast to boot',
          'VMs cannot run Linux',
          'Containers require dedicated physical hardware'
        ],
        correctIndex: 1,
        explanation: 'Containers virtualize at the operating system level, sharing the host kernel and consuming significantly fewer resources than VMs.'
      },
      {
        id: 'q_cl_2',
        question: 'In Kubernetes, what is a Pod?',
        options: [
          'A physical datacenter rack',
          'The smallest deployable unit of computing that can be created and managed, containing one or more containers with shared storage/network',
          'A command line flag in kubectl',
          'A DNS record'
        ],
        correctIndex: 1,
        explanation: 'A Pod wraps one or more tightly coupled containers sharing network IP, ports, and storage volumes.'
      },
      {
        id: 'q_cl_3',
        question: 'What does "Infrastructure as Code" (IaC) like Terraform enable?',
        options: [
          'Coding in HTML on servers',
          'Provisioning and managing cloud infrastructure through version-controlled, declarative configuration files instead of manual console clicks',
          'Disabling all server security firewalls',
          'Automated email sending'
        ],
        correctIndex: 1,
        explanation: 'IaC ensures repeatable, audited, and deterministic infrastructure deployment across development, staging, and production.'
      },
      {
        id: 'q_cl_4',
        question: 'What is the purpose of a Kubernetes Ingress controller?',
        options: [
          'To monitor CPU temperatures',
          'To manage external HTTP/HTTPS routing, SSL termination, and load balancing to internal cluster Services',
          'To compile source code into binaries',
          'To delete old pods'
        ],
        correctIndex: 1,
        explanation: 'Ingress exposes HTTP/HTTPS routes from outside the cluster to services within the cluster with rules-based routing.'
      },
      {
        id: 'q_cl_5',
        question: 'Why is multi-stage Docker build recommended for production images?',
        options: [
          'It makes images colorful',
          'It separates compilation/build tools from runtime binaries, resulting in dramatically smaller and more secure production images',
          'It forces containers to run in 32-bit mode',
          'It speeds up download speeds on 2G connections'
        ],
        correctIndex: 1,
        explanation: 'Multi-stage builds leave heavy build toolchains behind, packaging only runtime artifacts to minimize attack surface and image size.'
      }
    ]
  },
  {
    id: 'sk_dsa',
    name: 'Data Structures & Algorithms (Competitive & Interviews)',
    category: 'Software & AI',
    description: 'Dynamic programming, graphs (Dijkstra, BFS/DFS), trees, segment trees, asymptotic complexity, and high-speed problem solving.',
    iconName: 'Binary',
    tags: ['Algorithms', 'Data Structures', 'Dynamic Programming', 'Graph Theory', 'C++'],
    demandCount: 165,
    supplyCount: 42,
    suggestedPrerequisites: ['C++ or Java Programming'],
    complementarySkills: ['System Design', 'Mathematics', 'Competitive Coding'],
    quizQuestions: [
      {
        id: 'q_dsa_1',
        question: 'What is the time complexity of searching in a balanced Binary Search Tree with N nodes?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctIndex: 1,
        explanation: 'Each comparison halves the search space in a balanced tree, yielding logarithmic time.'
      },
      {
        id: 'q_dsa_2',
        question: 'Which algorithm finds single-source shortest paths in a graph with non-negative edge weights in O((V + E) log V) time?',
        options: ['Floyd-Warshall', 'Dijkstra with Priority Queue', 'Bellman-Ford', 'Kruskal'],
        correctIndex: 1,
        explanation: 'Dijkstra with a min-heap priority queue extracts minimum distances efficiently for non-negative weights.'
      },
      {
        id: 'q_dsa_3',
        question: 'What property must a problem possess to be solvable via Dynamic Programming?',
        options: [
          'Randomized structure and constant memory',
          'Optimal substructure and overlapping subproblems',
          'Greedy choice property only',
          'Linear recurrence with no branching'
        ],
        correctIndex: 1,
        explanation: 'Dynamic programming memoizes sub-solutions when a problem exhibits both optimal substructure and overlapping subproblems.'
      },
      {
        id: 'q_dsa_4',
        question: 'What data structure is optimal for implementing LRU (Least Recently Used) cache with O(1) get and put operations?',
        options: [
          'Array and Stack',
          'Hash Map combined with a Doubly Linked List',
          'Red-Black Tree',
          'Max-Heap'
        ],
        correctIndex: 1,
        explanation: 'Hash Map gives O(1) key lookup, while Doubly Linked List allows O(1) node removal and relocation to head.'
      },
      {
        id: 'q_dsa_5',
        question: 'What is the average and worst-case time complexity of QuickSort?',
        options: [
          'Average O(N log N), Worst O(N^2)',
          'Average O(N), Worst O(N log N)',
          'Average O(N^2), Worst O(N^2)',
          'Average O(log N), Worst O(N)'
        ],
        correctIndex: 0,
        explanation: 'QuickSort runs in O(N log N) average case, but degrades to O(N^2) if pivot selection creates unbalanced partitions.'
      }
    ]
  },
  {
    id: 'sk_case',
    name: 'Product Management & Case Interview Mastery',
    category: 'Business & Career',
    description: 'Product sense frameworks (CIRCLES), root cause analysis, go-to-market strategies, metrics teardowns, and campus placement prep.',
    iconName: 'Briefcase',
    tags: ['Product Management', 'Consulting', 'Case Interviews', 'Strategy', 'Analytics'],
    demandCount: 74,
    supplyCount: 8,
    suggestedPrerequisites: ['Business Fundamentals'],
    complementarySkills: ['UI/UX Design', 'Data Visualization', 'Public Speaking'],
    quizQuestions: [
      {
        id: 'q_pm_1',
        question: 'What does the "C" stand for in the CIRCLES product design framework?',
        options: ['Check budget', 'Comprehend the situation', 'Create wireframes', 'Contact stakeholders'],
        correctIndex: 1,
        explanation: 'Comprehend the situation is the first step: clarifying goals, constraints, context, and user ecosystem.'
      },
      {
        id: 'q_pm_2',
        question: 'What is the primary definition of a North Star Metric (NSM)?',
        options: [
          'Total registered email addresses',
          'The single key metric that best captures the core value your product delivers to its customers and drives sustainable growth',
          'Quarterly server costs',
          'Number of git commits per sprint'
        ],
        correctIndex: 1,
        explanation: 'A North Star Metric aligns product teams around the core customer value exchange.'
      },
      {
        id: 'q_pm_3',
        question: 'In A/B testing, what does a p-value < 0.05 signify?',
        options: [
          'The test was invalid',
          'There is less than 5% probability that the observed difference occurred by random chance under the null hypothesis (statistical significance)',
          '5% of users had an error',
          'Variant B generated 5% less revenue'
        ],
        correctIndex: 1,
        explanation: 'A p-value < 0.05 rejects the null hypothesis at standard 95% confidence.'
      },
      {
        id: 'q_pm_4',
        question: 'What is "Cannibalization" in product management?',
        options: [
          'When one feature or product eats into the market share, engagement, or revenue of another product within the same company',
          'Deleting customer accounts',
          'High employee turnover',
          'Server outage due to overload'
        ],
        correctIndex: 0,
        explanation: 'Cannibalization happens when a new launch pulls existing users away from an established product rather than gaining net-new users.'
      },
      {
        id: 'q_pm_5',
        question: 'What is the difference between leading and lagging indicators?',
        options: [
          'Leading indicators predict future outcomes (e.g. daily active study hours), while lagging indicators measure final results after the fact (e.g. graduation rate/churn)',
          'There is no difference',
          'Leading indicators are financial only',
          'Lagging indicators are measured in milliseconds'
        ],
        correctIndex: 0,
        explanation: 'Leading metrics provide early actionable signals before the lagging bottom-line results materialize.'
      }
    ]
  }
];

export const INITIAL_USER_SKILLS: UserSkill[] = [
  {
    id: 'usk_meera_aiml',
    userId: 'usr_meera',
    skillId: 'sk_aiml',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    category: 'Software & AI',
    level: 'Advanced',
    yearsExperience: 3,
    description: 'Specializing in fine-tuning open-source LLMs, LoRA adapters, and multi-modal vision transformers. Hands-on coding in Colab/Jupyter.',
    tokenPricePerHour: 20,
    isVerified: true,
    verificationScore: 100,
    verifiedAt: '2025-09-01',
    tags: ['PyTorch', 'Transformers', 'LLMs', 'HuggingFace', 'CUDA'],
    totalSessionsTaught: 54,
    rating: 4.98
  },
  {
    id: 'usk_aarav_react',
    userId: 'usr_aarav',
    skillId: 'sk_react',
    skillName: 'Modern React, Next.js & TypeScript',
    category: 'Software & AI',
    level: 'Intermediate',
    yearsExperience: 2,
    description: 'Building snappy reactive applications with Tailwind CSS, Zustand, custom hooks, and server components. Clear step-by-step mentoring.',
    tokenPricePerHour: 15,
    isVerified: true,
    verificationScore: 92,
    verifiedAt: '2026-02-14',
    tags: ['React', 'Next.js', 'TailwindCSS', 'TypeScript', 'Zustand'],
    totalSessionsTaught: 12,
    rating: 4.8
  },
  {
    id: 'usk_rohan_uiux',
    userId: 'usr_rohan',
    skillId: 'sk_uiux',
    skillName: 'UI/UX & Design Systems (Figma & Tokens)',
    category: 'Design & UX',
    level: 'Advanced',
    yearsExperience: 3,
    description: 'Expert in Figma variables, auto-layout 5.0, dark mode tokens, and design-to-code component pipelines.',
    tokenPricePerHour: 18,
    isVerified: true,
    verificationScore: 96,
    verifiedAt: '2025-10-15',
    tags: ['Figma', 'Design Systems', 'Design Tokens', 'Prototyping', 'Accessibility'],
    totalSessionsTaught: 28,
    rating: 4.88
  },
  {
    id: 'usk_priya_cloud',
    userId: 'usr_priya',
    skillId: 'sk_cloud',
    skillName: 'Cloud Infrastructure & DevOps (Docker, K8s, AWS)',
    category: 'Hardware & Systems',
    level: 'Advanced',
    yearsExperience: 3,
    description: 'Certified Kubernetes Administrator. Teaching microservices architecture, Dockerizing fullstack apps, and AWS ECS/EKS deployment.',
    tokenPricePerHour: 22,
    isVerified: true,
    verificationScore: 98,
    verifiedAt: '2025-08-25',
    tags: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    totalSessionsTaught: 36,
    rating: 4.94
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_1',
    userId: 'usr_meera',
    userSkillId: 'usk_meera_aiml',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    title: 'Deep Learning Specialization - DeepLearning.AI',
    issuer: 'Coursera & Andrew Ng',
    issueDate: '2025-06-15',
    fileUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80',
    fileType: 'image',
    status: 'Verified',
    reviewedBy: 'Dean Vikram Rao',
    reviewedAt: '2025-08-22'
  },
  {
    id: 'cert_2',
    userId: 'usr_priya',
    userSkillId: 'usk_priya_cloud',
    skillName: 'Cloud Infrastructure & DevOps (Docker, K8s, AWS)',
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'The Linux Foundation & CNCF',
    issueDate: '2025-07-10',
    fileUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    fileType: 'image',
    status: 'Verified',
    reviewedBy: 'Dean Vikram Rao',
    reviewedAt: '2025-08-28'
  },
  {
    id: 'cert_3',
    userId: 'usr_aarav',
    userSkillId: 'usk_aarav_react',
    skillName: 'Modern React, Next.js & TypeScript',
    title: 'Advanced React & Architecture Certification',
    issuer: 'Frontend Masters',
    issueDate: '2026-01-20',
    fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    fileType: 'image',
    status: 'Pending',
  }
];

export const INITIAL_SESSION_REQUESTS: SessionRequest[] = [
  {
    id: 'req_101',
    learnerId: 'usr_aarav',
    learnerName: 'Aarav Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    teacherId: 'usr_meera',
    teacherName: 'Meera Patel',
    teacherAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    skillId: 'sk_aiml',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    topic: 'Fine-tuning Llama-3 with QLoRA on Custom Campus Data',
    goal: 'Understand quantizing weights, setting LoRA rank/alpha, and saving adapters.',
    requestedDate: '2026-10-02',
    requestedTime: '17:00 - 18:00',
    tokenPrice: 20,
    status: 'accepted',
    message: 'Hi Meera! I am working on my minor project and need hands-on help setting up PEFT and BitsAndBytes in PyTorch.',
    counterRounds: [],
    maxRounds: 3,
    createdAt: '2026-09-30T10:00:00Z',
    updatedAt: '2026-09-30T11:30:00Z',
    confirmedSlot: {
      date: '2026-10-02',
      startTime: '17:00',
      endTime: '18:00'
    }
  },
  {
    id: 'req_102',
    learnerId: 'usr_aarav',
    learnerName: 'Aarav Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    teacherId: 'usr_rohan',
    teacherName: 'Rohan Gupta',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    skillId: 'sk_uiux',
    skillName: 'UI/UX & Design Systems (Figma & Tokens)',
    topic: 'Nike-Inspired Athletic Editorial Design System Review',
    goal: 'Review our high-contrast component library, Bebas Neue typography scale, and focus rings.',
    requestedDate: '2026-10-03',
    requestedTime: '15:00 - 16:00',
    tokenPrice: 18,
    status: 'pending_learner_counter',
    message: 'Hey Rohan, would love a critique of our dark/light tokens and pill geometry adherence.',
    counterRounds: [
      {
        proposedBy: 'usr_rohan',
        tokenPrice: 16,
        proposedDate: '2026-10-03',
        proposedTime: '16:00 - 17:00',
        note: 'I have lab until 15:30. How about 16:00, and I will discount 2 tokens for the shift?',
        timestamp: '2026-09-30T14:20:00Z'
      }
    ],
    maxRounds: 3,
    createdAt: '2026-09-30T12:00:00Z',
    updatedAt: '2026-09-30T14:20:00Z'
  }
];

export const INITIAL_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'sess_live_1',
    requestId: 'req_101',
    teacherId: 'usr_meera',
    teacherName: 'Meera Patel',
    teacherAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    learnerId: 'usr_aarav',
    learnerName: 'Aarav Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    topic: 'Fine-tuning Llama-3 with QLoRA on Custom Campus Data',
    tokenAmount: 20,
    scheduledStartTime: '2026-10-02T17:00:00Z',
    scheduledEndTime: '2026-10-02T18:00:00Z',
    durationMinutes: 60,
    status: 'upcoming',
    escrowStatus: 'Held',
    learnerJoined: false,
    teacherJoined: false,
    recordingEnabled: false,
    whiteboardNotes: 'Agenda: 1. Setup bitsandbytes 4-bit 2. LoRA target modules 3. SFTTrainer loss curve review'
  }
];

export const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'ws_1',
    teacherId: 'usr_meera',
    teacherName: 'Meera Patel',
    teacherAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    teacherDepartment: 'Computer Science & Engineering',
    title: 'BUILDING PRODUCTION LLM AGENTS WITH RAG & PYTORCH',
    description: 'A 2-hour intensive deep-dive workshop covering vector embeddings, hybrid retrieval, agentic tool-use loops, and real-time evaluation.',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    category: 'Software & AI',
    date: '2026-10-04',
    startTime: '16:00',
    durationMinutes: 120,
    capacity: 35,
    enrolledCount: 28,
    tokenPricePerPerson: 10,
    status: 'upcoming',
    agenda: [
      '16:00 - 16:30: Vector DB architectures (Chroma vs Qdrant)',
      '16:30 - 17:15: Building custom retriever & re-ranking pipelines',
      '17:15 - 17:45: ReAct prompting & function calling in PyTorch',
      '17:45 - 18:00: Live Q&A and Colab Repo Handout'
    ],
    attendees: [
      { userId: 'usr_aarav', userName: 'Aarav Sharma', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', joinedAt: '2026-09-28' },
      { userId: 'usr_rohan', userName: 'Rohan Gupta', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', joinedAt: '2026-09-29' }
    ],
    qaItems: [
      { id: 'qa_1', userId: 'usr_aarav', userName: 'Aarav', question: 'Will we cover local Ollama integration vs OpenAI API?', upvotes: 7, isAnswered: true, timestamp: '16:10' },
      { id: 'qa_2', userId: 'usr_rohan', userName: 'Rohan', question: 'What is the minimum GPU VRAM required for the demo notebooks?', upvotes: 12, isAnswered: false, timestamp: '16:25' }
    ]
  },
  {
    id: 'ws_2',
    teacherId: 'usr_rohan',
    teacherName: 'Rohan Gupta',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    teacherDepartment: 'Design & Human-Computer Interaction',
    title: 'DESIGN SYSTEMS AT SCALE: TOKENS, ACCESSIBILITY & FIGMA',
    description: 'Learn how modern tech giants architect multi-brand token structures, WCAG AAA compliance, and zero-drop-shadow editorial aesthetic.',
    skillName: 'UI/UX & Design Systems (Figma & Tokens)',
    category: 'Design & UX',
    date: '2026-10-06',
    startTime: '18:00',
    durationMinutes: 90,
    capacity: 40,
    enrolledCount: 34,
    tokenPricePerPerson: 8,
    status: 'upcoming',
    agenda: [
      '18:00 - 18:25: Design token taxonomies & naming semantics',
      '18:25 - 18:55: Figma auto-layout 5.0 masterclass',
      '18:55 - 19:20: Automated token export to Tailwind CSS',
      '19:20 - 19:30: Live critique of student portfolios'
    ],
    attendees: [
      { userId: 'usr_aarav', userName: 'Aarav Sharma', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', joinedAt: '2026-09-29' }
    ],
    qaItems: []
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participantIds: ['usr_aarav', 'usr_meera'],
    participantDetails: [
      { id: 'usr_aarav', name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', department: 'Computer Science & Engineering' },
      { id: 'usr_meera', name: 'Meera Patel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', department: 'Computer Science & Engineering' }
    ],
    lastMessage: 'Awesome, see you on Friday at 17:00! Make sure your PyTorch CUDA environment is set up.',
    lastMessageTimestamp: '2026-09-30T11:35:00Z',
    unreadCount: 0,
    relatedRequestId: 'req_101'
  },
  {
    id: 'conv_2',
    participantIds: ['usr_aarav', 'usr_rohan'],
    participantDetails: [
      { id: 'usr_aarav', name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', department: 'Computer Science & Engineering' },
      { id: 'usr_rohan', name: 'Rohan Gupta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', department: 'Design & Human-Computer Interaction' }
    ],
    lastMessage: 'I sent a counter-offer for 16:00 with a 2-token discount. Let me know if that works!',
    lastMessageTimestamp: '2026-09-30T14:21:00Z',
    unreadCount: 1,
    relatedRequestId: 'req_102'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'usr_aarav',
    senderName: 'Aarav Sharma',
    receiverId: 'usr_meera',
    text: 'Hi Meera! I sent a request for the QLoRA fine-tuning session. Excited to learn from your research work.',
    timestamp: '2026-09-30T10:02:00Z',
    isRead: true
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'usr_meera',
    senderName: 'Meera Patel',
    receiverId: 'usr_aarav',
    text: 'Hey Aarav, glad to help! I just accepted your request. Tokens are in escrow and the slot is booked in our calendars.',
    timestamp: '2026-09-30T11:31:00Z',
    isRead: true
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'usr_meera',
    senderName: 'Meera Patel',
    receiverId: 'usr_aarav',
    text: 'Awesome, see you on Friday at 17:00! Make sure your PyTorch CUDA environment is set up.',
    timestamp: '2026-09-30T11:35:00Z',
    isRead: true
  },
  {
    id: 'msg_4',
    conversationId: 'conv_2',
    senderId: 'usr_rohan',
    senderName: 'Rohan Gupta',
    receiverId: 'usr_aarav',
    text: 'I sent a counter-offer for 16:00 with a 2-token discount. Let me know if that works!',
    timestamp: '2026-09-30T14:21:00Z',
    isRead: false
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    userId: 'usr_aarav',
    type: 'WELCOME_GRANT',
    amount: 50,
    balanceAfter: 50,
    description: 'Campus Onboarding Welcome Grant (PRD 3.1)',
    timestamp: '2026-01-15T08:00:00Z',
    status: 'SUCCESS'
  },
  {
    id: 'tx_2',
    userId: 'usr_aarav',
    type: 'SESSION_ESCROW_RELEASE',
    amount: 30,
    balanceAfter: 80,
    description: 'Teaching: React Component Architecture (2 hrs) to Priya',
    timestamp: '2026-02-18T19:00:00Z',
    status: 'SUCCESS'
  },
  {
    id: 'tx_3',
    userId: 'usr_aarav',
    type: 'KARMA_BONUS',
    amount: 15,
    balanceAfter: 95,
    description: 'Karma Tier Bonus: Passed React Verification Quiz with 92%',
    timestamp: '2026-02-20T12:00:00Z',
    status: 'SUCCESS'
  },
  {
    id: 'tx_4',
    userId: 'usr_aarav',
    type: 'SESSION_ESCROW_RELEASE',
    amount: 45,
    balanceAfter: 140,
    description: 'Teaching: Full-Stack Next.js 14 Workshop (3 students)',
    timestamp: '2026-03-10T18:30:00Z',
    status: 'SUCCESS'
  },
  {
    id: 'tx_5',
    userId: 'usr_aarav',
    type: 'SESSION_ESCROW_HOLD',
    amount: -20,
    balanceAfter: 120,
    description: 'Escrow Lock: Upcoming PyTorch session with Meera Patel (Req #req_101)',
    timestamp: '2026-09-30T11:30:00Z',
    status: 'PENDING'
  },
  {
    id: 'tx_6',
    userId: 'usr_aarav',
    type: 'WORKSHOP_REGISTRATION',
    amount: -10,
    balanceAfter: 110,
    description: 'Enrolled in Workshop: LLM Agents with RAG by Meera Patel',
    timestamp: '2026-09-28T14:00:00Z',
    status: 'SUCCESS'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    userId: 'usr_aarav',
    title: 'Master Transformer Fine-Tuning & Deploy Custom Campus Assistant',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    targetDate: '2026-11-15',
    progressPercent: 60,
    createdAt: '2026-09-10',
    milestones: [
      { id: 'm1', title: 'Complete PyTorch Autograd & Backprop refresh', completed: true, targetDate: '2026-09-15', completedAt: '2026-09-14', karmaReward: 25 },
      { id: 'm2', title: 'Pass SkillSwap AI/ML Verification Quiz', completed: true, targetDate: '2026-09-22', completedAt: '2026-09-20', karmaReward: 50 },
      { id: 'm3', title: 'Attend 1:1 QLoRA session with Meera Patel', completed: false, targetDate: '2026-10-02', karmaReward: 30 },
      { id: 'm4', title: 'Host a student peer demo of the deployed model', completed: false, targetDate: '2026-11-10', karmaReward: 60 }
    ]
  },
  {
    id: 'goal_2',
    userId: 'usr_aarav',
    title: 'Achieve WCAG AAA Accessibility in Design Systems',
    skillName: 'UI/UX & Design Systems (Figma & Tokens)',
    targetDate: '2026-10-25',
    progressPercent: 33,
    createdAt: '2026-09-15',
    milestones: [
      { id: 'm5', title: 'Audit contrast ratios with 4.5:1 / 7:1 scale', completed: true, targetDate: '2026-09-25', completedAt: '2026-09-24', karmaReward: 20 },
      { id: 'm6', title: 'Design system review session with Rohan Gupta', completed: false, targetDate: '2026-10-03', karmaReward: 25 },
      { id: 'm7', title: 'Publish campus accessibility token library', completed: false, targetDate: '2026-10-20', karmaReward: 40 }
    ]
  }
];

export const INITIAL_STUDY_LOGS: StudyLog[] = [
  { id: 'sl_1', userId: 'usr_aarav', skillName: 'Modern React, Next.js & TypeScript', durationMinutes: 120, date: '2026-09-25', type: 'session_taught', notes: 'Taught custom hooks & performance' },
  { id: 'sl_2', userId: 'usr_aarav', skillName: 'AI & Machine Learning (PyTorch & Transformers)', durationMinutes: 90, date: '2026-09-26', type: 'self_pomodoro', notes: 'Read attention is all you need paper' },
  { id: 'sl_3', userId: 'usr_aarav', skillName: 'UI/UX & Design Systems (Figma & Tokens)', durationMinutes: 60, date: '2026-09-27', type: 'self_pomodoro', notes: 'Built concentric swatch dot library' },
  { id: 'sl_4', userId: 'usr_aarav', skillName: 'AI & Machine Learning (PyTorch & Transformers)', durationMinutes: 150, date: '2026-09-28', type: 'self_pomodoro', notes: 'Implemented forward pass of multihead attention' },
  { id: 'sl_5', userId: 'usr_aarav', skillName: 'Cloud Infrastructure & DevOps (Docker, K8s, AWS)', durationMinutes: 60, date: '2026-09-29', type: 'session_learned', notes: 'Learned Docker multi-stage builds from Priya' },
  { id: 'sl_6', userId: 'usr_aarav', skillName: 'AI & Machine Learning (PyTorch & Transformers)', durationMinutes: 90, date: '2026-09-30', type: 'self_pomodoro', notes: 'Fine-tuning tokenizer and vocabulary' }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_aarav',
    type: 'request_accepted',
    title: 'Session Confirmed with Meera Patel',
    message: 'Meera accepted your session on Llama-3 QLoRA for Friday 17:00. 20 tokens held in escrow.',
    timestamp: '2026-09-30T11:31:00Z',
    isRead: false,
    actionUrl: '/sessions/sess_live_1'
  },
  {
    id: 'notif_2',
    userId: 'usr_aarav',
    type: 'request_countered',
    title: 'Counter-Offer Received from Rohan Gupta',
    message: 'Rohan proposed 16:00 - 17:00 at 16 tokens/hr (2 token discount).',
    timestamp: '2026-09-30T14:20:00Z',
    isRead: false,
    actionUrl: '/requests'
  },
  {
    id: 'notif_3',
    userId: 'usr_aarav',
    type: 'milestone_achieved',
    title: '+50 Karma Earned!',
    message: 'Congratulations! You completed the milestone "Pass SkillSwap AI/ML Verification Quiz".',
    timestamp: '2026-09-20T12:00:00Z',
    isRead: true
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'usr_meera',
    userName: 'Meera Patel',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    topSkill: 'AI & Machine Learning',
    karma: 1850,
    sessionsTaught: 68,
    rating: 4.95,
    verifiedSkillsCount: 3,
    change: 'same'
  },
  {
    rank: 2,
    userId: 'usr_priya',
    userName: 'Priya Verma',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    topSkill: 'Cloud & DevOps (K8s/AWS)',
    karma: 1240,
    sessionsTaught: 42,
    rating: 4.92,
    verifiedSkillsCount: 2,
    change: 'up'
  },
  {
    rank: 3,
    userId: 'usr_rohan',
    userName: 'Rohan Gupta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    department: 'Design & Human-Computer Interaction',
    topSkill: 'UI/UX & Design Systems',
    karma: 980,
    sessionsTaught: 31,
    rating: 4.85,
    verifiedSkillsCount: 2,
    change: 'same'
  },
  {
    rank: 4,
    userId: 'usr_aarav',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    topSkill: 'Modern React & Next.js',
    karma: 420,
    sessionsTaught: 14,
    rating: 4.80,
    verifiedSkillsCount: 1,
    change: 'up'
  }
];

export const INITIAL_SKILL_GAPS: SkillGapData[] = [
  {
    skillId: 'sk_aiml',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    department: 'Computer Science & Engineering',
    demandSearchesAndRequests: 320,
    supplyTeachers: 6,
    availableHoursPerWeek: 24,
    gapIndex: 2.22,
    status: 'Critical Gap',
    actionRecommendation: 'High Deficit. Faculty to organize departmental hackathon and award starter karma grants to senior ML researchers.'
  },
  {
    skillId: 'sk_cloud',
    skillName: 'Cloud Infrastructure & DevOps (Docker, K8s, AWS)',
    department: 'Computer Science & Engineering',
    demandSearchesAndRequests: 210,
    supplyTeachers: 5,
    availableHoursPerWeek: 20,
    gapIndex: 2.10,
    status: 'Critical Gap',
    actionRecommendation: 'Schedule faculty-supported CKA certification workshop to increase peer mentor supply.'
  },
  {
    skillId: 'sk_uiux',
    skillName: 'UI/UX & Design Systems (Figma & Tokens)',
    department: 'Design & Human-Computer Interaction',
    demandSearchesAndRequests: 140,
    supplyTeachers: 8,
    availableHoursPerWeek: 35,
    gapIndex: 0.50,
    status: 'Balanced',
    actionRecommendation: 'Healthy balance. Cross-promote design reviews with Computer Science students building capstone projects.'
  },
  {
    skillId: 'sk_react',
    skillName: 'Modern React, Next.js & TypeScript',
    department: 'Computer Science & Engineering',
    demandSearchesAndRequests: 180,
    supplyTeachers: 14,
    availableHoursPerWeek: 60,
    gapIndex: 0.21,
    status: 'Surplus',
    actionRecommendation: 'Strong student mentor supply. Encourage teachers to run group workshops to scale hours.'
  },
  {
    skillId: 'sk_case',
    skillName: 'Product Management & Case Interview Mastery',
    department: 'Business & Management',
    demandSearchesAndRequests: 195,
    supplyTeachers: 4,
    availableHoursPerWeek: 16,
    gapIndex: 3.04,
    status: 'Critical Gap',
    actionRecommendation: 'High unfulfilled demand during campus placement season. Invite alumni to run mentor mock case interviews.'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    sessionId: 'sess_past_44',
    openedByUserId: 'usr_aarav',
    openedByUserName: 'Aarav Sharma',
    againstUserId: 'usr_external',
    againstUserName: 'Dev K.',
    skillName: 'Advanced Golang Concurrency',
    tokenAmount: 25,
    reason: 'Teacher disconnected after 10 minutes and never rejoined',
    evidenceText: 'Session was scheduled for 60 minutes. Teacher left at 10:12 AM due to audio issues and did not return. Requesting full escrow refund.',
    status: 'Under_Review',
    createdAt: '2026-09-27T10:30:00Z',
    resolutionNote: 'Admin checking WebRTC presence logs.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    sessionId: 'sess_past_1',
    teacherId: 'usr_meera',
    learnerId: 'usr_aarav',
    learnerName: 'Aarav Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skillName: 'AI & Machine Learning (PyTorch & Transformers)',
    rating: 5,
    feedback: 'Meera explained attention matrices and multi-head projection with unmatched clarity! We built a mini-GPT in 1 hour. Worth every single token.',
    createdAt: '2026-09-18'
  },
  {
    id: 'rev_2',
    sessionId: 'sess_past_2',
    teacherId: 'usr_rohan',
    learnerId: 'usr_aarav',
    learnerName: 'Aarav Sharma',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skillName: 'UI/UX & Design Systems (Figma & Tokens)',
    rating: 5,
    feedback: 'Rohan tore down our design system and showed how to set up token alias variables. Invaluable session.',
    createdAt: '2026-09-22'
  }
];
