import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { handleDownloadFile } from '@/lib/utils'
import { Download, File, Trash2 } from 'lucide-react'
import { ExclusaoAnexoFornecedor } from './dialogs/RemoverAnexoDialog'
import { ResponseAnexosFornecedorType } from '../(api)/FornecedorApi'

interface ListaAnexosFornecedorProps {
  listarAnexos: Pick<ResponseAnexosFornecedorType, 'dados'> | null | undefined
  isLoading: boolean,
  idFornecedor: string
}

export function ListaAnexosFornecedor({
  listarAnexos,
  isLoading,
  idFornecedor
}: ListaAnexosFornecedorProps) {
  return (
    <div className="p-4 space-x-4 min-w-max gap-2">
      {isLoading ? (
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="flex flex-col items-center space-y-2 w-32">
            <Skeleton className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg" />
            <Skeleton className="text-sm text-center truncate w-full" />
          </div>
          <div className="flex flex-col items-center space-y-2 w-32">
            <Skeleton className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg" />
            <Skeleton className="text-sm text-center truncate w-full" />
          </div>
          <div className="flex flex-col items-center space-y-2 w-32">
            <Skeleton className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg" />
            <Skeleton className="text-sm text-center truncate w-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-4 overflow-auto">
          {listarAnexos?.dados?.map(anexo => (
            <div
              key={anexo.id}
              className="flex flex-col items-center space-y-2 w-32"
            >
              <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg">
                <File className="h-12 w-12 text-white" />
              </div>
              <span
                className="text-sm text-center truncate w-full"
                title={anexo.nome}
              >
                {anexo.nome}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isLoading}
                  onClick={() => {
                    handleDownloadFile(anexo.arquivo, anexo.id)
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">
                        Excluir {anexo.arquivo}
                      </span>
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
      )}
    </div>
  )
}