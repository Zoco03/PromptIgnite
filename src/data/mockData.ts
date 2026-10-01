import { 
  User, Skill, UserSkill, Certificate, SessionRequest, 
  LiveSession, Workshop, Conversation, Message, Transaction, 
  Goal, StudyLog, Notification, LeaderboardEntry, SkillGapData, Dispute, Review
} from '../types';

// Real-world clean initial state: No fake users.
// Users register their own accounts and interact in real-time.
export const INITIAL_USERS: User[] = [];
export const INITIAL_USER_SKILLS: UserSkill[] = [];
export const INITIAL_CERTIFICATES: Certificate[] = [];
export const INITIAL_REQUESTS: SessionRequest[] = [];
export const INITIAL_LIVE_SESSIONS: LiveSession[] = [];
export const INITIAL_WORKSHOPS: Workshop[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];
export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_GOALS: Goal[] = [];
export const INITIAL_STUDY_LOGS: StudyLog[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_DISPUTES: Dispute[] = [];
export const INITIAL_REVIEWS: Review[] = [];

// University Skill Curriculum & Assessment Quiz Bank
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

export const INITIAL_SKILL_GAPS: SkillGapData[] = [
  {
    skillId: 'sk_aiml',
    skillName: 'AI & Machine Learning',
    department: 'Computer Science & Engineering',
    demandSearchesAndRequests: 142,
    supplyTeachers: 18,
    availableHoursPerWeek: 45,
    gapIndex: 3.15,
    status: 'Critical Gap',
    actionRecommendation: 'Launch incentivized peer instructor cohort for Transformers & LLM fine-tuning.'
  },
  {
    skillId: 'sk_cloud',
    skillName: 'Cloud Infrastructure & DevOps',
    department: 'Computer Science & Engineering',
    demandSearchesAndRequests: 96,
    supplyTeachers: 11,
    availableHoursPerWeek: 28,
    gapIndex: 2.85,
    status: 'Deficit',
    actionRecommendation: 'Offer bonus tokens for verified Kubernetes & Docker peer tutors.'
  },
  {
    skillId: 'sk_uiux',
    skillName: 'UI/UX & Design Systems',
    department: 'Design & Human-Computer Interaction',
    demandSearchesAndRequests: 88,
    supplyTeachers: 14,
    availableHoursPerWeek: 35,
    gapIndex: 1.82,
    status: 'Balanced',
    actionRecommendation: 'Maintain steady peer workshop cadence and design critique pods.'
  },
  {
    skillId: 'sk_dsa',
    skillName: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    demandSearchesAndRequests: 165,
    supplyTeachers: 42,
    availableHoursPerWeek: 120,
    gapIndex: 0.98,
    status: 'Surplus',
    actionRecommendation: 'Encourage senior problem solvers to branch into Distributed Systems.'
  }
];
