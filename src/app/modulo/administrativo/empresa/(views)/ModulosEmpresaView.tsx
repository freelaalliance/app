'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useModulos } from '@/lib/CaseAtom'

import { DataTableModulos } from '../(components)/modulos/components/tabela/modulos-vinculados/lista-modulos'
import { ListaModulos } from '../(components)/perfil/components/selects/lista-modulos'
import type { EmpresaViewProps } from '../[id]/page'
import {
  adicionarModulosEmpresa,
  buscarListaModulosSistema,
} from '../api/Empresa'
import { listarModulosEmpresa } from '../api/Permissao'
import type { ModuloType } from '../schemas/SchemaModulo'

export default function ModulosEmpresa({ idEmpresa }: EmpresaViewProps) {
  const queryClient = useQueryClient()
  const [moduloSelecionado] = useModulos()
  const { data: listaModulosEmpresa, isLoading: carregandoModulosEmpresa } =
    useQuery({
      queryKey: ['listaModulosVinculadosEmpresa', idEmpresa],
      queryFn: () => listarModulosEmpresa(idEmpresa),
      staleTime: Number.POSITIVE_INFINITY,
    })

  const { data: listaModulos, isLoading: carregandoListaModulos } = useQuery({
    queryKey: ['listaModulosSistema'],
    queryFn: buscarListaModulosSistema,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const modulosNaoVinculado =
    listaModulos?.filter(modulo => {
      if (listaModulosEmpresa) {
        const moduloVinculado = listaModulosEmpresa.some(
          moduloEmpresa => moduloEmpresa.id === modulo.id
        )

        return !moduloVinculado
      }

      return true
    }) ?? []

  const { mutateAsync: vincularModuloEmpresa, isPending } = useMutation({
    mutationFn: ({
      idEmpresa,
      idModulo,
    }: {
      idEmpresa: string
      idModulo: string
    }) => adicionarModulosEmpresa(idEmpresa, idModulo),
    onMutate({ idModulo }: { idEmpresa: string; idModulo: string }) {
      const { cacheModulosEmpresa } = atualizarListaModulosEmpresa(idModulo)

      return { cacheModulosEmpresa }
    },
    onError(_, __, context) {
      if (context?.cacheModulosEmpresa) {
        queryClient.setQueryData(
          ['listaModulosVinculadosEmpresa', idEmpresa],
          context.cacheModulosEmpresa
        )
      }
      toast.error('Falha ao vincular módulo na empresa, tente novamente!')
    },
    onSuccess() {
      toast.success('Módulo vinculado com sucesso!')
    },
  })

  function atualizarListaModulosEmpresa(idModulo: string) {
    const cacheModulosEmpresa: Array<ModuloType> | undefined =
      queryClient.getQueryData(['listaModulosVinculadosEmpresa', idEmpresa])

    const moduloVinculado = listaModulos?.find(modulo => idModulo === modulo.id)

    if (moduloVinculado && cacheModulosEmpresa) {
      queryClient.setQueryData(
        ['listaModulosVinculadosEmpresa', idEmpresa],
        cacheModulosEmpresa.concat(moduloVinculado)
      )
    } else {
      toast.error('Problema ao atualizar modulos vinculados')
    }

    return { cacheModulosEmpresa }
  }

  return (
    <>
      <div className="flex flex-auto gap-2">
        <ListaModulos
          buscandoModulos={carregandoListaModulos}
          listaModulos={modulosNaoVinculado}
        />

        {!isPending ? (
          <Button
            className="shadow bg-sky-400 hover:bg-sky-500 flex justify-center md:justify-between gap-2 w-24 md:w-auto"
            disabled={!moduloSelecionado.selected}
            onClick={async () => {
              const idModulo: string | null = moduloSelecionado.selected

              if (idModulo) {
                vincularModuloEmpresa({ idEmpresa, idModulo })
              } else {
                toast.warning(
                  'Selecione o módulo que deseja vincular a esta empresa'
                )
              }
            }}
          >
            <Plus />
            <span className="hidden md:flex">Vincular</span>
          </Button>
        ) : (
          <Button
            className="shadow bg-sky-400 hover:bg-sky-500 flex md:justify-between gap-2 w-24 md:w-auto"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="hidden md:flex">Vinculando...</span>
          </Button>
        )}
      </div>
      <div className="flex-1">
        <DataTableModulos
          idEmpresa={idEmpresa}
          data={listaModulosEmpresa ?? []}
          carregandoDados={carregandoModulosEmpresa}
        />
      </div>
    </>
  )
}
