'use client';

import { AppShell } from '@/components/AppShell';
import { MetricCard } from '@/components/MetricCard';
import { Clock, DollarSign, TrendingUp, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  // Mock data
  const metrics = {
    totalHours: 110,
    totalRevenue: 3400,
    totalExpenses: 1700,
    hourlyRate: 15.45,
    weeklyGrowth: '+12%',
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-text-muted">Your real hourly rate and growth signals</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Hours"
            value={`${metrics.totalHours}h`}
            subtitle="This month"
            icon={Clock}
            trend="up"
            trendValue="+8h"
          />
          
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle="Gross income"
            icon={DollarSign}
            trend="up"
            trendValue={metrics.weeklyGrowth}
          />
          
          <MetricCard
            title="Real Hourly Rate"
            value={formatCurrency(metrics.hourlyRate)}
            subtitle="After expenses"
            icon={Target}
            trend="up"
            trendValue="+$2.15"
          />
          
          <MetricCard
            title="Weekly Growth"
            value={metrics.weeklyGrowth}
            subtitle="Revenue trend"
            icon={TrendingUp}
            trend="up"
            trendValue="Scaling"
          />
        </div>

        {/* Insights Section */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-accent bg-opacity-10 border border-accent rounded-lg">
              <p className="text-sm font-medium mb-2">💡 Productivity Tip</p>
              <p className="text-text-muted">
                You spent 8hrs on marketing but only 2hrs building. Flip that ratio to maximize growth.
              </p>
            </div>
            
            <div className="p-4 bg-warning bg-opacity-10 border border-warning rounded-lg">
              <p className="text-sm font-medium mb-2">⚠️ Attention Needed</p>
              <p className="text-text-muted">
                Mobile App MVP is showing red signals. Consider pivoting or archiving.
              </p>
            </div>
            
            <div className="p-4 bg-primary bg-opacity-10 border border-primary rounded-lg">
              <p className="text-sm font-medium mb-2">🎯 Milestone Alert</p>
              <p className="text-text-muted">
                You're $100 away from your first $1K month. Keep pushing!
              </p>
            </div>
          </div>
        </div>

        {/* Unlock Premium */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Unlock Full Insights</h3>
          <p className="text-text-muted mb-6">
            Get personalized recommendations and kill-or-scale signals for just $0.50/week
          </p>
          <button className="btn-primary">Unlock for $0.50</button>
        </div>
      </div>
    </AppShell>
  );
}
