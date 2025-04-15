'use client'

import { useQuery } from "@tanstack/react-query";
import { ListaEmpresas } from "../../../empresa/components/selects/ListaEmpresas";
import { buscarListaCategoriasDocumento } from "../../_api/AdmDocumentos";
import { TabelaCategoriaDocumentos } from "../_components/tabelas/tabela-categorias-documentos";
import { useEmpresa } from "@/lib/CaseAtom";

export default function AdmDocumentosPage() {
  const [empresaSelecionada] = useEmpresa()

  const categoriasDocumento = useQuery({
    queryKey: [
      'categoriasDocumento',
      empresaSelecionada.selected,
    ],
    queryFn: () =>
      buscarListaCategoriasDocumento({
        empresaId: empresaSelecionada.selected ?? ''
      }),
    enabled: !!empresaSelecionada.selected,
    initialData: [],
  })

  return (
    <div className="space-y-4">
      <section className="shadow-lg rounded-lg p-4 bg-zinc-200 space-y-2">
        <div className="flex flex-row justify-center md:justify-start space-x-2">
          <ListaEmpresas />
        </div>
      </section>
      <TabelaCategoriaDocumentos 
        carregandoCategorias={categoriasDocumento.isFetching} 
        listaCategorias={categoriasDocumento.data ?? []} 
        empresaId={empresaSelecionada.selected ?? ''}
      />
    </div>
  )
}