import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, TrendingUp, GitBranch, ArrowRight, 
  BarChart3, Zap, Brain, Layers 
} from 'lucide-react';
import { PromoBadge } from '../common/Badge';

export const InsightsView: React.FC = () => {
  const { 
    currentUser, 
    skills, 
    setCurrentTab, 
    setSearchQuery 
  } = useApp();

  const handleExploreSkill = (skillName: string) => {
    setSearchQuery(skillName);
    setCurrentTab('search');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
          <span>AI RECOMMENDATIONS & CAMPUS GRAPH (PRD 3.15)</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
          RECOMMENDATIONS & LEARNING INSIGHTS
        </h1>
        <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
          Co-learning data from past peer sessions, complementary skill paths, and personal learning velocity analytics.
        </p>
      </div>

      {/* 1. COMPLEMENTARY SKILL GRAPH PATHWAYS (PRD 3.15) */}
      <section className="bg-canvas border border-hairline p-6 sm:p-8 space-y-6">
        <div className="border-b border-hairline pb-4">
          <h3 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight">
            COMPLEMENTARY SKILL RELATIONSHIP GRAPH
          </h3>
          <p className="text-xs text-mute font-medium">
            Based on your active goals and completed PyTorch & React sessions, students also learn:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-soft-cloud border border-hairline p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-mute">Recommended Next Step</span>
              <h4 className="font-display text-2xl text-ink uppercase mt-1">
                Statistics & Bayesian Probability
              </h4>
              <p className="text-xs text-mute mt-2">
                Essential for deep understanding of generative models, diffusion samplers, and loss convergence.
              </p>
            </div>
            <button
              onClick={() => handleExploreSkill('AI')}
              className="btn-primary text-xs mt-4 py-2"
            >
              FIND PEER MENTOR →
            </button>
          </div>

          <div className="bg-soft-cloud border border-hairline p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-mute">Complementary Engineering</span>
              <h4 className="font-display text-2xl text-ink uppercase mt-1">
                Docker, Kubernetes & GPU Infra
              </h4>
              <p className="text-xs text-mute mt-2">
                Learn how to containerize PyTorch training jobs and run inference on cloud clusters.
              </p>
            </div>
            <button
              onClick={() => handleExploreSkill('Cloud')}
              className="btn-primary text-xs mt-4 py-2"
            >
              FIND PEER MENTOR →
            </button>
          </div>

          <div className="bg-soft-cloud border border-hairline p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-mute">Design & Usability</span>
              <h4 className="font-display text-2xl text-ink uppercase mt-1">
                UI/UX Design Systems & Tokens
              </h4>
              <p className="text-xs text-mute mt-2">
                Bridge your frontend React components with accessible WCAG AAA design token libraries.
              </p>
            </div>
            <button
              onClick={() => handleExploreSkill('Design')}
              className="btn-primary text-xs mt-4 py-2"
            >
              FIND PEER MENTOR →
            </button>
          </div>
        </div>
      </section>

      {/* 2. PERSONAL LEARNING VELOCITY (PRD 3.15) */}
      <section className="bg-ink text-on-primary p-6 sm:p-8 space-y-6">
        <div className="border-b border-canvas/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-3xl sm:text-4xl text-on-primary uppercase tracking-tight">
              PERSONAL LEARNING VELOCITY
            </h3>
            <p className="text-xs text-hairline font-normal">
              Rolling 4-week trend index of hours studied, milestones checked, and peer ratings
            </p>
          </div>
          <div className="text-xs font-bold text-success uppercase">
            ▲ +24% Velocity vs Prior Month
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-canvas/10 p-4 border border-canvas/20">
            <span className="text-[10px] font-bold uppercase text-hairline">Hours / Week</span>
            <div className="font-display text-4xl text-on-primary mt-1">9.5 hrs</div>
            <span className="text-[10px] text-hairline">Consistent rhythm</span>
          </div>

          <div className="bg-canvas/10 p-4 border border-canvas/20">
            <span className="text-[10px] font-bold uppercase text-hairline">Milestones / Month</span>
            <div className="font-display text-4xl text-on-primary mt-1">4.0</div>
            <span className="text-[10px] text-hairline">+100 Karma earned</span>
          </div>

          <div className="bg-canvas/10 p-4 border border-canvas/20">
            <span className="text-[10px] font-bold uppercase text-hairline">Teaching Impact</span>
            <div className="font-display text-4xl text-on-primary mt-1">14 hrs</div>
            <span className="text-[10px] text-hairline">9 junior peers mentored</span>
          </div>

          <div className="bg-canvas/10 p-4 border border-canvas/20">
            <span className="text-[10px] font-bold uppercase text-hairline">Campus Tier</span>
            <div className="font-display text-4xl text-on-primary mt-1">Top 5%</div>
            <span className="text-[10px] text-success font-semibold">Rank #12 on Leaderboard</span>
          </div>
        </div>
      </section>

    </div>
  );
};
