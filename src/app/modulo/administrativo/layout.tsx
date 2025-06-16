import type { Metadata } from 'next'

import { HeaderApp } from '@/components/header/header'
import { SidebarNav } from '@/components/nav/SidebarNav'

interface AdmLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'ERP | Administrativo',
  description: 'Gestão de clientes, seus usuários e permissões',
}

export default function AdmLayout({ children }: AdmLayoutProps) {
  return (
    <>
      <HeaderApp />
      <main className="space-y-6 pb-16 md:block mt-4 px-6 lg:px-8">
        <section className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-48">
            <SidebarNav />
          </aside>
          <div className="flex-1 -mx-0 max-w-full">{children}</div>
        </section>
      </main>
    </>
  )
}
