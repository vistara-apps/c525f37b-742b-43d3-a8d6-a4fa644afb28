'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}: MetricCardProps) {
  const trendColor = {
    up: 'text-accent',
    down: 'text-danger',
    neutral: 'text-text-muted',
  };

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-text-muted">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        {trend && trendValue && (
          <span className={`text-sm font-medium ${trendColor[trend]}`}>
            {trendValue}
          </span>
        )}
      </div>
      
      <div className="text-3xl font-bold mb-1">{value}</div>
      
      {subtitle && (
        <p className="text-sm text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
