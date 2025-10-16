'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

import { UserNav } from '@/components/nav/UserNav'

import { recuperarDadosUsuarioSessao } from '../auth/api/AuthApi'

export function HeaderApp() {
  const { data, isLoading } = useQuery({
    queryKey: ['dadosUsuario'],
    queryFn: recuperarDadosUsuarioSessao,
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <header className="sticky top-0 z-50 w-full rounded-t-lg bg-white/60 backdrop-blur-sm shadow-lg">
      <div className="flex-col w-full">
        <div className="flex justify-between items-center px-4 h-16 md:h-24">
          <Image
            className="invisible md:visible my-2 rounded-sm ml-6"
            loading="lazy"
            alt="Alliance Sistemas de Gestão"
            width={150}
            height={150}
            src="/logo_alliance_colorido.png"
          />
          <div className="flex items-center mr-6">
            <UserNav
              usuario={
                data ?? {
                  id: 'naoinformado',
                  email: 'email@email.com',
                  nome: 'Usuário Teste',
                  perfil: 'perfil teste',
                }
              }
              carregandoDados={isLoading}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
