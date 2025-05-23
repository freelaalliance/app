'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { DataTablePerfil } from '../(components)/perfil/components/tabela/perfis/tabela-perfil'
import type { EmpresaViewProps } from '../[id]/page'
import { buscarListaPerfis } from '../api/Perfil'

export default function PerfisEmpresaView({ idEmpresa }: EmpresaViewProps) {
  const { data: listaPerfis, isLoading: carregandoPerfisEmpresa } = useQuery({
    queryKey: ['listaPerfisEmpresa', idEmpresa],
    queryFn: () => buscarListaPerfis(idEmpresa),
    staleTime: Number.POSITIVE_INFINITY,
  })

  return carregandoPerfisEmpresa ? (
    <div className="flex justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <DataTablePerfil data={listaPerfis ?? []} empresa={idEmpresa} />
  )
}
