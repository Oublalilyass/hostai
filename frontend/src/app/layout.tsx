// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'HostAI — AI Assistant for Airbnb Hosts',
  description: 'Automate check-in, check-out, guest messaging and cleaning with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
