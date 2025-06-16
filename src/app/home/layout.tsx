import type { Metadata } from 'next'

import { HeaderApp } from '@/components/header/header'

interface HomeLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'ERP | Home',
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <HeaderApp />
      <main className='space-y-6 pb-16 md:block mt-4 px-6 lg:px-8'>{children}</main>
    </>
  )
}
