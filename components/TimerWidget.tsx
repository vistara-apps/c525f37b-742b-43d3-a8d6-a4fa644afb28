'use client';

import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface TimerWidgetProps {
  projectId: string;
  onStart?: (projectId: string) => void;
  onStop?: (projectId: string) => void;
}

export function TimerWidget({ projectId, onStart, onStop }: TimerWidgetProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
      onStop?.(projectId);
    } else {
      setIsRunning(true);
      setElapsedSeconds(0);
      onStart?.(projectId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        isRunning
          ? 'bg-accent bg-opacity-10 border-accent timer-active'
          : 'bg-surface border-border hover:bg-surface-hover'
      }`}
    >
      <div className="flex items-center gap-3">
        {isRunning ? (
          <Square className="w-5 h-5 text-accent" />
        ) : (
          <Play className="w-5 h-5 text-text-muted" />
        )}
        <span className="font-medium">
          {isRunning ? 'Stop Timer' : 'Start Timer'}
        </span>
      </div>
      
      {isRunning && (
        <span className="text-lg font-bold text-accent">
          {formatDuration(elapsedSeconds)}
        </span>
      )}
    </button>
  );
}
