import { supabase, User } from './supabase';

export interface WalletUser {
  address: string;
  farcasterFid?: string;
}

// Get current wallet user from MiniKit
export async function getWalletUser(): Promise<WalletUser | null> {
  try {
    // This will be implemented with MiniKit
    // For now, return null
    return null;
  } catch (error) {
    console.error('Failed to get wallet user:', error);
    return null;
  }
}

// Sign in with wallet
export async function signInWithWallet(walletAddress: string, farcasterFid?: string): Promise<User | null> {
  try {
    // First, check if user exists
    let { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user:', fetchError);
      return null;
    }

    if (existingUser) {
      // Update farcaster FID if provided and different
      if (farcasterFid && existingUser.farcaster_fid !== farcasterFid) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ farcaster_fid: farcasterFid })
          .eq('wallet_address', walletAddress)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          return existingUser;
        }

        return updatedUser;
      }

      return existingUser;
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        farcaster_fid: farcasterFid,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return null;
    }

    return newUser;
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
}

// Get current user from database
export async function getCurrentUser(walletAddress: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    // Clear any local session data
    // MiniKit sign out will be handled separately
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

