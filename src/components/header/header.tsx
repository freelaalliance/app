'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

import { UserNav } from '@/components/nav/UserNav'

import { recuperarDadosUsuarioSessao } from '../auth/api/AuthApi'

export function HeaderApp() {
  const { data, isLoading } = useQuery({
    queryKey: ['dadosUsuario'],
    queryFn: recuperarDadosUsuarioSessao,
    staleTime: Infinity,
  })

  return (
    <header>
      <div className="flex-col w-full">
        <div className="border-b">
          <div className="flex itens-center px-4 h-16 md:h-24">
            <Image
              className="invisible md:visible my-2 rounded-sm"
              loading="lazy"
              alt="Alliance Sistemas de Gestão"
              width={160}
              height={160}
              src="/logo_alliance.png"
            />
            <div className="ml-auto flex items-center space-x-4">
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
      </div>
    </header>
  )
}
