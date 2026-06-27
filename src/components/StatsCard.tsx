import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href?: string;
  accent?: 'primary' | 'gold' | 'red';
}

export function StatsCard({ label, value, icon, href, accent = 'primary' }: StatsCardProps) {
  const accentColor = accent === 'gold' ? 'var(--gold)' : accent === 'red' ? 'var(--red)' : 'var(--primary)';

  const content = (
    <div className="glass-card stat-card glass-card-hover" style={{ cursor: href ? 'pointer' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: accent === 'gold' ? 'var(--gold-glow)' : accent === 'red' ? 'var(--red-glow)' : 'var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <span className="stat-val" style={{ fontSize: '1.75rem' }}>{value}</span>
          <span className="stat-label" style={{ display: 'block' }}>{label}</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>;
  }
  return content;
}
