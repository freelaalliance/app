'use client'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/react-query'

export interface ModuloLayoutProps {
  children: React.ReactNode
}

export default function Providers({ children }: ModuloLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
