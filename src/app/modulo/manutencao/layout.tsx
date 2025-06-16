import type { ModuloLayoutProps } from '@/app/provider'
import { HeaderApp } from '@/components/header/header'
import { SidebarNav } from '@/components/nav/SidebarNav'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ERP | Manutenção',
}

export default function LayoutModuloManutencao({
  children,
}: ModuloLayoutProps) {
  return (
    <>
      <HeaderApp />
      <main className="space-y-6 pb-16 md:block mt-4 px-6 lg:px-8">
        <section className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Módulo de manutenção
          </h2>
          <p className="text-muted-foreground">
            Gestão de infraestrutura, equipamentos, periféricos e itens críticos
            à organização
          </p>
        </section>
        <Separator className="my-6" />
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
