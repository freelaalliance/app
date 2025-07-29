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
import { buscarUsuariosEmpresa, listarEmpresas } from "../../../empresa/api/Empresa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NovoDocumentoForm } from "@/app/modulo/documentos/[id]/novo/_components/forms/novo-documento-form";

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

  const { data: listaUsuarios, isFetching: carregandoUsuariosEmpresa } =
    useQuery({
      queryKey: ['listaUsuariosEmpresa', empresaSelecionada.selected],
      queryFn: () => buscarUsuariosEmpresa(empresaSelecionada.selected ?? ''),
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
<TabsTrigger className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 w-full" value="categorias">Categorias de documentos</TabsTrigger>
          <TabsTrigger className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 w-full" value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias">
          
          <TabelaCategoriaDocumentos
            carregandoCategorias={categoriasDocumento.isFetching}
            listaCategorias={categoriasDocumento.data ?? []}
            empresaId={empresaSelecionada.selected ?? ''}
          />
        </TabsContent>
        <TabsContent value="documentos">
          <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
            <Dialog>
              <DialogTrigger asChild >
                <Button 
                  className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto" 
                  disabled={!empresaSelecionada.selected || carregandoUsuariosEmpresa}
                >
                  Novo documento
                </Button>
              </DialogTrigger>
              <DialogContent className="overflow-auto max-h-full max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Criar novo documento</DialogTitle>
                  <DialogDescription>
                    Crie um novo documento para o seu cliente ou fornecedor
                  </DialogDescription>
                </DialogHeader>
                <NovoDocumentoForm
                  listaCategoriasDocumentos={!categoriasDocumento.isFetching ? (categoriasDocumento.data ?? []) : []}
                  listaUsuarios={listaUsuarios}
                  empresaId={empresaSelecionada.selected ?? ''}
                />
              </DialogContent>
            </Dialog>
          </div>
          <TabelaDocumentos
            carregandoDados={documentosEmpresaAdmin.isFetching}
            colunasDocumento={ColunasDocumentosEmpresaAdmin}
            dadosDocumentos={documentosEmpresaAdmin.data ?? []}
            categoriasDocumento={categoriasDocumento.data ?? []}
          />
        </TabsContent>

      </Tabs>
    </div>
  )
}