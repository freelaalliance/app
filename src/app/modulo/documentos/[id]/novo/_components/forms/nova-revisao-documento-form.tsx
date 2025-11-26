import { cadastrarNovaRevisaoDocumento } from "@/app/modulo/documentos/_api/documentos"
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { deleteFile } from "../../_actions/upload-actions"
import UploadForm from "../upload/upload-documentos"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"

const schemaNovaRevisaoDocumentoForm = z.object({
  id: z.string().uuid(),
  arquivo: z.string().min(1, "Arquivo é obrigatório"),
  numeroRevisao: z.coerce.number().optional(),
  dataRevisao: z.coerce.date().optional(),
})

export type NovaRevisaoDocumentoFormType = z.infer<typeof schemaNovaRevisaoDocumentoForm>

export interface NovaRevisaoDocumentoFormProps {
  idDocumento: string
}

export function NovaRevisaoDocumentoForm({ idDocumento }: NovaRevisaoDocumentoFormProps) {
  const [arquivoSelecionado, selecionarArquivo] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const formNovaRevisaoDocumento = useForm<NovaRevisaoDocumentoFormType>({
    resolver: zodResolver(schemaNovaRevisaoDocumentoForm),
    defaultValues: {
      id: idDocumento,
      arquivo: '',
    },
    mode: 'onChange',
  })

  const { mutateAsync: salvarRevisaoDocumento } = useMutation({
    mutationFn: cadastrarNovaRevisaoDocumento,
    onError: error => {
      toast.error('Erro ao salvar a nova revisão do documento', {
        description: error.message,
      })
    },
    onSuccess: (data) => {
      if (data?.status) {
        toast.success('Revisão do documento cadastrado com sucesso!')
        formNovaRevisaoDocumento.reset()

        queryClient.refetchQueries({
          queryKey: ['documentosEmpresa'],
          exact: true,
        })
      } else {
        toast.warning(data?.msg)
      }
    },
  })

  const handleSubmit = async (data: NovaRevisaoDocumentoFormType) => {
    if (!arquivoSelecionado) {
      toast.error('Por favor, selecione um arquivo para fazer o upload.')
      return
    }

    await salvarRevisaoDocumento(data)
  }

  const cancelar = async () => {
    const arquivoKey = formNovaRevisaoDocumento.getValues('arquivo')
    if (arquivoKey) {
      await deleteFile(arquivoKey)
    }
    formNovaRevisaoDocumento.reset()
  }

  // Callback executado quando upload é concluído
  const handleUploadSuccess = (uuid: string, keyCompleta: string) => {
    // Salva a keyCompleta (caminho completo com extensão) no formulário
    formNovaRevisaoDocumento.setValue('arquivo', keyCompleta)
  }

  return (
    <Form {...formNovaRevisaoDocumento}>
      <form className="space-y-4" onSubmit={formNovaRevisaoDocumento.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={formNovaRevisaoDocumento.control}
            name={'dataRevisao'}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-[0.5px] mt-[9.2px]">
                  {'Data da revisão'}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione</span>
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
                      locale={ptBR}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formNovaRevisaoDocumento.control}
            name={'numeroRevisao'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da revisão</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid space-y-2">
          <UploadForm
            prefixo={`documentos/${idDocumento}/revisoes`}
            onUploadSuccess={handleUploadSuccess}
            arquivoSelecionado={selecionarArquivo}
          />
        </div>

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={cancelar}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded "
            disabled={formNovaRevisaoDocumento.formState.isSubmitting}
          >
            {formNovaRevisaoDocumento.formState.isSubmitting ? 'Salvando revisão...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form >
  )

}