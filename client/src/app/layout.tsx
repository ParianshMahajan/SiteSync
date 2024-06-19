'use client';

import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  
  React.useEffect(()=>{
    if(localStorage.getItem('mui-mode') === 'light'){
      localStorage.setItem('mui-mode', 'dark');
    }
  })
  
  return (
    <html lang="en">
      <body>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </QueryClientProvider>
      </body>
    </html>
  );
}
