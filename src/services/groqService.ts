// Groq AI Service integration for SkillSwap
// Powered by Groq Cloud API
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroqChat(messages: GroqMessage[], temperature = 0.7, maxTokens = 1024): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Groq API returned error status:', response.status, errText);
      // Try fallback to llama-3.1-8b-instant
      const fallbackRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens
        })
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return fallbackData.choices?.[0]?.message?.content || 'No response generated.';
      }
      return 'AI engine is currently processing your request. Please try again.';
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq AI call failed:', error);
    return 'AI response could not be generated. Please check your connection.';
  }
}

// 1. Recommendation Engine powered by Groq AI
export async function getAIRecommendations(
  userProfile: { name: string; department: string; bio: string; skillsTeaching: string[]; skillsLearning: string[]; tokens: number },
  availablePeers: Array<{ id: string; name: string; department: string; skills: string[]; rating: number; tokenPrice: number }>
): Promise<{ recommendationText: string; matchedPeerIds: string[]; learningPath: string[] }> {
  if (availablePeers.length === 0) {
    return {
      recommendationText: 'No peers currently registered. Invite fellow students or create another account to explore peer swaps!',
      matchedPeerIds: [],
      learningPath: ['Register peer accounts', 'List skills you can teach and want to learn', 'Start token-based swaps']
    };
  }

  const prompt = `You are the AI Recommendation Engine for SkillSwap, a peer-to-peer student skill exchange campus platform.
Current User:
- Name: ${userProfile.name}
- Department: ${userProfile.department}
- Bio: ${userProfile.bio}
- Skills Teaching: ${userProfile.skillsTeaching.join(', ') || 'None listed yet'}
- Skills to Learn / Interests: ${userProfile.skillsLearning.join(', ') || 'General engineering & technology'}
- Token Balance: ${userProfile.tokens} Tokens

Available Campus Peers:
${JSON.stringify(availablePeers, null, 2)}

Task: Analyze the user's learning goals and match them with the most optimal peer teachers. Provide a response in JSON format with:
{
  "recommendationText": "A 2-3 sentence inspiring recommendation highlighting the best matches and why they complement the user's goals",
  "matchedPeerIds": ["peerId1", "peerId2"],
  "learningPath": ["Step 1: Focus on ...", "Step 2: Connect with ...", "Step 3: Build ..."]
}
Respond strictly with valid JSON only.`;

  try {
    const raw = await callGroqChat([
      { role: 'system', content: 'You are an expert academic and technical skill advisor. Output valid JSON only.' },
      { role: 'user', content: prompt }
    ], 0.4, 800);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      recommendationText: parsed.recommendationText || 'Explore verified peer mentors matching your technical goals.',
      matchedPeerIds: Array.isArray(parsed.matchedPeerIds) ? parsed.matchedPeerIds : [],
      learningPath: Array.isArray(parsed.learningPath) ? parsed.learningPath : ['Connect with peers', 'Complete live 1-on-1 sessions', 'Earn skill certificates']
    };
  } catch (e) {
    console.error('Failed to parse AI recommendations:', e);
    return {
      recommendationText: `Based on your profile, we found ${availablePeers.length} active peer(s) ready to exchange skills and collaborate.`,
      matchedPeerIds: availablePeers.map(p => p.id),
      learningPath: ['Explore peer profiles', 'Schedule live sessions', 'Verify skills with certificates']
    };
  }
}

// 2. AI Focus & Study Monitor Coach
export async function analyzeFocusSession(
  studyLog: { skillName: string; durationMinutes: number; focusScore: number; distractionCount: number; notes: string }
): Promise<{ feedback: string; nextChallenge: string; tokensEarned: number }> {
  const prompt = `Student finished a focus study session:
- Skill: ${studyLog.skillName}
- Duration: ${studyLog.durationMinutes} minutes
- Camera Focus Score: ${studyLog.focusScore}%
- Distractions Detected: ${studyLog.distractionCount}
- Notes: ${studyLog.notes}

Provide brief encouraging feedback and a practical quick mastery challenge.
Output JSON only:
{
  "feedback": "Short encouraging review of focus and depth",
  "nextChallenge": "A 1-sentence prompt or exercise to reinforce what was studied",
  "tokensEarned": 15
}`;

  try {
    const raw = await callGroqChat([
      { role: 'system', content: 'You are an encouraging academic study mentor. Return JSON only.' },
      { role: 'user', content: prompt }
    ], 0.5, 400);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      feedback: `Great job completing ${studyLog.durationMinutes} minutes of focused study on ${studyLog.skillName}!`,
      nextChallenge: `Summarize the top 3 concepts from your session into practical code or notes.`,
      tokensEarned: Math.max(5, Math.floor(studyLog.durationMinutes / 3))
    };
  }
}

// 3. AI Resume Builder Generator
export async function generateAIResume(user: {
  name: string;
  email: string;
  department: string;
  year: string;
  bio: string;
  skills: Array<{ skillName: string; level: string; isVerified: boolean; rating: number; sessionsTaught: number }>;
  certificates: Array<{ title: string; skillName: string; issuer: string; issueDate: string }>;
  totalHoursTaught: number;
  totalHoursLearned: number;
  tokens: number;
  socials?: { github?: string; instagram?: string; linkedin?: string; portfolio?: string };
}): Promise<{
  headline: string;
  summary: string;
  coreCompetencies: string[];
  peerMentorshipExperience: Array<{ role: string; description: string; metrics: string }>;
  verifiedCredentials: Array<{ name: string; organization: string; date: string }>;
  socialLinks: { github?: string; instagram?: string; linkedin?: string; portfolio?: string };
}> {
  const prompt = `Generate a high-impact, modern technical resume for a university student on SkillSwap platform.
Student details:
- Name: ${user.name}
- Email: ${user.email}
- Department: ${user.department}
- Academic Year: ${user.year}
- Bio: ${user.bio}
- Skills: ${JSON.stringify(user.skills)}
- Verified Certificates: ${JSON.stringify(user.certificates)}
- Teaching Hours: ${user.totalHoursTaught} hrs | Learning Hours: ${user.totalHoursLearned} hrs
- Tokens Earned: ${user.tokens}
- Socials: ${JSON.stringify(user.socials || {})}

Return valid JSON strictly matching this schema:
{
  "headline": "Full-Stack Engineer & Peer Mentor",
  "summary": "Impactful 2-3 sentence executive summary highlighting expertise and leadership...",
  "coreCompetencies": ["Skill 1", "Skill 2", "Skill 3"],
  "peerMentorshipExperience": [
    {
      "role": "Peer Instructor & Technical Mentor",
      "description": "Led 1-on-1 and group technical workshops on...",
      "metrics": "${user.totalHoursTaught} hours taught, rated 4.9/5.0"
    }
  ],
  "verifiedCredentials": [
    {
      "name": "Certificate or Course Name",
      "organization": "Issuer Organization",
      "date": "2026"
    }
  ],
  "socialLinks": {
    "github": "${user.socials?.github || ''}",
    "instagram": "${user.socials?.instagram || ''}",
    "linkedin": "${user.socials?.linkedin || ''}",
    "portfolio": "${user.socials?.portfolio || ''}"
  }
}`;

  try {
    const raw = await callGroqChat([
      { role: 'system', content: 'You are an executive tech resume writer. Return strictly valid JSON.' },
      { role: 'user', content: prompt }
    ], 0.3, 1000);

    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Resume generation failed:', e);
    return {
      headline: `${user.department} Student & Technical Peer Mentor`,
      summary: user.bio || `${user.name} is a dedicated student in ${user.department} actively mentoring peers and building real-world technical proficiency.`,
      coreCompetencies: user.skills.map(s => s.skillName),
      peerMentorshipExperience: [
        {
          role: 'Campus Technical Mentor',
          description: `Conducted peer-to-peer 1-on-1 tutoring sessions across verified domains.`,
          metrics: `${user.totalHoursTaught} hours taught on SkillSwap platform`
        }
      ],
      verifiedCredentials: user.certificates.map(c => ({
        name: c.title,
        organization: c.issuer,
        date: c.issueDate
      })),
      socialLinks: user.socials || {}
    };
  }
}
