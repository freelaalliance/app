'use client'

import { uploadFile } from '@/app/modulo/documentos/[id]/novo/_actions/upload-actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle, Loader2, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAtualizarArquivoDocumento } from '../../_hooks/colaborador/useContratacaoColaborador'
import type { DocumentoContrato } from '../../_types/colaborador/ContratacaoType'

interface DialogUploadDocumentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento: DocumentoContrato | null
  contratacaoId: string
}

export function DialogUploadDocumento({ 
  open, 
  onOpenChange, 
  documento, 
  contratacaoId 
}: DialogUploadDocumentoProps) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSucesso, setUploadSucesso] = useState(false)
  const { mutateAsync: atualizarArquivoDocumento } = useAtualizarArquivoDocumento()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setArquivo(file)
      setUploadSucesso(false)
    }
  }

  const handleUpload = async () => {
    if (!arquivo || !documento?.id) return

    setUploading(true)
    try {
      // Gerar nome único para o arquivo
      const nomeArquivo = `contratacao-${contratacaoId}-doc-${documento.id}-${Date.now()}-${arquivo.name}`
      
      // Fazer upload para Cloudflare S3
      const formData = new FormData()
      formData.append('file', arquivo)
      formData.append('keyArquivo', nomeArquivo)

      const uploadResult = await uploadFile(formData)
      
      if (uploadResult?.success) {
        // Atualizar documento no banco com a chave do arquivo
        await atualizarArquivoDocumento({
          documentoId: documento.id,
          chaveArquivo: nomeArquivo,
        })
        
        setUploadSucesso(true)
        toast.success('Arquivo enviado e vinculado com sucesso!')
        
        setTimeout(() => {
          onOpenChange(false)
          resetDialog()
        }, 1500)
      } else {
        throw new Error(uploadResult?.error || 'Erro no upload do arquivo')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error(error instanceof Error ? error.message : 'Erro inesperado no upload')
    } finally {
      setUploading(false)
    }
  }

  const resetDialog = () => {
    setArquivo(null)
    setUploading(false)
    setUploadSucesso(false)
  }

  const handleClose = () => {
    if (!uploading) {
      onOpenChange(false)
      resetDialog()
    }
  }

  const removeFile = () => {
    setArquivo(null)
    setUploadSucesso(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {documento?.chaveArquivo ? 'Substituir Arquivo' : 'Anexar Arquivo'}
          </DialogTitle>
          <DialogDescription>
            {documento ? `Documento: ${documento.documento}` : 'Selecione um arquivo para anexar'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!arquivo ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">
                      Clique para selecionar um arquivo
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, DOCX, JPG, PNG até 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  ) : uploadSucesso ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{arquivo.name}</p>
                    <p className="text-xs text-gray-500">
                      {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!uploading && !uploadSucesso && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {uploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enviando arquivo...</p>
                </div>
              )}
              
              {uploadSucesso && (
                <p className="text-xs text-green-600 mt-2">
                  Arquivo enviado com sucesso!
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!arquivo || uploading || uploadSucesso}
          >
            {uploading ? 'Enviando...' : uploadSucesso ? 'Concluído' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
