import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, Lock, ShieldCheck, ArrowDownLeft, ArrowUpRight, 
  Clock, Plus, HelpCircle, FileText, AlertCircle 
} from 'lucide-react';
import { PromoBadge } from '../common/Badge';

export const WalletView: React.FC = () => {
  const { 
    currentUser, 
    transactions, 
    grantStarterTokens 
  } = useApp();

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);

  const totalEarned = userTransactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = userTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const handleDemoGrant = () => {
    grantStarterTokens(currentUser.id, 50, 'University Semester Learning Stipend');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 py-8 space-y-10 pb-16">
      
      {/* Header */}
      <div className="border-b border-hairline pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mute mb-2">
            <span>CAMPUS SKILLPOINTS LEDGER (PRD 3.12)</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink uppercase tracking-tight">
            WALLET & TRANSACTION LEDGER
          </h1>
          <p className="text-xs sm:text-sm text-mute font-normal mt-1 max-w-2xl">
            Append-only financial ledger for university peer learning. SkillPoints are strictly non-monetary, held in escrow during booked sessions, and released upon confirmed peer completion.
          </p>
        </div>

        <button
          onClick={handleDemoGrant}
          className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          title="Simulate Campus Semester Grant (+50 ⚡)"
        >
          <Zap className="w-3.5 h-3.5 fill-ink" />
          <span>+ CLAIM 50 ⚡ SEMESTER GRANT</span>
        </button>
      </div>

      {/* 1. BALANCE TILES MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-ink text-on-primary p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-hairline">
            <span>Available Balance</span>
            <Zap className="w-4 h-4 text-on-primary fill-on-primary" />
          </div>
          <div className="my-4">
            <div className="font-display text-6xl text-on-primary leading-none">
              {currentUser.walletBalance}
            </div>
            <div className="text-xs text-hairline font-bold uppercase mt-1">
              Ready for Bookings
            </div>
          </div>
          <div className="text-[11px] text-hairline pt-3 border-t border-canvas/20">
            1 hr session ≈ 15–20 ⚡ tokens
          </div>
        </div>

        {/* Escrow Locked */}
        <div className="bg-canvas border border-hairline p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-mute">
            <span>Locked in Escrow</span>
            <Lock className="w-4 h-4 text-ink" />
          </div>
          <div className="my-4">
            <div className="font-display text-6xl text-ink leading-none">
              {currentUser.escrowBalance}
            </div>
            <div className="text-xs text-mute font-bold uppercase mt-1">
              Safeguarded in Transit
            </div>
          </div>
          <div className="text-[11px] text-success font-semibold pt-3 border-t border-hairline-soft">
            Released upon session rating
          </div>
        </div>

        {/* Lifetime Teaching Earned */}
        <div className="bg-canvas border border-hairline p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-mute">
            <span>Lifetime Earned</span>
            <ArrowDownLeft className="w-4 h-4 text-success" />
          </div>
          <div className="my-4">
            <div className="font-display text-6xl text-ink leading-none">
              {totalEarned}
            </div>
            <div className="text-xs text-mute font-bold uppercase mt-1">
              From Peer Tutoring & Workshops
            </div>
          </div>
          <div className="text-[11px] text-mute pt-3 border-t border-hairline-soft">
            Includes Quiz & Karma bonuses
          </div>
        </div>

        {/* Lifetime Spent */}
        <div className="bg-canvas border border-hairline p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-mute">
            <span>Lifetime Spent</span>
            <ArrowUpRight className="w-4 h-4 text-sale" />
          </div>
          <div className="my-4">
            <div className="font-display text-6xl text-ink leading-none">
              {totalSpent}
            </div>
            <div className="text-xs text-mute font-bold uppercase mt-1">
              Invested in Peer Learning
            </div>
          </div>
          <div className="text-[11px] text-mute pt-3 border-t border-hairline-soft">
            {currentUser.totalHoursLearned} hours learned across campus
          </div>
        </div>
      </div>

      {/* 2. ANTI-COLLUSION & GOVERNANCE POLICY CARD */}
      <div className="bg-soft-cloud border border-hairline p-6 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-ink">
            <ShieldCheck className="w-4 h-4 text-ink" />
            <span>PRD 3.12 Token Guardrails & Anti-Abuse Controls</span>
          </div>
          <p className="text-xs text-charcoal leading-relaxed">
            SkillSwap is a closed campus token economy. Tokens cannot be bought or converted to fiat cash. Daily teacher earnings are capped at 100 ⚡ to prevent gaming. Automated collusion detection flags repetitive reciprocal swaps between the same student pairs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-mute">
          <span>• Daily Cap: 100 ⚡</span>
          <span>• Escrow Resolution: 100% Guaranteed</span>
          <span>• No Negative Balances</span>
        </div>
      </div>

      {/* 3. IMMUTABLE APPEND-ONLY TRANSACTION LEDGER */}
      <section className="bg-canvas border border-hairline p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-ink uppercase tracking-tight">
              TRANSACTION AUDIT LEDGER ({userTransactions.length})
            </h3>
            <p className="text-xs text-mute font-medium">
              Cryptographically verified append-only campus ledger entries
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-hairline font-bold uppercase text-mute text-[10px] tracking-wider">
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Timestamp</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Amount (⚡)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft font-medium">
              {userTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-soft-cloud/50 transition-colors">
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 bg-soft-cloud text-ink rounded-full text-[10px] font-bold uppercase tracking-tight">
                      {tx.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-ink max-w-md">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-2 text-mute whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                      tx.status === 'SUCCESS' ? 'text-success' : 'text-mute'
                    }`}>
                      <span>•</span>
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className={`py-3.5 px-2 text-right font-display text-lg ${
                    tx.amount > 0 ? 'text-success' : 'text-sale'
                  }`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} ⚡
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
