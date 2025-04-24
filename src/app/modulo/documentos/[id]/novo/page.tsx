'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { buscarCategoriasDocumento, buscarDocumentosEmpresa, buscarUsuariosEmpresaPermissaoDocumentos } from "../../_api/documentos";
import { NovoDocumentoForm } from "./_components/forms/novo-documento-form";
import { ColunasDocumentosEmpresa } from "./_components/tables/documentos/colunas-tabela-documentos-empresa";
import { TabelaDocumentos } from "./_components/tables/documentos/tabela-documentos";

export default function NovoDocumentoPage() {

  const usuariosPermissaoModuloDocumentos = useQuery({
    queryKey: ['usuariosPermissaoModuloDocumentos'],
    queryFn: buscarUsuariosEmpresaPermissaoDocumentos,
    initialData: [],
  })

  const categoriasDocumentos = useQuery({
    queryKey: ['categoriasDocumentos'],
    queryFn: buscarCategoriasDocumento,
    initialData: [],
  })

  const documentosEmpresa = useQuery({
    queryKey: ['documentosEmpresa'],
    queryFn: buscarDocumentosEmpresa,
    initialData: [],
  })

  return (
    <Card>
      <CardHeader className="flex flex-col justify-normal md:justify-between md:flex-row">
        <div className="grid space-y-2">
          <CardTitle>Criar novo documento</CardTitle>
          <CardDescription>
            Crie um novo documento para o seu cliente ou fornecedor
          </CardDescription>
        </div>

        <Dialog>
          <DialogTrigger asChild >
            <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto">
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
              listaCategoriasDocumentos={!categoriasDocumentos.isLoading ? (categoriasDocumentos.data ?? []) : []}
              listaUsuarios={usuariosPermissaoModuloDocumentos.data ?? []}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="grid space-y-4">
        <TabelaDocumentos
          carregandoDados={documentosEmpresa.isFetching}
          colunasDocumento={ColunasDocumentosEmpresa}
          dadosDocumentos={documentosEmpresa.data ?? []}
        />
      </CardContent>
    </Card>
  )
}