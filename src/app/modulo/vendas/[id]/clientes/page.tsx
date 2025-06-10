'use client'

import { TabelaClientes } from "../../_components/clientes/tabelas/tabela-clientes";
import { useClientes } from "../../_servicos/useClientes";

export default function ClientesPage() {

  const { data, isFetching } = useClientes()

  return (
    <section className="space-y-4">
      <TabelaClientes listaClientes={data ?? []} carregandoClientes={isFetching} />
    </section>
  )
}