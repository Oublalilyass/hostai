'use client';
// src/app/providers.tsx
// Client-only wrapper to prevent SSR hydration mismatches

import { AuthProvider } from '@/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
