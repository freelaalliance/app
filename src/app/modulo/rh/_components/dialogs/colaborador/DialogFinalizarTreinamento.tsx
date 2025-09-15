'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, FileText, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { uploadFile } from '../../../../documentos/[id]/novo/_actions/upload-actions'
import { useFinalizarTreinamento } from '../../../_hooks/colaborador/useTreinamentosColaborador'
import type { TreinamentoRealizado } from '../../../_types/colaborador/ContratacaoType'

const finalizarTreinamentoSchema = z.object({
  finalizadoEm: z.coerce.date({
    required_error: 'Data de finalização é obrigatória',
  }),
  certificado: z.string(),
  iniciadoEmConfirmado: z.coerce.date({
    required_error: 'Confirme a data de início do treinamento',
  }),
})

type FinalizarTreinamentoFormData = z.infer<typeof finalizarTreinamentoSchema>

interface DialogFinalizarTreinamentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  treinamento: TreinamentoRealizado | null
}

export function DialogFinalizarTreinamento({
  open,
  onOpenChange,
  treinamento,
}: DialogFinalizarTreinamentoProps) {
  const finalizarTreinamento = useFinalizarTreinamento()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [certificadoUrl, setCertificadoUrl] = useState<string>('')
  const [uploadLoading, setUploadLoading] = useState(false)

  const form = useForm<FinalizarTreinamentoFormData>({
    resolver: zodResolver(finalizarTreinamentoSchema),
    defaultValues: {
      finalizadoEm: new Date(),
      certificado: '',
      iniciadoEmConfirmado: treinamento?.iniciadoEm ? new Date(treinamento.iniciadoEm) : new Date(),
    },
  })

  const handleFileUpload = async (file: File) => {
    setUploadLoading(true)
    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const fileName = `certificados/treinamento_${treinamento?.id}_${timestamp}.${extension}`
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('keyArquivo', fileName)

      const result = await uploadFile(formData)
      
      if (result.success) {
        setCertificadoUrl(fileName)
        form.setValue('certificado', fileName)
        setUploadedFile(file)
        toast.success('Certificado enviado com sucesso!')
      } else {
        toast.error('Erro ao enviar certificado. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao enviar certificado. Tente novamente.')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo (PDF, imagens)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de arquivo não permitido. Use PDF, JPG ou PNG.')
        return
      }
      
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 10MB.')
        return
      }
      
      handleFileUpload(file)
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    setCertificadoUrl('')
    form.setValue('certificado', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (data: FinalizarTreinamentoFormData) => {
    if (!treinamento?.id) return

    finalizarTreinamento.mutate(
      {
        id: treinamento.id,
        data: {
          finalizadoEm: data.finalizadoEm,
          certificado: certificadoUrl || undefined,
          iniciadoEmConfirmado: data.iniciadoEmConfirmado
        },
      },
      {
        onSuccess: () => {
          toast.success('Treinamento finalizado com sucesso!')
          onOpenChange(false)
          handleReset()
        },
        onError: (error: unknown) => {
          console.error('Erro ao finalizar treinamento:', error)
          toast.error('Erro ao finalizar treinamento. Tente novamente.')
        },
      }
    )
  }

  const handleReset = () => {
    form.reset()
    setUploadedFile(null)
    setCertificadoUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    handleReset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Treinamento</DialogTitle>
          <DialogDescription>
            Complete as informações para finalizar o treinamento de{' '}
            <strong>{treinamento?.treinamento?.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="iniciadoEmConfirmado"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Confirme a Data de Início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="finalizadoEm"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Finalização</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificado"
              render={() => (
                <FormItem>
                  <FormLabel>Certificado (opcional)</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Input file oculto */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {/* Área de upload */}
                      {!uploadedFile ? (
                        <button
                          type="button"
                          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">
                            Clique para enviar certificado
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, JPG ou PNG até 10MB
                          </p>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {uploadedFile.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeUploadedFile}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {uploadLoading && (
                        <div className="flex items-center justify-center p-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                          <span className="ml-2 text-sm text-gray-600">
                            Enviando certificado...
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={finalizarTreinamento.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {finalizarTreinamento.isPending ? 'Finalizando...' : 'Finalizar Treinamento'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
