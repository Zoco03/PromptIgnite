import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail, Lock, User as UserIcon, ArrowRight,
  Eye, EyeOff, Upload, CheckCircle2, Globe
} from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../common/SocialIcons';
import { Department } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const { registerUser, loginUser, allUsers } = useApp();

  const [mode, setMode]               = useState<'login' | 'register'>(initialMode);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [department, setDepartment]   = useState<Department>('Computer Science & Engineering');
  const [year, setYear]               = useState('2nd Year Undergraduate');
  const [bio, setBio]                 = useState('');
  const [avatar, setAvatar]           = useState(DEFAULT_AVATARS[0]);
  const [github, setGithub]           = useState('');
  const [instagram, setInstagram]     = useState('');
  const [linkedin, setLinkedin]       = useState('');
  const [portfolio, setPortfolio]     = useState('');
  const [error, setError]             = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [success, setSuccess]         = useState(false);

  if (!isOpen) return null;

  const departments: Department[] = [
    'Computer Science & Engineering',
    'Design & Human-Computer Interaction',
    'Electrical & Electronics',
    'Mechanical & Robotics',
    'Business & Management',
    'Biotechnology & Data',
  ];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 400));

    if (mode === 'login') {
      const ok = loginUser(email, password);
      if (ok) {
        setSuccess(true);
        setTimeout(onClose, 600);
      } else {
        setError('No account found with this email. Please register a new student account below.');
      }
    } else {
      if (!name.trim()) { setError('Please enter your full name.'); setIsLoading(false); return; }
      if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid university email address.');
        setIsLoading(false);
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        setIsLoading(false);
        return;
      }

      if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('An account with this email already exists. Please login instead.');
        setIsLoading(false);
        return;
      }

      registerUser({
        name,
        email,
        department,
        year,
        bio: bio.trim() || `Passionate ${department.split('&')[0].trim()} student at campus. Excited to exchange skills & collaborate!`,
        avatar,
        socials: {
          github: github.trim(),
          instagram: instagram.trim(),
          linkedin: linkedin.trim(),
          portfolio: portfolio.trim()
        }
      });
      setSuccess(true);
      setTimeout(onClose, 600);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-[#111111] shadow-2xl overflow-hidden flex flex-col md:flex-row my-8" style={{ minHeight: 560 }}>

        {/* LEFT EDITORIAL PANEL */}
        <div className="w-full md:w-[40%] bg-[#111111] text-white p-8 md:p-10 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="SkillSwap" className="w-9 h-9 object-contain invert" />
              <div>
                <span className="font-display text-2xl tracking-wider text-white">SKILLSWAP</span>
                <span className="block text-[10px] uppercase text-[#9e9ea0] tracking-widest font-mono">CAMPUS EXCHANGE</span>
              </div>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-white uppercase leading-none mb-3">
              YOUR CAMPUS.<br />
              YOUR SKILLS.<br />
              <span className="text-[#cacacb]">ZERO PRE-LOADED DATA.</span>
            </h1>

            <p className="text-sm text-[#9e9ea0] leading-relaxed mb-6">
              Connect directly with verified students. Teach your best skills, earn Tokens, and request live 1-on-1 peer sessions with interactive video & screen sharing.
            </p>

            <div className="space-y-3 border-t border-[#39393b] pt-5">
              <div className="flex items-center gap-3 text-xs text-[#cacacb]">
                <div className="w-2 h-2 rounded-full bg-[#007d48]" />
                <span>+50 SkillPoints Welcome Grant + Verified Student Status</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#cacacb]">
                <div className="w-2 h-2 rounded-full bg-[#1151ff]" />
                <span>Groq AI Recommendation & Focus Monitor</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#cacacb]">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Real-Time Multi-Account Tab Sync</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#707072] font-mono mt-6">
            DESIGN-AKTC EDITORIAL SYSTEM · CAMPUS NETWORK
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-full md:w-[60%] p-8 md:p-10 bg-white flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <div>
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4 mb-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    mode === 'register' 
                      ? 'bg-[#111111] text-white' 
                      : 'bg-[#f5f5f5] text-[#707072] hover:text-[#111111]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    mode === 'login' 
                      ? 'bg-[#111111] text-white' 
                      : 'bg-[#f5f5f5] text-[#707072] hover:text-[#111111]'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {allUsers.length > 0 && (
                <span className="text-xs font-mono text-[#707072]">
                  {allUsers.length} peer{allUsers.length > 1 ? 's' : ''} on campus
                </span>
              )}
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-[#fef2f2] border border-[#d30005] text-[#d30005] text-xs font-medium rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 bg-[#f0fdf4] border border-[#007d48] text-[#007d48] text-xs font-medium rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007d48]" />
                {mode === 'login' ? 'Signed in successfully! Loading dashboard...' : 'Account created! Welcome to SkillSwap.'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707072]">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Swaraj Verma"
                        className="w-full bg-[#f5f5f5] text-[#111111] text-sm pl-11 pr-4 py-2.5 rounded-xl border border-[#e5e5e5] focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#f5f5f5] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Profile Picture Upload & Select */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Profile Picture (PFP)
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <img src={avatar} alt="PFP" className="w-12 h-12 rounded-full object-cover border-2 border-[#111111]" />
                      <label className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111111] text-xs font-semibold px-4 py-2 rounded-full border border-[#cacacb] flex items-center gap-2 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        Upload Custom Photo
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      </label>
                    </div>
                    {/* Preset Avatars */}
                    <div className="flex gap-2">
                      {DEFAULT_AVATARS.map((av, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setAvatar(av)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${avatar === av ? 'border-[#111111] scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                          <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value as Department)}
                        className="w-full bg-[#f5f5f5] text-[#111111] text-xs px-3 py-2.5 rounded-xl border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                      >
                        {departments.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                        Academic Year
                      </label>
                      <select
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        className="w-full bg-[#f5f5f5] text-[#111111] text-xs px-3 py-2.5 rounded-xl border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                      >
                        <option value="1st Year Undergraduate">1st Year Undergraduate</option>
                        <option value="2nd Year Undergraduate">2nd Year Undergraduate</option>
                        <option value="3rd Year Undergraduate">3rd Year Undergraduate</option>
                        <option value="4th Year Senior">4th Year Senior</option>
                        <option value="Master's / Postgraduate">Master's / Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Social Media Accounts */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                      Social Accounts (GitHub, Instagram, etc.)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#707072]">
                          <GithubIcon className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={github}
                          onChange={e => setGithub(e.target.value)}
                          placeholder="github.com/username"
                          className="w-full bg-[#f5f5f5] text-[#111111] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#707072]">
                          <InstagramIcon className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={instagram}
                          onChange={e => setInstagram(e.target.value)}
                          placeholder="instagram.com/username"
                          className="w-full bg-[#f5f5f5] text-[#111111] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#707072]">
                          <LinkedinIcon className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={linkedin}
                          onChange={e => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/username"
                          className="w-full bg-[#f5f5f5] text-[#111111] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#707072]">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={portfolio}
                          onChange={e => setPortfolio(e.target.value)}
                          placeholder="portfolio website url"
                          className="w-full bg-[#f5f5f5] text-[#111111] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#e5e5e5] focus:bg-white focus:border-[#111111] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                  University Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707072]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@campus.edu"
                    className="w-full bg-[#f5f5f5] text-[#111111] text-sm pl-11 pr-4 py-2.5 rounded-xl border border-[#e5e5e5] focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#f5f5f5] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707072]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f5f5f5] text-[#111111] text-sm pl-11 pr-11 py-2.5 rounded-xl border border-[#e5e5e5] focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-[#f5f5f5] outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#707072] hover:text-[#111111]"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary justify-center py-3.5 text-sm"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : mode === 'register' ? (
                    <>
                      Register & Receive 50 SkillPoints
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Sign In to SkillSwap
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-[#e5e5e5] text-center text-xs text-[#707072]">
            {mode === 'register' ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="font-bold text-[#111111] underline hover:no-underline"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Need a student account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="font-bold text-[#111111] underline hover:no-underline"
                >
                  Register now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
