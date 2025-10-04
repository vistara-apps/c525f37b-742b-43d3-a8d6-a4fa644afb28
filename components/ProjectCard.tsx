'use client';

import { Project } from '@/lib/supabase';
import { formatCurrency, formatDuration, getSignalBadgeClass } from '@/lib/utils';
import { Clock, DollarSign, TrendingUp, Edit } from 'lucide-react';
import { TimerWidget } from './TimerWidget';

interface ProjectCardProps {
  project: Project;
  userId: string;
  onTimerStart?: (projectId: string) => void;
  onTimerStop?: (projectId: string) => void;
  onEdit?: (project: Project) => void;
}

export function ProjectCard({ project, userId, onTimerStart, onTimerStop, onEdit }: ProjectCardProps) {
  const signalEmoji = {
    green: '✅',
    yellow: '⚙️',
    red: '❌',
  };

  const signalText = {
    green: 'Scale',
    yellow: 'Optimize',
    red: 'Kill',
  };

  return (
    <div className={`glass-card p-6 transition-all duration-200 ${
      project.status === 'active' ? 'border-accent' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
          <span className="text-sm text-text-muted capitalize">{project.category}</span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(project)}
              className="p-1 text-text-muted hover:text-fg transition-colors"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <span className={getSignalBadgeClass(project.weeklySignal)}>
            {signalEmoji[project.weeklySignal]} {signalText[project.weeklySignal]}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Time</span>
          </div>
          <span className="text-lg font-semibold">
            {formatDuration(project.totalTimeInvested)}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs">Revenue</span>
          </div>
          <span className="text-lg font-semibold">
            {formatCurrency(project.totalRevenue)}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Growth</span>
          </div>
          <span className="text-lg font-semibold text-accent">+12%</span>
        </div>
      </div>

      {/* Timer Widget */}
      <TimerWidget
        project={project}
        userId={userId}
        onStart={onTimerStart}
        onStop={onTimerStop}
      />
    </div>
  );
}
