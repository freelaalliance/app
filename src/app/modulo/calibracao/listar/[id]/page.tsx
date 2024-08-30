'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { UsuarioType } from '@/components/auth/schema/SchemaUsuario'
import { Separator } from '@/components/ui/separator'

import {
  CalibracoesInstrumentosEmpresaType,
  recuperarCalibracoesInstrumentosEmpresa,
} from '../api/Calibracao'
import { DataTable } from '../components/table/data-table-calibracao'

export default function Listar() {
  const queryClient = useQueryClient()

  const dadosSessaoUsuario: UsuarioType | undefined = queryClient.getQueryData([
    'dadosUsuario',
  ])

  const { data: listaCalibracoes, isLoading } = useQuery({
    queryKey: ['listaCalibracoes'],
    queryFn: recuperarCalibracoesInstrumentosEmpresa,
  })

  const listaCalibracoesUsuario: CalibracoesInstrumentosEmpresaType =
    listaCalibracoes
      ? listaCalibracoes.filter(
          (dados) =>
            dadosSessaoUsuario &&
            dados.calibracao.usuarioId === dadosSessaoUsuario.id,
        )
      : []
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Suas calibrações</h3>
      </div>
      <Separator />
      {isLoading ? (
        <div className="flex h-[240px] w-full items-center justify-center">
          <Loader2 className="animate-spin h-16 w-16 " />
        </div>
      ) : (
        <DataTable
          data={
            listaCalibracoesUsuario.length > 0
              ? listaCalibracoesUsuario.map((dados) => {
                  return {
                    id: dados.calibracao.id,
                    idInstrumento: dados.instrumento.id,
                    codigo: dados.instrumento.codigo,
                    nome: dados.instrumento.nome,
                    localizacao: dados.instrumento.localizacao,
                    marca: dados.instrumento.marca,
                    data: dados.calibracao.realizadoEm,
                    status: dados.calibracao.status,
                    certificado: dados.calibracao.certificado,
                  }
                })
              : []
          }
        />
      )}
    </div>
  )
}
