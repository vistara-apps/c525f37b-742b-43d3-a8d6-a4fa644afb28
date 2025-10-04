import { supabase, TimeSession } from './supabase';

export interface CreateTimeSessionData {
  projectId: string;
  userId: string;
  category: 'building' | 'marketing' | 'admin' | 'learning';
}

export interface ActiveTimer {
  sessionId: string;
  projectId: string;
  startTime: Date;
  category: 'building' | 'marketing' | 'admin' | 'learning';
}

// Start a new time session
export async function startTimeSession(sessionData: CreateTimeSessionData): Promise<TimeSession | null> {
  try {
    const { data, error } = await supabase
      .from('time_sessions')
      .insert({
        project_id: sessionData.projectId,
        user_id: sessionData.userId,
        start_time: new Date().toISOString(),
        category: sessionData.category,
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting time session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Start time session error:', error);
    return null;
  }
}

// Stop a time session
export async function stopTimeSession(sessionId: string): Promise<TimeSession | null> {
  try {
    const endTime = new Date().toISOString();

    // First get the session to calculate duration
    const { data: session, error: fetchError } = await supabase
      .from('time_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      return null;
    }

    // Calculate duration in seconds
    const startTime = new Date(session.start_time);
    const endTimeDate = new Date(endTime);
    const duration = Math.floor((endTimeDate.getTime() - startTime.getTime()) / 1000);

    // Update the session with end time and duration
    const { data, error } = await supabase
      .from('time_sessions')
      .update({
        end_time: endTime,
        duration: duration,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error stopping time session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Stop time session error:', error);
    return null;
  }
}

// Get active time session for a user
export async function getActiveTimeSession(userId: string): Promise<TimeSession | null> {
  try {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('end_time', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error getting active session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get active time session error:', error);
    return null;
  }
}

// Get time sessions for a project
export async function getProjectTimeSessions(projectId: string): Promise<TimeSession[]> {
  try {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .eq('project_id', projectId)
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching project time sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get project time sessions error:', error);
    return [];
  }
}

// Get time sessions for a user within a date range
export async function getUserTimeSessions(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<TimeSession[]> {
  try {
    let query = supabase
      .from('time_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false });

    if (startDate) {
      query = query.gte('start_time', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('start_time', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user time sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get user time sessions error:', error);
    return [];
  }
}

