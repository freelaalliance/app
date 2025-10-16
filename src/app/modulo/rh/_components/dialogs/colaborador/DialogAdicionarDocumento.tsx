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
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload } from '@/components/upload/upload'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAdicionarDocumentoContrato } from '../../../_hooks/colaborador/useContratacaoColaborador'

const schemaAdicionarDocumento = z.object({
  documento: z.string().min(1, 'Nome do documento é obrigatório'),
})

type AdicionarDocumentoData = z.infer<typeof schemaAdicionarDocumento>

interface DialogAdicionarDocumentoProps {
  contratacaoId: string
  children?: React.ReactNode
}

export function DialogAdicionarDocumento({
  contratacaoId,
  children,
}: DialogAdicionarDocumentoProps) {
  const [open, setOpen] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { mutateAsync: adicionarDocumento } = useAdicionarDocumentoContrato()

  const form = useForm<AdicionarDocumentoData>({
    resolver: zodResolver(schemaAdicionarDocumento),
    defaultValues: {
      documento: '',
    },
  })

  const handleSelecionarArquivo = (arquivos: File[]) => {
    if (arquivos.length > 0) {
      setArquivo(arquivos[0])
    }
  }

  const handleRemoverArquivo = () => {
    setArquivo(null)
  }

  const onSubmit = async (data: AdicionarDocumentoData) => {
    try {
      setIsUploading(true)
      let chaveArquivo: string | undefined

      // Se há arquivo selecionado, faz upload primeiro
      if (arquivo) {
        const formData = new FormData()
        const nomeArquivo = `documento-${Date.now()}-${arquivo.name}`
        formData.append('file', arquivo)
        formData.append('keyArquivo', nomeArquivo)

        const uploadResult = await uploadFile(formData)
        if (uploadResult) {
          chaveArquivo = nomeArquivo
        } else {
          throw new Error('Falha no upload do arquivo')
        }
      }

      // Adiciona o documento com ou sem arquivo
      await adicionarDocumento({
        contratacaoId,
        documento: data.documento,
        ...(chaveArquivo && { chaveArquivo }),
      })

      toast.success('Documento adicionado com sucesso!')
      form.reset()
      setArquivo(null)
      setOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar documento:', error)
      toast.error('Erro ao adicionar documento')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Documento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Documento</DialogTitle>
          <DialogDescription>
            Adicione um novo documento ao contrato do colaborador e faça upload do arquivo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Documento *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Contrato de Trabalho, RG, CPF..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload de Arquivo */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Arquivo (Opcional)</span>
              {!arquivo ? (
                <Upload selecionaArquivo={handleSelecionarArquivo} />
              ) : (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                        📄
                      </div>
                      <div>
                        <p className="text-sm font-medium">{arquivo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoverArquivo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                  setArquivo(null)
                }}
                disabled={form.formState.isSubmitting || isUploading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="shadow-md text-sm uppercase leading-none rounded "
                disabled={form.formState.isSubmitting || isUploading}
              >
                {(form.formState.isSubmitting || isUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading ? 'Fazendo upload...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
