import { supabase, Project } from './supabase';

export interface CreateProjectData {
  name: string;
  category: 'building' | 'marketing' | 'admin' | 'learning';
  userId: string;
}

export interface UpdateProjectData {
  name?: string;
  status?: 'active' | 'paused' | 'killed' | 'scaled';
  category?: 'building' | 'marketing' | 'admin' | 'learning';
}

// Get all projects for a user
export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get user projects error:', error);
    return [];
  }
}

// Create a new project
export async function createProject(projectData: CreateProjectData): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: projectData.userId,
        name: projectData.name,
        category: projectData.category,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Create project error:', error);
    return null;
  }
}

// Update a project
export async function updateProject(projectId: string, updates: UpdateProjectData): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Update project error:', error);
    return null;
  }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete project error:', error);
    return false;
  }
}

// Get a single project
export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get project error:', error);
    return null;
  }
}

