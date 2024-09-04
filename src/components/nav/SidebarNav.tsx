'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { listarPermissoesModuloPerfil } from '@/app/modulo/administrativo/empresa/api/Permissao'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SidebarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const regexIdModulo = /\[id\]/g
  let idModulo = null

  if (typeof window !== 'undefined') {
    idModulo = localStorage.getItem('modulo')
  }

  const { data: listaPermissoesPerfil, isLoading: carregandoPermissoes } =
    useQuery({
      queryKey: ['permissoesModuloPerfil', idModulo],
      queryFn: () => listarPermissoesModuloPerfil(idModulo),
      staleTime: Infinity,
    })

  const sidebarNavItems = listaPermissoesPerfil
    ? listaPermissoesPerfil?.map((funcao) => {
        if (idModulo) {
          if (regexIdModulo.test(funcao.url)) {
            return {
              href: funcao.url.replace(regexIdModulo, idModulo),
              title: funcao.nome,
            }
          } else {
            return {
              href: funcao.url + '/' + idModulo,
              title: funcao.nome,
            }
          }
        }

        return {
          href: '',
          title: '',
        }
      })
    : []

  return (
    <nav
      className={cn(
        'flex space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-1 container',
        className,
      )}
      {...props}
    >
      <Link
        key={uuidv4()}
        onClick={() => {
          localStorage.clear()
        }}
        href={'/home'}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'bg-padrao-gray-200 hover:bg-padrao-gray-250 justify-center lg:justify-between shadow-md text-padrao-white hover:text-white capitalize inline-flex',
        )}
      >
        <ChevronLeft className="hidden lg:flex" />
        {'Voltar'}
      </Link>

      {carregandoPermissoes ? (
        <Loader2 className="animate-spin" />
      ) : (
        sidebarNavItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname.includes(item.href)
                  ? 'bg-sky-600  hover:bg-sky-700 '
                  : 'bg-sky-400 hover:bg-sky-500',
                'lg:justify-between shadow-md text-padrao-white justify-center hover:text-white capitalize inline-flex min-w-[90px]',
              )}
            >
              {item.title}
              {pathname.includes(item.href) && (
                <ChevronRight className="hidden lg:flex" />
              )}
            </Link>
          )
        })
      )}
    </nav>
  )
}
