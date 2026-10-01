import React from 'react';

export const PromoBadge: React.FC<{ label: string; variant?: 'default' | 'sale' | 'success' }> = ({ label, variant = 'default' }) => {
  if (variant === 'sale') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight bg-canvas text-sale border border-hairline uppercase">
        {label}
      </span>
    );
  }
  if (variant === 'success') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight bg-canvas text-success border border-hairline uppercase">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight bg-canvas text-ink border border-hairline uppercase">
      {label}
    </span>
  );
};

export const VerifiedBadge: React.FC<{ score?: number; size?: 'sm' | 'md' }> = ({ score, size = 'md' }) => {
  return (
    <span className={`inline-flex items-center gap-1 bg-ink text-on-primary rounded-full font-semibold tracking-tight ${
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
    }`}>
      <span className="text-[10px]">✓</span>
      <span>VERIFIED{score ? ` ${score}%` : ''}</span>
    </span>
  );
};

export const FilterChip: React.FC<{
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}> = ({ label, active, count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all active:scale-95 ${
        active 
          ? 'bg-ink text-on-primary' 
          : 'bg-canvas text-ink border border-hairline hover:border-charcoal'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] ${active ? 'text-stone' : 'text-mute'}`}>
          ({count})
        </span>
      )}
    </button>
  );
};
