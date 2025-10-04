'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createProject, updateProject } from '@/lib/projects';
import { Project } from '@/lib/supabase';

interface ProjectFormProps {
  userId: string;
  project?: Project;
  onClose: () => void;
  onSuccess: (project: Project) => void;
}

export function ProjectForm({ userId, project, onClose, onSuccess }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '');
  const [category, setCategory] = useState<'building' | 'marketing' | 'admin' | 'learning'>(
    project?.category || 'building'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'building', label: 'Building', description: 'Development, coding, product work' },
    { value: 'marketing', label: 'Marketing', description: 'Promotion, sales, customer acquisition' },
    { value: 'admin', label: 'Admin', description: 'Planning, management, operations' },
    { value: 'learning', label: 'Learning', description: 'Research, courses, skill development' },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let result: Project | null;

      if (project) {
        // Update existing project
        result = await updateProject(project.id, { name: name.trim(), category });
      } else {
        // Create new project
        result = await createProject({
          name: name.trim(),
          category,
          userId,
        });
      }

      if (result) {
        onSuccess(result);
        onClose();
      } else {
        setError('Failed to save project. Please try again.');
      }
    } catch (err) {
      console.error('Project save error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SaaS Dashboard MVP"
              className="w-full px-3 py-2 bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Category
            </label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.value} className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-surface-hover cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={(e) => setCategory(e.target.value as typeof category)}
                    className="text-accent focus:ring-accent"
                  />
                  <div>
                    <div className="font-medium">{cat.label}</div>
                    <div className="text-sm text-text-muted">{cat.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-danger bg-opacity-10 border border-danger rounded-md">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

