'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteFile } from '../../../../documentos/[id]/novo/_actions/upload-actions'
import { useRemoverDocumentoContrato } from '../../../_hooks/colaborador/useContratacaoColaborador'
import type { DocumentoContrato } from '../../../_types/colaborador/ContratacaoType'

interface AlertDialogRemoverDocumentoProps {
  documento: DocumentoContrato
  children?: React.ReactNode
}

export function AlertDialogRemoverDocumento({
  documento,
  children,
}: AlertDialogRemoverDocumentoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync: removerDocumento } = useRemoverDocumentoContrato()

  const handleRemover = async () => {
    if (!documento.id) {
      toast.error('ID do documento não encontrado')
      return
    }

    try {
      setIsLoading(true)
      
      // Se existe arquivo na Cloudflare, remove primeiro
      if (documento.chaveArquivo) {
        const arquivoRemovido = await deleteFile(documento.chaveArquivo)
        if (!arquivoRemovido) {
          console.warn('Falha ao remover arquivo da Cloudflare, mas continuando com remoção do documento')
        }
      }
      
      // Remove o documento do banco de dados
      await removerDocumento(documento.id)
      
      toast.success('Documento e arquivo removidos com sucesso!')
    } catch (error) {
      console.error('Erro ao remover documento:', error)
      toast.error('Erro ao remover documento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Remover
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o documento "{documento.documento}"?
            {documento.chaveArquivo && ' O arquivo anexado também será removido da Cloudflare.'}
            {' '}Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemover}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
