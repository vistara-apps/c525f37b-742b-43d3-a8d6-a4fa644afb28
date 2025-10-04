'use client';

import { AppShell } from '@/components/AppShell';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { Bell, User, Zap } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-text-muted">Manage your account and preferences</p>
        </div>

        {/* Wallet Connection */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Wallet Connection
          </h3>
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10" />
                <Name />
              </div>
            </ConnectWallet>
          </Wallet>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm">Weekly digest</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Milestone alerts</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Signal changes</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
          </div>
        </div>

        {/* Premium */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Premium Features
          </h3>
          <p className="text-text-muted mb-4">
            Unlock advanced insights and kill-or-scale signals
          </p>
          <button className="btn-primary w-full">Upgrade to Premium</button>
        </div>
      </div>
    </AppShell>
  );
}
