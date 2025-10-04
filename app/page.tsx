'use client';

import { AppShell } from '@/components/AppShell';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectForm } from '@/components/ProjectForm';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Project, User } from '@/lib/supabase';
import { getUserProjects } from '@/lib/projects';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  // Load projects when user changes
  useEffect(() => {
    if (currentUser) {
      loadProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const loadProjects = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const userProjects = await getUserProjects(currentUser.id);
      setProjects(userProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimerStart = (projectId: string) => {
    console.log('Timer started for project:', projectId);
  };

  const handleTimerStop = (projectId: string) => {
    console.log('Timer stopped for project:', projectId);
  };

  const handleCreateProject = () => {
    setEditingProject(undefined);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleProjectFormSuccess = (project: Project) => {
    loadProjects(); // Reload projects
  };

  const handleProjectFormClose = () => {
    setShowProjectForm(false);
    setEditingProject(undefined);
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
          {currentUser && (
            <button
              onClick={handleCreateProject}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Project</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Not Connected State */}
        {!currentUser && !isLoading && (
          <div className="glass-card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-text-muted mb-6">
              Connect your wallet to start tracking your side hustles and get ROI insights
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {currentUser && !isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userId={currentUser.id}
                  onTimerStart={handleTimerStart}
                  onTimerStop={handleTimerStop}
                  onEdit={() => handleEditProject(project)}
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
                <button onClick={handleCreateProject} className="btn-primary">
                  Create Your First Project
                </button>
              </div>
            )}
          </>
        )}

        {/* Project Form Modal */}
        {showProjectForm && currentUser && (
          <ProjectForm
            userId={currentUser.id}
            project={editingProject}
            onClose={handleProjectFormClose}
            onSuccess={handleProjectFormSuccess}
          />
        )}
      </div>
    </AppShell>
  );
}
