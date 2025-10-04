'use client';

import { ReactNode, useState } from 'react';
import { Zap, BarChart3, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnect } from './WalletConnect';
import { User } from '@/lib/supabase';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navItems = [
    { href: '/', icon: Zap, label: 'Projects' },
    { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { href: '/settings', icon: Settings2, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">HustleScope</h1>
            <div className="flex items-center gap-4">
              <p className="text-sm text-text-muted hidden sm:block">
                Kill it or scale it
              </p>
              <WalletConnect onUserChange={setCurrentUser} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 glass-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-accent bg-opacity-10'
                      : 'text-text-muted hover:text-fg'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
