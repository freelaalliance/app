import { Metadata } from 'next'

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
      <main className="md:container">{children}</main>
    </>
  )
}
