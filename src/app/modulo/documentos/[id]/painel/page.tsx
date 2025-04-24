'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { buscarCategoriasDocumento, buscarDocumentosUsuario } from '../../_api/documentos'
import { ColunasDocumentosUsuario } from '../novo/_components/tables/documentos/colunas-tabela-documentos-usuario'
import { TabelaDocumentos } from '../novo/_components/tables/documentos/tabela-documentos'

export default function PainelDocumentosPage() {
  const documentosUsuario = useQuery({
    queryKey: ['documentosUsuario'],
    queryFn: buscarDocumentosUsuario,
    initialData: [],
  })

  const categoriasDocumentos = useQuery({
    queryKey: ['categoriasDocumentos'],
    queryFn: buscarCategoriasDocumento,
    initialData: [],
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus documentos</CardTitle>
        <CardDescription>
          Visualize os documentos que você possui acesso e faça o download deles
        </CardDescription>
      </CardHeader>
      <CardContent className="grid space-y-4">
        <TabelaDocumentos
          carregandoDados={documentosUsuario.isFetching}
          colunasDocumento={ColunasDocumentosUsuario}
          dadosDocumentos={documentosUsuario.data ?? []}
          categoriasDocumento={categoriasDocumentos.data ?? []}
        />
      </CardContent>
    </Card>
  )
}