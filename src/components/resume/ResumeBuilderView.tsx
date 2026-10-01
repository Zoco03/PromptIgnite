import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText, Download, RefreshCw,
  Mail, Globe, Check, Eye, User as UserIcon, Sparkles,
  Layers, Palette, Layout, Award
} from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../common/SocialIcons';
import { generateAIResume } from '../../services/groqService';

export const ResumeBuilderView: React.FC = () => {
  const { currentUser, userSkills, certificates, allUsers } = useApp();

  const user = currentUser || allUsers[0];
  const mySkills = userSkills.filter(s => s.userId === user?.id);
  const myCerts = certificates.filter(c => c.userId === user?.id && c.status === 'Verified');

  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'portfolio' | 'classic'>('modern');
  const [showPfp, setShowPfp] = useState(true);

  // Resume Content State
  const [headline, setHeadline] = useState(`${user?.department || 'Computer Science'} Specialist & Peer Mentor`);
  const [summary, setSummary] = useState(user?.bio || 'Dedicated software and systems specialist with proven expertise in algorithmic problem solving, peer mentorship, and collaborative technical execution.');
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [mentorshipExperience, setMentorshipExperience] = useState<Array<{ role: string; description: string; metrics: string }>>([]);
  const [credentials, setCredentials] = useState<Array<{ name: string; organization: string; date: string }>>([]);

  const handleGenerateAI = async () => {
    if (!user) return;
    setIsLoading(true);

    const res = await generateAIResume({
      name: user.name,
      email: user.email,
      department: user.department,
      year: user.year,
      bio: user.bio,
      skills: mySkills.map(s => ({
        skillName: s.skillName,
        level: s.level,
        isVerified: s.isVerified,
        rating: s.rating,
        sessionsTaught: s.totalSessionsTaught
      })),
      certificates: myCerts.map(c => ({
        title: c.title,
        skillName: c.skillName,
        issuer: c.issuer,
        issueDate: c.issueDate
      })),
      totalHoursTaught: user.totalHoursTaught || 0,
      totalHoursLearned: user.totalHoursLearned || 0,
      tokens: user.skillpoints || user.tokens || user.walletBalance || 0,
      socials: user.socials
    });

    setHeadline(res.headline || `${user.department} Specialist`);
    setSummary(res.summary || user.bio);
    setCompetencies(res.coreCompetencies && res.coreCompetencies.length > 0 ? res.coreCompetencies : mySkills.map(s => s.skillName));
    setMentorshipExperience(res.peerMentorshipExperience || []);
    setCredentials(res.verifiedCredentials || []);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGenerateAI();
  }, [user?.id]);

  const handlePrint = () => {
    window.print();
  };

  if (!user) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8">

      {/* ── TOP CONTROL TOOLBAR (No-Print) ── */}
      <div className="no-print border-b border-[#111111] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#707072] mb-1">
            CAMPUS TECHNICAL PROFILE TO RESUME COMPILER
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-[#111111] leading-none">
            TECHNICAL RESUME BUILDER
          </h1>
          <p className="text-xs sm:text-sm text-[#4b4b4d] mt-1">
            Compiled directly from your verified skills, peer mentorship hours, and certifications. Zero watermark.
          </p>
        </div>

        {/* Template Selector & Options */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Design Templates */}
          <div className="flex bg-[#f5f5f5] p-1 rounded-full border border-[#e5e5e5]">
            {[
              { id: 'modern', label: 'Executive Modern' },
              { id: 'minimal', label: 'Minimal Clean' },
              { id: 'portfolio', label: 'Two-Column Portfolio' },
              { id: 'classic', label: 'Academic Classic' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  template === t.id ? 'bg-[#111111] text-white shadow-sm' : 'text-[#707072] hover:text-[#111111]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* PFP Toggle */}
          <button
            onClick={() => setShowPfp(!showPfp)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showPfp ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#f5f5f5] text-[#707072] border-[#e5e5e5]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{showPfp ? 'PFP: Included' : 'PFP: Hidden'}</span>
          </button>

          {/* AI Regenerate */}
          <button
            onClick={handleGenerateAI}
            disabled={isLoading}
            className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate AI
          </button>

          {/* Print / Download */}
          <button
            onClick={handlePrint}
            className="btn-primary !py-2 !px-6 text-xs flex items-center gap-2 font-bold uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* ── 1. TEMPLATE: EXECUTIVE MODERN ── */}
      {template === 'modern' && (
        <div className="resume-print-area max-w-4xl mx-auto bg-white p-8 sm:p-14 border-2 border-[#111111] shadow-xl text-[#111111] space-y-8 font-sans">
          
          {/* Header */}
          <div className="border-b-2 border-[#111111] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                {showPfp && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-none object-cover border-2 border-[#111111] bg-[#f5f5f5]"
                  />
                )}
                <div>
                  <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-[#111111] leading-none mb-1">
                    {user.name}
                  </h1>
                  <p className="text-sm font-bold uppercase text-[#39393b] tracking-wider">
                    {headline}
                  </p>
                  <p className="text-xs text-[#707072] mt-0.5">
                    {user.department} · {user.year}
                  </p>
                </div>
              </div>

              {/* Contact / Social links */}
              <div className="text-xs space-y-1 text-[#39393b] sm:text-right font-mono">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </div>
                {user.socials?.github && (
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>{user.socials.github}</span>
                  </div>
                )}
                {user.socials?.linkedin && (
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>{user.socials.linkedin}</span>
                  </div>
                )}
                {user.socials?.portfolio && (
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{user.socials.portfolio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] border-b border-[#e5e5e5] pb-1">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs sm:text-sm text-[#39393b] leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Core Technical Competencies */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] border-b border-[#e5e5e5] pb-1">
              CORE TECHNICAL COMPETENCIES & DOMAINS
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {(competencies.length > 0 ? competencies : mySkills.map(s => s.skillName)).map((skill, idx) => (
                <span key={idx} className="bg-[#f5f5f5] text-[#111111] border border-[#cacacb] px-3 py-1 text-xs font-semibold rounded">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Mentorship & Teaching Experience */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] border-b border-[#e5e5e5] pb-1">
              TECHNICAL MENTORSHIP & LEADERSHIP EXPERIENCE
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#111111]">Lead Peer Technical Instructor</span>
                  <span className="text-[#707072]">University Academic Exchange</span>
                </div>
                <div className="text-[11px] font-mono text-[#007d48]">
                  {user.totalHoursTaught || 0} Teaching Hours · Verified 5.0/5.0 Rating
                </div>
                <p className="text-xs text-[#4b4b4d] leading-relaxed">
                  Conducted structured 1:1 mentorship, live pair programming, and algorithmic design sessions for university peers. Mentored students on engineering fundamentals, debugging workflows, and system concepts.
                </p>
              </div>

              {mentorshipExperience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#111111]">{exp.role}</span>
                    <span className="text-[#707072]">{exp.metrics}</span>
                  </div>
                  <p className="text-xs text-[#4b4b4d] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials & Certifications */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] border-b border-[#e5e5e5] pb-1">
              VERIFIED CREDENTIALS & CERTIFICATIONS
            </h2>
            <div className="space-y-2 pt-1">
              {myCerts.length === 0 ? (
                <div className="text-xs text-[#707072]">
                  Verified Domain Assessments in {user.department}.
                </div>
              ) : (
                myCerts.map(c => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#111111]">{c.title}</span>
                      <span className="text-[#707072] ml-2">({c.skillName})</span>
                    </div>
                    <div className="text-[#707072] font-mono">{c.issuer} · {c.issueDate}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Academic Education */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] border-b border-[#e5e5e5] pb-1">
              EDUCATION & ACADEMICS
            </h2>
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#111111]">Bachelor of Engineering / Technology</span>
                <div className="text-[#707072]">{user.department}</div>
              </div>
              <div className="text-[#707072] font-mono">{user.year} · Verified Student Status</div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. TEMPLATE: MINIMALIST ATS CLEAN ── */}
      {template === 'minimal' && (
        <div className="resume-print-area max-w-4xl mx-auto bg-white p-8 sm:p-14 border border-[#cacacb] shadow-xl text-[#111111] space-y-6 font-mono text-xs leading-relaxed">
          
          <div className="flex items-center justify-between border-b border-[#111111] pb-4">
            <div className="flex items-center gap-4">
              {showPfp && (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border border-[#111111]" />
              )}
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wider text-[#111111]">{user.name}</h1>
                <div className="text-xs text-[#707072]">{headline}</div>
              </div>
            </div>
            <div className="text-right text-[11px] text-[#4b4b4d]">
              <div>{user.email}</div>
              {user.socials?.github && <div>{user.socials.github}</div>}
              {user.socials?.linkedin && <div>{user.socials.linkedin}</div>}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-[#111111]">[ 01. SUMMARY ]</div>
            <p className="text-[#39393b] font-sans text-xs">{summary}</p>
          </div>

          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-[#111111]">[ 02. TECHNICAL SKILLS ]</div>
            <div className="font-sans text-xs text-[#39393b]">
              {(competencies.length > 0 ? competencies : mySkills.map(s => s.skillName)).join(' · ')}
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-[#111111]">[ 03. EXPERIENCE ]</div>
            <div className="space-y-2 font-sans">
              <div>
                <div className="font-bold text-xs">Campus Peer Technical Instructor</div>
                <div className="text-[11px] font-mono text-[#707072]">{user.totalHoursTaught || 0} hours conducted · 5.0 Rating</div>
                <p className="text-xs text-[#4b4b4d] mt-1">Conducted verified 1:1 mentorship and live code review sprints with university peers.</p>
              </div>
              {mentorshipExperience.map((m, idx) => (
                <div key={idx}>
                  <div className="font-bold text-xs">{m.role}</div>
                  <div className="text-[11px] font-mono text-[#707072]">{m.metrics}</div>
                  <p className="text-xs text-[#4b4b4d] mt-1">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-[#111111]">[ 04. EDUCATION ]</div>
            <div className="font-sans flex justify-between text-xs">
              <span>{user.department}</span>
              <span className="font-mono text-[#707072]">{user.year}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. TEMPLATE: TWO-COLUMN PORTFOLIO ── */}
      {template === 'portfolio' && (
        <div className="resume-print-area max-w-4xl mx-auto bg-white border-2 border-[#111111] shadow-xl text-[#111111] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column (4 cols) */}
          <div className="md:col-span-4 bg-[#111111] text-white p-8 space-y-6">
            {showPfp && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-none object-cover border-2 border-white mx-auto"
              />
            )}

            <div>
              <h1 className="font-display text-3xl uppercase tracking-wider text-white text-center leading-none">
                {user.name}
              </h1>
              <p className="text-xs text-center text-[#cacacb] mt-1 font-mono uppercase">
                {user.department.split('&')[0]}
              </p>
            </div>

            <div className="space-y-2 border-t border-[#39393b] pt-4 text-xs font-mono text-[#cacacb]">
              <div className="font-bold text-white uppercase text-[10px] tracking-widest">Contact</div>
              <div className="truncate">{user.email}</div>
              {user.socials?.github && <div className="truncate">{user.socials.github}</div>}
              {user.socials?.linkedin && <div className="truncate">{user.socials.linkedin}</div>}
              {user.socials?.portfolio && <div className="truncate">{user.socials.portfolio}</div>}
            </div>

            <div className="space-y-2 border-t border-[#39393b] pt-4">
              <div className="font-bold text-white uppercase text-xs tracking-wider">Expertise</div>
              <div className="flex flex-wrap gap-1.5">
                {(competencies.length > 0 ? competencies : mySkills.map(s => s.skillName)).map((s, idx) => (
                  <span key={idx} className="bg-[#262626] text-white text-[11px] px-2 py-0.5 rounded border border-[#39393b]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-[#39393b] pt-4 text-xs">
              <div className="font-bold text-white uppercase text-[10px] tracking-widest">Education</div>
              <div className="text-white font-semibold">{user.department}</div>
              <div className="text-[#9e9ea0] font-mono text-[11px]">{user.year}</div>
            </div>
          </div>

          {/* Right Column (8 cols) */}
          <div className="md:col-span-8 p-8 sm:p-10 space-y-6 bg-white">
            <div className="space-y-2">
              <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111] border-b-2 border-[#111111] pb-1">
                Executive Profile
              </h2>
              <p className="text-xs sm:text-sm text-[#39393b] leading-relaxed">
                {summary}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111] border-b-2 border-[#111111] pb-1">
                Mentorship & Technical Projects
              </h2>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Lead Peer Technical Instructor</span>
                  <span className="text-[#007d48] font-mono">{user.totalHoursTaught || 0} Hours Taught</span>
                </div>
                <p className="text-xs text-[#4b4b4d] leading-relaxed">
                  Delivered 1:1 peer mentorship and coding reviews across software, algorithms, and system architectures with verified student satisfaction.
                </p>
              </div>

              {mentorshipExperience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{exp.role}</span>
                    <span className="text-[#707072] font-mono text-[11px]">{exp.metrics}</span>
                  </div>
                  <p className="text-xs text-[#4b4b4d] leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>

            {myCerts.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-display text-2xl uppercase tracking-wider text-[#111111] border-b-2 border-[#111111] pb-1">
                  Verified Certifications
                </h2>
                <div className="space-y-1 text-xs">
                  {myCerts.map(c => (
                    <div key={c.id} className="flex justify-between">
                      <span className="font-semibold">{c.title} ({c.skillName})</span>
                      <span className="text-[#707072] font-mono">{c.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── 4. TEMPLATE: ACADEMIC CLASSIC (Serif) ── */}
      {template === 'classic' && (
        <div className="resume-print-area max-w-4xl mx-auto bg-white p-8 sm:p-14 border border-[#cacacb] shadow-xl text-[#111111] space-y-6 font-serif leading-relaxed">
          
          <div className="text-center border-b-2 border-[#111111] pb-4 space-y-1">
            {showPfp && (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border border-[#111111] mx-auto mb-2" />
            )}
            <h1 className="text-3xl font-bold tracking-wide uppercase">{user.name}</h1>
            <div className="text-xs italic text-[#4b4b4d] font-sans">{headline}</div>
            <div className="text-[11px] font-sans text-[#707072] space-x-3">
              <span>{user.email}</span>
              {user.socials?.github && <span>• {user.socials.github}</span>}
              {user.socials?.linkedin && <span>• {user.socials.linkedin}</span>}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest border-b border-[#111111] pb-0.5">Summary of Qualifications</h2>
            <p className="text-xs text-[#39393b]">{summary}</p>
          </div>

          <div className="space-y-1">
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest border-b border-[#111111] pb-0.5">Areas of Academic Expertise</h2>
            <p className="text-xs font-sans text-[#39393b]">
              {(competencies.length > 0 ? competencies : mySkills.map(s => s.skillName)).join(', ')}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest border-b border-[#111111] pb-0.5">Teaching & Academic Experience</h2>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span>Peer Instructor & Academic Mentor</span>
                  <span className="font-sans font-normal text-[#707072]">{user.totalHoursTaught || 0} Hours</span>
                </div>
                <p className="text-xs text-[#4b4b4d]">Guided undergraduate students through problem sets, system labs, and programming assignments.</p>
              </div>
              {mentorshipExperience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{exp.role}</span>
                    <span className="font-sans font-normal text-[#707072]">{exp.metrics}</span>
                  </div>
                  <p className="text-xs text-[#4b4b4d]">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest border-b border-[#111111] pb-0.5">Education</h2>
            <div className="flex justify-between text-xs">
              <span className="font-bold">{user.department}</span>
              <span className="font-sans text-[#707072]">{user.year}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
