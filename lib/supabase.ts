import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  walletAddress: string;
  farcasterFid?: string;
  createdAt: string;
  totalProjectsTracked: number;
  streakDays: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  status: 'active' | 'paused' | 'killed' | 'scaled';
  category: 'building' | 'marketing' | 'admin' | 'learning';
  createdAt: string;
  totalTimeInvested: number;
  totalRevenue: number;
  totalExpenses: number;
  weeklySignal: 'green' | 'yellow' | 'red';
}

export interface TimeSession {
  id: string;
  projectId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  category: 'building' | 'marketing' | 'admin' | 'learning';
  onChainProof?: string;
}

export interface IncomeEntry {
  id: string;
  projectId: string;
  userId: string;
  amount: number;
  source: string;
  date: string;
  isRecurring: boolean;
}

export interface ExpenseEntry {
  id: string;
  projectId: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
}
