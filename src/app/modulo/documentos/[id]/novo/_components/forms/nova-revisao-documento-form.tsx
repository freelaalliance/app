import { cadastrarNovaRevisaoDocumento } from "@/app/modulo/documentos/_api/documentos"
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
    Form
} from '@/components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { deleteFile } from "../../_actions/upload-actions"
import UploadForm from "../upload/upload-documentos"

const schemaNovaRevisaoDocumentoForm = z.object({
  id: z.string().uuid(),
  arquivo: z.string(),
})

export type NovaRevisaoDocumentoFormType = z.infer<typeof schemaNovaRevisaoDocumentoForm>

export interface NovaRevisaoDocumentoFormProps {
  idDocumento: string
}

const keyNovoArquivoDocumento = crypto.randomUUID()

export function NovaRevisaoDocumentoForm({ idDocumento }: NovaRevisaoDocumentoFormProps) {
  const [arquivoSelecionado, selecionarArquivo] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const formNovaRevisaoDocumento = useForm<NovaRevisaoDocumentoFormType>({
    resolver: zodResolver(schemaNovaRevisaoDocumentoForm),
    defaultValues: {
      id: idDocumento,
      arquivo: keyNovoArquivoDocumento,
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
    if(arquivoSelecionado) await deleteFile(keyNovoArquivoDocumento)
    formNovaRevisaoDocumento.reset()
  }

  return (
    <Form {...formNovaRevisaoDocumento}>
      <form className="space-y-4" onSubmit={formNovaRevisaoDocumento.handleSubmit(handleSubmit)}>
        <div className="grid space-y-2">
          <UploadForm keyArquivo={keyNovoArquivoDocumento} arquivoSelecionado={selecionarArquivo} />
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