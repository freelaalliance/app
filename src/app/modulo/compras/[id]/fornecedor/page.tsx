'use client'

import { useQuery } from '@tanstack/react-query'

import { buscarFornecedores } from './(api)/FornecedorApi'
import { TabelaFornecedores } from './components/tabelas/fornecedores/tabela-fornecedores'

export default function PageFornecedores() {
  const fornecedoresEmpresa = useQuery({
    queryKey: ['fornecedoresEmpresa'],
    queryFn: buscarFornecedores,
    staleTime: Infinity,
  })

  return (
    <section className="space-y-4">
      <TabelaFornecedores
        listaFornecedores={fornecedoresEmpresa.data ?? []}
        carregandoFornecedores={fornecedoresEmpresa.isLoading}
      />
    </section>
  )
}
