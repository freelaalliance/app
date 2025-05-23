'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { DataTableUsuarios } from '../(components)/usuarios/components/tabela/lista-usuarios/tabela-usuarios'
import type { EmpresaViewProps } from '../[id]/page'
import { buscarUsuariosEmpresa } from '../api/Empresa'

export default function UsuariosEmpresaView({ idEmpresa }: EmpresaViewProps) {
  const { data: listaUsuarios, isLoading: carregandoUsuariosEmpresa } =
    useQuery({
      queryKey: ['listaUsuariosEmpresa', idEmpresa],
      queryFn: () => buscarUsuariosEmpresa(idEmpresa),
      staleTime: Number.POSITIVE_INFINITY,
    })

  return carregandoUsuariosEmpresa ? (
    <div className="flex justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <DataTableUsuarios data={listaUsuarios ?? []} empresa={idEmpresa} />
  )
}
