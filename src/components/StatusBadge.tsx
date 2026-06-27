import React from 'react';

export interface StatusBadgeProps {
  status?: string;
  active?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ status, active, activeLabel = 'Published', inactiveLabel = 'Draft' }: StatusBadgeProps) {
  const isActive = status ? status === 'published' || status === 'active' : !!active;
  const badgeClass = isActive ? 'badge badge-active' : 'badge badge-read';
  return (
    <span className={badgeClass}>
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
