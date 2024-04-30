import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import '@/styles/globals.css'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

import Providers from './provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'ERP',
  description: 'ERP Alliance Sistemas de gestão',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          'min-h-screen dark:bg-gradient-to-b md:bg-gradient-to-br from-padrao-white from-10% via-padrao-gray-100 via-85% to-padrao-gray-200 to-100% font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  )
}
