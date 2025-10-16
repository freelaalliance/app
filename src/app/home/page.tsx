'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Puzzle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { UsuarioType } from '@/components/auth/schema/SchemaUsuario'
import { LoadingCard } from '@/components/card-loading/CardLoading'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { buscarModuloPerfilUsuario } from './api/PermissaoUsuario'

export default function App() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const usuarioSessao: UsuarioType | undefined = queryClient.getQueryData([
    'dadosUsuario',
  ])

  const { data: listaModulosPerfilUsuario, isFetching: isLoading } = useQuery({
    queryKey: ['modulosPerfilUsuario'],
    queryFn: buscarModuloPerfilUsuario,
    staleTime: Number.POSITIVE_INFINITY,
  })

  function acessarModulo(id: string, url: string) {
    localStorage.setItem('modulo', id)
    const regexIdModulo = /\[id\]/g

    let novaUrl = `${url}/${id}`

    if (regexIdModulo.test(url)) {
      novaUrl = url.replace(regexIdModulo, id)
    }

    router.push(novaUrl)
  }

  return (
    <div className="space-y-6">
      <div className="flex-1 justify-center md:justify-start px-2 pt-4 text-center md:text-start">
        <h4 className="leading-none text-base md:text-lg lg:text-3xl font-bold">{`Olá ${usuarioSessao?.nome}, bem vindo(a) de volta!`}</h4>
        <span>{'Aqui estão os modulos que você tem acesso'}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-3 gap-4 px-2 pb-4">
        {isLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          listaModulosPerfilUsuario?.map(modulo => {
            return (
              <Card
                key={modulo.idModulo}
                className="shadow-md border-l-4 border-l-primary"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="capitalize text-sm md:text-xl font-medium select-none">
                    {modulo.nomeModulo}
                  </CardTitle>
                  <Puzzle />
                </CardHeader>
                <CardFooter>
                  <Button
                    className="shadow-md text-sm uppercase leading-none rounded w-full"
                    onClick={() => {
                      acessarModulo(modulo.idModulo, modulo.urlModulo)
                    }}
                  >
                    Acessar
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
