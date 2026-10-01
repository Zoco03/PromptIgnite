import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Target, CheckCircle2, Plus, Calendar, 
  Award, Sparkles, ArrowRight, Zap 
} from 'lucide-react';
import { PromoBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const GoalsView: React.FC = () => {
  const { 
    currentUser, 
    goals, 
    skills, 
    createGoal, 
    toggleMilestone 
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalSkillName, setGoalSkillName] = useState(skills[0]?.name || 'AI & Machine Learning (PyTorch & Transformers)');
  const [goalTargetDate, setGoalTargetDate] = useState('2026-11-20');
  const [milestoneInput, setMilestoneInput] = useState('1. Finish autograd theory & loss gradients\n2. Pass SkillSwap verification challenge\n3. Complete 1:1 mentorship session\n4. Deploy public portfolio repo');

  const myGoals = goals.filter(g => g.userId === currentUser.id);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const milestoneTitles = milestoneInput.split('\n').filter(m => m.trim());
    createGoal(goalTitle, goalSkillName, goalTargetDate, milestoneTitles);
    setIsCreateModalOpen(false);
    setGoalTitle('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>STRUCTURED PEER LEARNING PATHWAYS (PRD 3.11)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            LEARNING GOALS & MILESTONES
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Set multi-week skill targets, break them into actionable milestones, and earn SkillPoints rewards upon each verified check-off.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ CREATE NEW LEARNING GOAL</span>
        </button>
      </div>

      {/* Goals Grid */}
      {myGoals.length === 0 ? (
        <div className="bg-soft-cloud border border-hairline p-12 text-center">
          <h3 className="font-display text-3xl text-ink uppercase">No Active Goals</h3>
          <p className="text-xs text-mute mt-2">Create a goal to structure your learning roadmap and earn bonus Karma.</p>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary text-xs mt-4">
            CREATE YOUR FIRST GOAL
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {myGoals.map(goal => (
            <div key={goal.id} className="bg-canvas border border-hairline p-6 sm:p-8 flex flex-col justify-between hover:border-ink transition-colors">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-ink" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-mute">
                      {goal.skillName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-ink">
                    Target: {goal.targetDate}
                  </span>
                </div>

                <div className="pt-4">
                  <h3 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight leading-tight">
                    {goal.title}
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink mb-1.5">
                    <span>Goal Completion</span>
                    <span>{goal.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-soft-cloud h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-ink h-full transition-all duration-300"
                      style={{ width: `${goal.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase text-mute tracking-wider block mb-2">
                    Milestones (Click to Check Off & Earn Karma)
                  </span>

                  {goal.milestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(goal.id, m.id)}
                      className={`p-3 border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        m.completed ? 'bg-soft-cloud border-hairline text-mute line-through' : 'bg-canvas border-hairline hover:border-ink text-ink'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          m.completed ? 'bg-success text-on-primary' : 'border border-hairline'
                        }`}>
                          {m.completed && '✓'}
                        </div>
                        <span className="text-xs font-medium leading-snug">{m.title}</span>
                      </div>

                      <span className="text-[10px] font-bold text-success uppercase shrink-0">
                        +{m.karmaReward} Karma
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-hairline-soft flex items-center justify-between text-xs text-mute font-medium">
                <span>
                  {goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} Milestones Achieved
                </span>
                {goal.progressPercent === 100 && (
                  <span className="text-success font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Goal Complete!</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE GOAL MODAL */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="CREATE LEARNING GOAL"
          subtitle="Break your target into milestones and earn Karma points"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Linked Skill
              </label>
              <select
                value={goalSkillName}
                onChange={(e) => setGoalSkillName(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              >
                {skills.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Goal Title
              </label>
              <input
                type="text"
                required
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Master Transformer Fine-Tuning and Deploy Campus Bot"
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Target Completion Date
              </label>
              <input
                type="date"
                value={goalTargetDate}
                onChange={(e) => setGoalTargetDate(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3 py-2 text-xs text-ink rounded-none focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-mute tracking-wider block mb-1">
                Milestones (1 per line)
              </label>
              <textarea
                rows={4}
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                className="w-full bg-soft-cloud border border-hairline px-3.5 py-2 text-xs text-ink font-mono rounded-none focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="btn-secondary text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                CREATE GOAL & ROADMAP
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
