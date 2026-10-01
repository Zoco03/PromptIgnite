# SkillSwap: Student Skill Exchange Platform

**Product Requirements Document (PRD) v1.0**

> **Design rule (binding):** All UI, UX, visual styling, components, spacing, typography, color, motion and accessibility must follow **`design.md`**. This PRD defines *what* to build; `design.md` defines *how it looks and feels*. If the two conflict on visual matters, `design.md` wins. If `design.md` is silent on a component, extend its existing tokens and patterns rather than inventing new ones. *Note: `design.md` was not attached when this PRD was written, so no specific tokens are quoted here. Section 10 lists what to map once it is available.*

---

## 1. Overview

### 1.1 Vision

A campus-only peer-to-peer learning marketplace where students teach what they know, learn what they need, and pay each other in a **token economy** instead of money.

### 1.2 Problem

- Students have valuable skills but no structured way to share them.
- Finding a trustworthy peer tutor is hard; there is no proof of skill.
- Departments lack data on which skills are missing or trending.

### 1.3 Goals

1. Let any student discover a verified peer teacher for a skill within minutes.
2. Make teaching rewarding (tokens, karma, leaderboard, portfolio).
3. Give students and departments insight (impact, velocity, skill gaps).

### 1.4 Success Metrics

| Metric | Target (first semester) |
| --- | --- |
| Registered students / campus | 40% of enrolled |
| Request → accepted rate | > 60% |
| Accepted → completed sessions | > 80% |
| Avg. session rating | ≥ 4.3 / 5 |
| Weekly active learners | 25% of registered |
| Median time from search to booked session | \< 24 hours |

### 1.5 Personas

- **Learner (Aarav):** wants to learn AI/ML, searches, compares teachers, books, pays tokens.
- **Teacher (Meera):** lists skills, sets token price, accepts requests, runs sessions and workshops, builds portfolio.
- **Department Admin / Faculty:** views skill gap and trending dashboards.
- **Platform Admin:** moderation, verification content, token and fraud control.

*A student is both learner and teacher with one account.*

---

## 2. Scope

**In scope (v1):** everything in Section 3. **Out of scope (v1):** real-money payments or withdrawals, cross-campus access, native mobile apps (responsive web first), recorded-session storage, AI tutoring.

---

## 3. Features & Requirements

Priority: **P0** = launch blocker, **P1** = launch target, **P2** = post-launch.

### 3.1 Authentication & Onboarding (P0)

- Register with college email (domain-verified), password or Google/Microsoft SSO; email OTP verification.
- Collect: name, department, year, bio, profile photo, time zone.
- Login, logout, forgot/reset password, session management with JWT refresh.
- Welcome grant of starter tokens (e.g., 50) to bootstrap learning.

### 3.2 Skill Profile (P0)

- Add skills with: name, category, level (Beginner/Intermediate/Advanced), years of experience, description, tags, token price per hour.
- **Verification challenge (P0):** before a skill goes live, the student completes a short quiz (5–10 MCQ/practical questions, pass mark e.g. 70%) from a question bank for that skill. Failed attempts have a cooldown (24h). Skills without a bank use peer or admin review.
- A "Verified" badge appears on passed skills.
- Edit, pause or remove skills at any time.

### 3.3 Certificates & Media Upload (P0)

- Upload certificates (PDF/JPG/PNG, max 10 MB), linked to a skill, with title, issuer, date.
- Certificate states: Pending → Verified / Rejected (admin or issuer-link check).
- Image upload for profile, portfolio, and chat (compressed, virus-scanned).

### 3.4 Automated Portfolio (P0)

- Auto-generated public (campus-visible) page per student from: bio, verified skills, certificates, sessions taught, ratings, learning impact, karma, leaderboard rank, badges, goals completed.
- Updates automatically; student can toggle sections on/off and pick a featured skill.
- Shareable link, plus PDF export (P2).

### 3.5 Search & Teacher Discovery (P0)

- Search by skill, topic, department, availability, price range, rating.
- **Example:** searching "AI ML" returns a ranked list of teachers.
- **Ranking score** (weights configurable):

| Signal | Weight |
| --- | --- |
| Skill verification + quiz score | 25% |
| Rating in *that* skill | 25% |
| Experience (years, sessions taught on that topic) | 20% |
| Leaderboard / karma | 15% |
| Certificates relevant to the skill | 10% |
| Response rate and availability fit | 5% |

- Each result card shows: photo, name, department, matched skill + level, rating, sessions taught, price, next free slot, Verified badge.
- Filters and sort: Best match (default), Price, Rating, Soonest available.
- Clicking opens the portfolio with a "Request Session" button.

### 3.6 Session Request, Negotiation & Booking (P0)

1. Learner sends a request: skill/topic, goal, preferred slots, message, offered tokens.
2. **Negotiation (P1):** teacher can accept, reject (with reason), or counter-offer price/slot. Max 3 counter rounds, then the request auto-expires after 48h.
3. On acceptance, a **specific slot** is confirmed from the teacher's availability and added to both calendars.
4. Tokens are **held in escrow** at booking.
5. Reminders (in-app + email) at 24h and 15 min before.
6. Cancel/reschedule rules: free until 12h before; after that a penalty (partial token loss/karma deduction).

### 3.7 Live Session Screen (P0)

- Built-in video/audio call (WebRTC via provider), screen share, shared whiteboard (P1), in-session chat, file/image sharing.
- Join window opens 5 minutes before the slot.
- **Session timer:** starts when both join; shows elapsed and remaining time; auto-end warning.
- **Token flow:** on completion, escrowed tokens release to the teacher (prorated if ended early). Learner confirms completion and rates; a dispute button freezes release for admin review.
- **Workshop mode (P1):** teacher creates a group session with capacity (e.g., 30), per-head token price, agenda and description. Multiple students join via listing or invite link. Features: raise hand, Q&A panel, mute controls, attendance log, group rating.

### 3.8 Messaging (P0)

- 1:1 chat between students, with text, images, and links; real-time delivery, read receipts, unread badges.
- Chat opens only after a request exists, to limit spam.
- Report/block user; basic profanity filter.

### 3.9 Calendar & Availability Grid (P0)

- Weekly grid where teachers mark recurring and one-off available slots (30-min blocks).
- Calendar shows booked sessions, workshops, study blocks and goal deadlines.
- Learners see only free slots when booking; time-zone aware.
- Sync export via .ics / Google Calendar (P1).

### 3.10 Study Time & Session Tracker (P1)

- Personal study timer (start/stop/Pomodoro) tagged to a skill.
- Auto-logs live-session time (as learner or teacher).
- Weekly and monthly charts of hours learned vs taught.

### 3.11 Learning Goals & Milestones (P1)

- Create a goal (e.g., "Learn ML basics in 8 weeks") with milestones, target date, and linked skill.
- Check off milestones; progress bar; milestone completion grants karma.
- Teacher can suggest milestones after a session.

### 3.12 Credit / Token Economy (P0)

- Each student has a wallet with balance, escrow, and transaction history.
- Earn: teaching sessions, workshops, challenge bonuses, referral, streaks.
- Spend: booking sessions, joining workshops.
- Pricing: teacher sets tokens/hour per skill (guard rails: min/max range per level set by admin).
- Negotiation per 3.6; final agreed price is locked at booking.
- Ledger is append-only and idempotent; no negative balances; no transfers outside sessions in v1.
- Anti-abuse: daily earning cap, collusion detection (repeated A↔B swaps), admin adjustment log.

### 3.13 Leaderboards & Karma (P1)

- Karma points for: completed sessions, good ratings, workshops, verified skills, goals, helpful responses; deductions for no-shows, late cancels, reports.
- Leaderboards: Overall, per Skill, per Department, Weekly/All-time.
- Rank and badges feed into search ranking (3.5) and the portfolio (3.4).

### 3.14 Personalized Dashboard (P0)

- Widgets: wallet balance, upcoming sessions, pending requests, goals progress, study hours, learning velocity, karma/rank, recommended teachers, complementary skills, trending skills.
- Role-aware: surfaces teaching earnings and incoming requests for teachers.

### 3.15 Recommendations & Insights (P1)

- **Complementary skills:** suggestions based on the student's skills and goals (e.g., Python → Statistics, Data Viz) using a skill-relationship graph and co-learning data.
- **Learning impact:** hours taught, hours learned, skills shared, students helped, tokens earned.
- **Personal learning velocity:** hours/week, milestones/week, skill-level progression trend vs. own history.
- **Trending skills on campus:** most-searched and most-booked skills over 7/30 days.

### 3.16 Department-Level Skill Gap Analysis (P1)

- For admins/faculty: compare **demand** (searches, requests) vs **supply** (verified teachers, availability) per skill and department.
- Outputs: gap heat map, top under-supplied skills, suggested workshops or faculty actions, CSV export.
- Only aggregated, anonymized data is shown.

### 3.17 Notifications (P0)

In-app + email (push P2): request received/accepted/rejected/countered, reminders, token changes, messages, goal nudges.

### 3.18 Admin Console (P0)

User management, certificate review, question bank management, dispute resolution, token adjustments, reports/moderation queue, analytics, feature flags.

---

## 4. Key User Flows

### 4.1 Learner: find and learn a skill

```
Sign up → Verify email → Complete profile → Dashboard
→ Search "AI ML" → Ranked teachers list (leaderboard + experience + rating)
→ Open teacher portfolio → Request session (topic, slots, token offer)
→ Teacher: Accept / Reject / Counter
   ├─ Reject → learner notified, tokens untouched → search again
   ├─ Counter → learner accepts/declines
   └─ Accept → slot confirmed → tokens escrowed → calendar updated
→ Reminders → Join live session (timer running)
→ Session ends → learner confirms + rates → tokens released to teacher
→ Karma, impact and velocity updated → Next-skill suggestion
```

### 4.2 Teacher: list a skill and earn

```
Login → Add skill → Take verification challenge → Pass
→ Set token price + upload certificates → Set availability grid
→ Portfolio auto-generated → Appears in search
→ Receive request → Accept/Reject/Counter → Teach → Earn tokens + karma
→ Climb leaderboard → Better search rank
```

### 4.3 Workshop

```
Teacher: Create workshop (topic, date, capacity, price) → Publish
→ Students browse/join (tokens held) → Workshop starts
→ Multi-user live room (Q&A, raise hand) → End → tokens released
→ Attendees rate → Karma and impact updated
```

### 4.4 Department admin

```
Login → Skill Gap dashboard → Filter department/time
→ See demand vs supply → Export or plan workshop
```

---

## 5. Information Architecture (Screens)

Landing · Register/Login · Onboarding · Dashboard · Search & Results · Portfolio (own/public) · Skill Manager & Verification Challenge · Certificates · Requests (incoming/outgoing) · Booking & Negotiation · Calendar & Availability · Live Session Room · Workshop Listing/Create/Room · Messages · Wallet & Transactions · Goals & Milestones · Study Tracker · Leaderboards · Insights (impact, velocity, trending) · Notifications · Settings · Admin and Department Analytics.

---

## 6. Tech Stack (Recommended)

| Layer | Choice | Reason |
| --- | --- | --- |
| Frontend | Next.js (React) + TypeScript, Tailwind CSS, shadcn/ui; design tokens mapped from `design.md` | SSR for portfolio pages, rapid UI |
| State/data | TanStack Query, Zustand | Simple and cache-friendly |
| Backend | Node.js + NestJS (or Express) REST + WebSocket | Structured, scalable |
| Database | PostgreSQL (Prisma ORM) | Relational integrity for wallet and bookings |
| Cache/queues | Redis + BullMQ | Reminders, rankings, rate limits |
| Real-time | Socket.IO | Chat, notifications, presence |
| Video | LiveKit / Agora / Daily (WebRTC) | Handles 1:1 and multi-user workshops |
| Search | PostgreSQL full-text + pg_trgm (v1), OpenSearch/Meilisearch (later) | Start simple |
| Storage | S3-compatible (AWS S3 / Cloudflare R2) + CDN | Certificates and images |
| Auth | Just take email , password during registration with the requred info save it in database and verify while loggin in | 
| Email | SendGrid / SES | Notifications |
| Analytics | PostHog + SQL materialized views for dashboards | Skill gap and trends |
| Infra | Docker, GitHub Actions CI/CD, deployed on AWS/Vercel + managed Postgres | Standard |
| Monitoring | Sentry, Grafana/Prometheus | Reliability |
IMPORTANT NOTE: use only the free ones
---

## 7. Data Model (Core Entities)


`User` · `Profile` · `Department` · `Skill` (catalog) · `UserSkill` (level, price, verified) · `Certificate` · `ChallengeQuestion` / `ChallengeAttempt` · `AvailabilitySlot` · `SessionRequest` · `Negotiation` · `Session` · `Workshop` / `WorkshopAttendee` · `Message` / `Conversation` · `Wallet` · `Transaction` (ledger) · `Escrow` · `Review` · `KarmaEvent` · `LeaderboardSnapshot` · `Goal` / `Milestone` · `StudyLog` · `Notification` · `Report` / `Dispute` · `SkillRelation` (for recommendations).

---

## 8. Key Algorithms & Rules

- **Teacher ranking:** weighted score from 3.5, computed per (teacher, skill), refreshed hourly and on session completion.
- **Recommendations:** co-occurrence + curated skill graph; cold start uses department and goals.
- **Skill gap index:** `(requests + searches) / (verified teachers × available hours)` per skill and department.
- **Learning velocity:** rolling 4-week average of hours and milestones vs. prior 4 weeks.
- **Escrow state machine:** `Held → Released | Refunded | Disputed`.

---

## 9. Non-Functional Requirements

- **Performance:** search \< 500 ms p95; page load \< 2.5 s on 4G; chat latency \< 300 ms.
- **Scalability:** 10k concurrent users per campus; workshops up to 100 participants.
- **Security:** HTTPS, hashed passwords (argon2/bcrypt), RBAC, rate limiting, upload scanning, OWASP top-10 controls, signed URLs for certificates.
- **Privacy:** campus-only visibility, consent for portfolio visibility, data deletion on request, aggregated analytics only for departments.
- **Reliability:** 99.5% uptime; transactional wallet operations; daily backups.
- **Accessibility:** WCAG 2.1 AA, following the accessibility rules in `design.md`.
- **Compatibility:** latest Chrome, Safari, Edge, Firefox; responsive from 360 px.

---

## 10. Design Requirements (from `design.md`)

Designers and developers must implement the following **exactly as specified in `design.md`**:

- Color palette, light/dark themes, and semantic colors (success, warning, error, token/karma accents)
- Typography scale and font families
- Spacing, grid, radius, elevation and iconography
- Component library: buttons, inputs, cards (teacher card, session card), tables, modals, tabs, calendar grid, chat bubbles, badges, progress bars, charts
- Layout patterns: navigation, dashboard, responsive breakpoints
- Motion, loading, empty and error states
- Tone of voice and microcopy
- Accessibility standards

**Process:** (1) convert `design.md` tokens into a Tailwind theme and CSS variables; (2) build every component from those tokens; (3) design review checks each screen against `design.md` before sign-off; (4) any new component not covered must be proposed as an addition to `design.md` first.

---

## 11. Release Plan

| Phase | Weeks | Contents |
| --- | --- | --- |
| **MVP** | 1–10 | Auth, profile and skills, verification challenge, certificates, portfolio, search and ranking, request/accept/reject, calendar and availability, 1:1 live session with timer, tokens and escrow, messaging, dashboard, notifications, admin basics |
| **v1.1** | 11–16 | Negotiation, workshops, goals and milestones, study tracker, leaderboards and karma, learning impact |
| **v1.2** | 17–22 | Recommendations, trending skills, velocity, department skill gap analytics, calendar sync, PDF portfolio |
| **Later** | 23+ | Mobile apps, push notifications, multi-campus, skill endorsements, AI-assisted matching |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| Token inflation or gaming | Earning caps, collusion detection, admin audit |
| Cold start (few teachers) | Seed with faculty-nominated student experts; welcome tokens |
| Fake certificates or skills | Verification challenge + certificate review |
| No-shows | Karma penalties, escrow, reminders |
| Low-quality teaching | Ratings, disputes, ranking weights |
| Video cost/complexity | Use managed WebRTC provider, cap workshop size |
| Safety/harassment | Report/block, moderation queue, campus-email identity |

---

## 13. Open Questions

1. What is the exact token-to-hour baseline (e.g., 10 tokens = 1 hour for a beginner skill)?
2. Should tokens expire, or can they be converted into campus perks?
3. Who authors and owns verification question banks: faculty, seniors, or admin?
4. Should workshops be free to create, or require a minimum karma?
5. Final contents of `design.md` (to be attached) to lock the design tokens.

---

## 14. Acceptance Criteria (MVP examples)

- A student with a valid college email can register, verify and log in.
- A skill cannot go live until the verification challenge is passed.
- Searching "AI ML" lists teachers ordered by the ranking score, with the matched skill and price visible.
- A teacher can accept or reject a request; acceptance creates a calendar entry for both users and escrows tokens.
- At session end, tokens move from learner escrow to teacher wallet exactly once.
- Every screen passes a `design.md` conformance review.