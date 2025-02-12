'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import { Card, CardContent } from '@/components/ui/card'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { listarPermissoesPerfil } from '../../../../api/Permissao'

export interface PermissaoPerfilProps {
  idPerfil: string
  idEmpresa: string
}

export function DialogPermissoesPerfil({
  idPerfil,
  idEmpresa,
}: PermissaoPerfilProps) {
  const { data: permissoesPerfil, isLoading } = useQuery({
    queryKey: ['listaPermissoesPerfil', idPerfil],
    queryFn: () => listarPermissoesPerfil(idPerfil),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const ViewPermissaoPerfil = dynamic(
    () => import('../../views/lista-permissoes-perfil'),
    {
      loading: () => <Loader2 className="text-center animate-spin h-6 w-6" />,
    }
  )

  const ViewVincularPerfil = dynamic(
    () => import('../../views/adiciona-permissao-perfil'),
    {
      loading: () => <Loader2 className="text-center animate-spin h-6 w-6" />,
    }
  )
  return (
    <DialogContent className="md:h-auto md:max-w-[48rem] md:space-y-2">
      <DialogHeader>
        <DialogTitle>Permissões do perfil</DialogTitle>
        <DialogDescription>
          Vincule ou desvincule permissões que os usuários deste perfil terão
          acessos
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col justify-center space-y-2">
        {!isLoading ? (
          <Tabs defaultValue="lista-permissoes">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lista-permissoes">
                Permissões do perfil
              </TabsTrigger>
              <TabsTrigger value="adicionar-permissao">
                Vincular permissão
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lista-permissoes">
              <Card>
                <CardContent className="mt-4">
                  <ViewPermissaoPerfil
                    idPerfil={idPerfil}
                    listaPermissoesVinculado={permissoesPerfil ?? []}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="adicionar-permissao">
              <Card>
                <CardContent className="mt-4">
                  <ViewVincularPerfil
                    idPerfil={idPerfil}
                    idEmpresa={idEmpresa}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Loader2 className="text-center animate-spin h-6 w-6" />
        )}
      </div>
    </DialogContent>
  )
}
