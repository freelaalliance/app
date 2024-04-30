'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFuncoesModulo, useModulos } from '@/lib/CaseAtom'

import {
  listarFuncoesModulo,
  listarModulosEmpresa,
} from '../../../api/Permissao'
import {
  PermissaoPerfilType,
  PermissaoVinculadoPerfilType,
} from '../../../schemas/SchemaModulo'
import { PermissaoPerfilProps } from '../components/dialogs/DialogPermissoesPerfil'
import { ListaFuncoes } from '../components/selects/lista-funcoes'
import { ListaModulos } from '../components/selects/lista-modulos'
import { DataTablePermissoesVinculadasPerfil } from '../components/tabela/permissoes-vinvulado-perfil/tabela-permissoes-vinculados'

export default function AdicionarPermissaoPerfil({
  idPerfil,
  idEmpresa,
}: PermissaoPerfilProps) {
  const [moduloSelecionado] = useModulos()
  const [funcaoSelecionado] = useFuncoesModulo()
  const [permissoesVinculadasPerfil, setarPermissoesVinculadasPerfil] =
    React.useState<Array<PermissaoVinculadoPerfilType>>([])

  const { data: listaModulos, isLoading: carregandoDados } = useQuery({
    queryKey: ['listaModulosEmpresa', idEmpresa],
    queryFn: () => listarModulosEmpresa(idEmpresa),
    staleTime: Infinity,
  })

  const idModulo = moduloSelecionado.selected

  const { data: funcoesModulo, isLoading: buscandoFuncoes } = useQuery({
    queryKey: ['listaFuncoesModulo', idModulo],
    queryFn: () => listarFuncoesModulo(idModulo),
    staleTime: Infinity,
  })
  const queryClient = useQueryClient()
  const listaPermissoesPerfil: Array<PermissaoPerfilType> | undefined =
    queryClient.getQueryData(['listaPermissoesPerfil', idPerfil])

  const funcoesNaoVinculados =
    funcoesModulo?.filter((funcao) => {
      if (listaPermissoesPerfil) {
        const verificaPermissaoExistente = listaPermissoesPerfil.some(
          (permissao) => permissao.id === funcao.id,
        )

        return !verificaPermissaoExistente
      }
      return true
    }) ?? []

  const vincularPermissao = () => {
    const funcao = funcoesModulo?.find(
      (funcao) => funcao.id === funcaoSelecionado.selected,
    )

    const modulo = listaModulos?.find(
      (modulo) => modulo.id === moduloSelecionado.selected,
    )

    if (funcao && modulo) {
      if (
        permissoesVinculadasPerfil.find(
          (permissao) => permissao.id === funcao.id,
        )
      ) {
        toast.info('Essa função já foi vinculado as permissões deste perfil')
      } else {
        setarPermissoesVinculadasPerfil([
          ...permissoesVinculadasPerfil,
          {
            id: funcao?.id,
            nome: funcao?.nome,
            moduloNome: modulo?.nome,
          },
        ])
      }
    } else {
      toast.warning(
        'Necessário selecionar o módulo e a função antes de vincular',
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-center md:justify-between md:flex-row md:space-x-2 space-y-2 md:space-y-0">
        <ListaModulos
          listaModulos={listaModulos ?? []}
          buscandoModulos={carregandoDados}
        />
        <ListaFuncoes
          listaFuncoes={funcoesNaoVinculados}
          buscandoFuncoes={buscandoFuncoes}
        />
        <Button
          title="Adicionar permissão"
          size={'icon'}
          className="shadow bg-emerald-600 hover:bg-emerald-700 md:w-24 w-full gap-2 md:gap-0"
          onClick={vincularPermissao}
        >
          <Plus className="h-6 w-auto" />
          <span className="md:hidden">Adicionar</span>
        </Button>
      </div>
      <Separator />
      <div>
        <DataTablePermissoesVinculadasPerfil
          data={permissoesVinculadasPerfil}
          idPerfil={idPerfil}
          removerPermissoes={(ids: Array<string>) => {
            ids.forEach((id) => {
              setarPermissoesVinculadasPerfil(
                permissoesVinculadasPerfil.filter(
                  (permissao) => permissao.id !== id,
                ),
              )
            })
          }}
        />
      </div>
    </div>
  )
}
