'use client';

import { getSignalBadgeClass } from '@/lib/utils';

interface SignalBadgeProps {
  signal: 'green' | 'yellow' | 'red';
  label?: string;
}

export function SignalBadge({ signal, label }: SignalBadgeProps) {
  const emoji = {
    green: '✅',
    yellow: '⚙️',
    red: '❌',
  };

  const text = {
    green: 'Scale',
    yellow: 'Optimize',
    red: 'Kill',
  };

  return (
    <span className={getSignalBadgeClass(signal)}>
      {emoji[signal]} {label || text[signal]}
    </span>
  );
}
