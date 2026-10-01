import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, Download, TrendingUp, AlertTriangle, 
  CheckCircle2, Sparkles, Filter, ArrowRight 
} from 'lucide-react';
import { FilterChip } from '../common/Badge';

export const DepartmentAnalyticsView: React.FC = () => {
  const { 
    skillGaps, 
    setCurrentTab, 
    setSearchQuery 
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Design & Human-Computer Interaction',
    'Business & Management'
  ];

  const filteredGaps = skillGaps.filter(g => 
    selectedDept === 'All' || g.department === selectedDept
  );

  const handleExportCSV = () => {
    let csvContent = 'Skill Name,Department,Searches and Requests,Supply Teachers,Available Hours/Week,Gap Index,Status,Action Recommendation\n';
    filteredGaps.forEach(g => {
      csvContent += `"${g.skillName}","${g.department}",${g.demandSearchesAndRequests},${g.supplyTeachers},${g.availableHoursPerWeek},${g.gapIndex},"${g.status}","${g.actionRecommendation}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'skillswap-department-gap-analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>INSTITUTIONAL INSIGHTS & FACULTY PLANNING (PRD 3.16)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            DEPARTMENT SKILL GAP ANALYSIS
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Compare university student demand (searches + requests) against verified teacher supply and availability. The Skill Gap Index identifies unfulfilled course prerequisites and high-deficit topics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          title="Export CSV for Faculty Board"
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT CSV REPORT</span>
        </button>
      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {departments.map(d => (
          <FilterChip
            key={d}
            label={d === 'All' ? 'All Departments' : d.split('&')[0]}
            active={selectedDept === d}
            onClick={() => setSelectedDept(d)}
          />
        ))}
      </div>

      {/* 1. GAP INDEX CALCULATION EXPLAINER CARD */}
      <div className="bg-soft-cloud border border-hairline p-6 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">
            Mathematical Skill Gap Index Formula (PRD 3.16 & 8.0)
          </h4>
          <p className="text-xs text-charcoal font-mono">
            Gap Index = (Searches + Session Requests) ÷ (Verified Teachers × Available Hours/Week)
          </p>
          <p className="text-[11px] text-mute leading-relaxed mt-1">
            • <strong>&gt; 2.0 (Critical Gap):</strong> Acute shortage. Needs immediate departmental hackathon or workshop funding.<br />
            • <strong>1.0 – 2.0 (Deficit):</strong> Demand outpaces peer hours.<br />
            • <strong>0.4 – 1.0 (Balanced):</strong> Equilibrium supply.<br />
            • <strong>&lt; 0.4 (Surplus):</strong> Abundant mentors; recommend group masterclasses.
          </p>
        </div>

        <div className="flex flex-col gap-1 text-xs font-semibold">
          <span className="px-3 py-1 bg-sale text-on-primary rounded-full text-[10px] font-bold uppercase text-center">
            Critical Gap (&gt;2.0)
          </span>
          <span className="px-3 py-1 bg-success text-on-primary rounded-full text-[10px] font-bold uppercase text-center">
            Balanced / Surplus (&lt;1.0)
          </span>
        </div>
      </div>

      {/* 2. DETAILED SKILL GAP HEATMAP TABLE */}
      <section className="bg-canvas border border-hairline p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight pb-3 border-b border-hairline">
          CAMPUS SUPPLY VS DEMAND HEATMAP
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-hairline font-bold uppercase text-mute text-[10px] tracking-wider">
                <th className="py-3 px-2">Skill Topic</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2 text-center">Demand (Searches + Reqs)</th>
                <th className="py-3 px-2 text-center">Supply Mentors</th>
                <th className="py-3 px-2 text-center">Avail. Hrs/Wk</th>
                <th className="py-3 px-2 text-center">Gap Index</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Faculty Action Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft font-medium">
              {filteredGaps.map(gap => (
                <tr key={gap.skillId} className="hover:bg-soft-cloud/50 transition-colors">
                  <td className="py-4 px-2 font-semibold text-ink max-w-xs">
                    {gap.skillName}
                  </td>
                  <td className="py-4 px-2 text-mute">
                    {gap.department.split('&')[0]}
                  </td>
                  <td className="py-4 px-2 text-center font-display text-lg text-ink">
                    {gap.demandSearchesAndRequests}
                  </td>
                  <td className="py-4 px-2 text-center font-bold text-ink">
                    {gap.supplyTeachers}
                  </td>
                  <td className="py-4 px-2 text-center text-mute">
                    {gap.availableHoursPerWeek} hrs
                  </td>
                  <td className="py-4 px-2 text-center font-display text-2xl">
                    <span className={gap.gapIndex > 1.5 ? 'text-sale' : 'text-success'}>
                      {gap.gapIndex.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      gap.status === 'Critical Gap' ? 'bg-sale text-on-primary' :
                      gap.status === 'Deficit' ? 'bg-sale-deep text-on-primary' :
                      gap.status === 'Balanced' ? 'bg-ink text-on-primary' : 'bg-success text-on-primary'
                    }`}>
                      {gap.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-charcoal leading-relaxed max-w-sm">
                    {gap.actionRecommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
