'use client'

import { TabelaProdutosServicos } from "../../_components/produtosServicos/tabelas/tabela-produtos-servicos-empresa"
import { useProdutosServicos } from "../../_servicos/useProdutoServico"

export default function ProdutosPage() {

  const produtosServicoEmpresa = useProdutosServicos()

  return(
    <section className="space-y-4">
      <TabelaProdutosServicos
        listaProdutos={produtosServicoEmpresa.data}
        carregandoProdutos={produtosServicoEmpresa.isRefetching}
      />
    </section>
  )
}