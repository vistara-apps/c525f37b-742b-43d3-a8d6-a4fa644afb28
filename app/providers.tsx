'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
      chain={base}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </OnchainKitProvider>
  );
}
