import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { handleDownloadFile } from '@/lib/utils'
import { Download, FileText, Trash2 } from 'lucide-react'
import { ExclusaoAnexoFornecedor } from './dialogs/RemoverAnexoDialog'
import { ResponseAnexosFornecedorType } from '../(api)/FornecedorApi'

interface ListaAnexosFornecedorProps {
  listarAnexos: Pick<ResponseAnexosFornecedorType, 'dados'> | null | undefined
  isLoading: boolean,
  idFornecedor: string
}

function isBase64(valor: string): boolean {
  return valor.startsWith('data:')
}

export function ListaAnexosFornecedor({
  listarAnexos,
  isLoading,
  idFornecedor
}: ListaAnexosFornecedorProps) {
  function realizarDownload(arquivo: string, id: string, nome: string) {
    if (isBase64(arquivo)) {
      handleDownloadFile(arquivo, id)
    } else {
      handleDownloadFile(arquivo, nome)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="flex items-center gap-4 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-8 w-8 rounded shrink-0" />
            <Skeleton className="h-8 w-8 rounded shrink-0" />
          </div>
        ))}
      </div>
    )
  }

  if (!listarAnexos?.dados || listarAnexos.dados.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Nenhum anexo encontrado
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {listarAnexos.dados.map(anexo => (
        <div
          key={anexo.id}
          className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded bg-gray-100 shrink-0">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={anexo.nome}>
              {anexo.nome}
            </p>
            {anexo.observacao && (
              <p className="text-xs text-muted-foreground line-clamp-2" title={anexo.observacao}>
                {anexo.observacao}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => realizarDownload(anexo.arquivo, anexo.id, anexo.nome)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir {anexo.nome}</span>
                </Button>
              </AlertDialogTrigger>
              <ExclusaoAnexoFornecedor
                idFornecedor={idFornecedor}
                id={anexo.id}
              />
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )
}