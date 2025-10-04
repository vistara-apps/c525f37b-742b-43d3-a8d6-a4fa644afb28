'use client';

import { useState, useEffect } from 'react';
import { useOnchainKit } from '@coinbase/onchainkit';
import { signInWithWallet, getCurrentUser, signOut } from '@/lib/auth';
import { User } from '@/lib/supabase';
import { Wallet, LogOut } from 'lucide-react';

interface WalletConnectProps {
  onUserChange?: (user: User | null) => void;
}

export function WalletConnect({ onUserChange }: WalletConnectProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected } = useOnchainKit();

  useEffect(() => {
    if (address && isConnected) {
      handleWalletConnected(address);
    } else if (!isConnected) {
      setUser(null);
      onUserChange?.(null);
    }
  }, [address, isConnected]);

  const handleWalletConnected = async (walletAddress: string) => {
    setIsConnecting(true);
    try {
      // Try to get existing user or create new one
      const dbUser = await signInWithWallet(walletAddress);
      if (dbUser) {
        setUser(dbUser);
        onUserChange?.(dbUser);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut();
      setUser(null);
      onUserChange?.(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg">
          <Wallet className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">
            {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="p-2 text-text-muted hover:text-fg transition-colors"
          title="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isConnecting ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Connecting...</span>
        </div>
      ) : (
        <div className="text-sm text-text-muted">
          Connect wallet to get started
        </div>
      )}
    </div>
  );
}

