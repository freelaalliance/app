'use client'

import { useQuery } from "@tanstack/react-query";
import { ListaEmpresas } from "../../../empresa/components/selects/ListaEmpresas";
import { buscarListaCategoriasDocumento } from "../../_api/AdmDocumentos";
import { TabelaCategoriaDocumentos } from "../_components/tabelas/tabela-categorias-documentos";
import { useEmpresa } from "@/lib/CaseAtom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buscarDocumentosEmpresa } from "@/app/modulo/documentos/_api/documentos";
import { TabelaDocumentos } from "@/app/modulo/documentos/[id]/novo/_components/tables/documentos/tabela-documentos";
import { ColunasDocumentosEmpresaAdmin } from "@/app/modulo/documentos/[id]/novo/_components/tables/documentos/colunas-tabela-documentos-empresa-admin";
import { listarEmpresas } from "../../../empresa/api/Empresa";

export default function AdmDocumentosPage() {
  const [empresaSelecionada] = useEmpresa()

  const { data: dadosEmpresas, isFetching: carregandoDados } = useQuery({
    queryKey: ['empresas'],
    queryFn: listarEmpresas,
    initialData: [],
  })

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

  const documentosEmpresaAdmin = useQuery({
    queryKey: ['documentosEmpresaAdmin', empresaSelecionada.selected],
    queryFn: () => buscarDocumentosEmpresa(empresaSelecionada.selected),
    enabled: !!empresaSelecionada.selected,
    initialData: [],
  })

  return (
    <div className="space-y-4">
      <section className="shadow-lg rounded-lg p-4 bg-zinc-200 space-y-2">
        <div className="flex flex-row justify-center md:justify-start space-x-2">
          <ListaEmpresas listaEmpresas={dadosEmpresas} carregandoDados={carregandoDados} />
        </div>
      </section>
      <Tabs defaultValue="documentos">
        <TabsList className="flex flex-row bg-transparent space-x-2 justify-between md:justify-start">
          <TabsTrigger className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 w-full" value="documentos">Documentos</TabsTrigger>
          <TabsTrigger className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 w-full" value="categorias">Categorias de documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="documentos">
          <TabelaDocumentos
            carregandoDados={documentosEmpresaAdmin.isFetching}
            colunasDocumento={ColunasDocumentosEmpresaAdmin}
            dadosDocumentos={documentosEmpresaAdmin.data ?? []}
            categoriasDocumento={categoriasDocumento.data ?? []}
          />
        </TabsContent>
        <TabsContent value="categorias">
          <TabelaCategoriaDocumentos
            carregandoCategorias={categoriasDocumento.isFetching}
            listaCategorias={categoriasDocumento.data ?? []}
            empresaId={empresaSelecionada.selected ?? ''}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}