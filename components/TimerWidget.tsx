'use client';

import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { startTimeSession, stopTimeSession, getActiveTimeSession } from '@/lib/time-tracking';
import { Project } from '@/lib/supabase';

interface TimerWidgetProps {
  project: Project;
  userId: string;
  onStart?: (projectId: string) => void;
  onStop?: (projectId: string) => void;
}

export function TimerWidget({ project, userId, onStart, onStop }: TimerWidgetProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for active session on mount
  useEffect(() => {
    checkActiveSession();
  }, [userId]);

  // Timer effect
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

  const checkActiveSession = async () => {
    try {
      const activeSession = await getActiveTimeSession(userId);
      if (activeSession && activeSession.project_id === project.id) {
        setActiveSessionId(activeSession.id);
        setIsRunning(true);
        // Calculate elapsed time from start
        const startTime = new Date(activeSession.start_time);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(elapsed);
      }
    } catch (error) {
      console.error('Failed to check active session:', error);
    }
  };

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isRunning && activeSessionId) {
        // Stop the timer
        const stoppedSession = await stopTimeSession(activeSessionId);
        if (stoppedSession) {
          setIsRunning(false);
          setActiveSessionId(null);
          setElapsedSeconds(0);
          onStop?.(project.id);
        }
      } else {
        // Start the timer
        const newSession = await startTimeSession({
          projectId: project.id,
          userId,
          category: project.category,
        });

        if (newSession) {
          setActiveSessionId(newSession.id);
          setIsRunning(true);
          setElapsedSeconds(0);
          onStart?.(project.id);
        }
      }
    } catch (error) {
      console.error('Timer toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        isRunning
          ? 'bg-accent bg-opacity-10 border-accent timer-active'
          : 'bg-surface border-border hover:bg-surface-hover'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-3">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        ) : isRunning ? (
          <Square className="w-5 h-5 text-accent" />
        ) : (
          <Play className="w-5 h-5 text-text-muted" />
        )}
        <span className="font-medium">
          {isLoading ? 'Saving...' : isRunning ? 'Stop Timer' : 'Start Timer'}
        </span>
      </div>

      {isRunning && !isLoading && (
        <span className="text-lg font-bold text-accent">
          {formatDuration(elapsedSeconds)}
        </span>
      )}
    </button>
  );
}
