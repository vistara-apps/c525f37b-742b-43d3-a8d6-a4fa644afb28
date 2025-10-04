'use client';

import { AppShell } from '@/components/AppShell';
import { ProjectCard } from '@/components/ProjectCard';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Project } from '@/lib/supabase';

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'SaaS Dashboard',
    status: 'active',
    category: 'building',
    createdAt: new Date().toISOString(),
    totalTimeInvested: 144000, // 40 hours
    totalRevenue: 2500,
    totalExpenses: 500,
    weeklySignal: 'green',
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Content Marketing',
    status: 'active',
    category: 'marketing',
    createdAt: new Date().toISOString(),
    totalTimeInvested: 72000, // 20 hours
    totalRevenue: 800,
    totalExpenses: 200,
    weeklySignal: 'yellow',
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Mobile App MVP',
    status: 'paused',
    category: 'building',
    createdAt: new Date().toISOString(),
    totalTimeInvested: 180000, // 50 hours
    totalRevenue: 100,
    totalExpenses: 1000,
    weeklySignal: 'red',
  },
];

export default function HomePage() {
  const [projects] = useState<Project[]>(mockProjects);

  const handleTimerStart = (projectId: string) => {
    console.log('Timer started for project:', projectId);
  };

  const handleTimerStop = (projectId: string) => {
    console.log('Timer stopped for project:', projectId);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Projects</h2>
            <p className="text-text-muted">
              Track time, money, and momentum across your side hustles
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onTimerStart={handleTimerStart}
              onTimerStop={handleTimerStop}
            />
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-text-muted mb-6">
              Start tracking your first side hustle to see insights
            </p>
            <button className="btn-primary">Create Your First Project</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
