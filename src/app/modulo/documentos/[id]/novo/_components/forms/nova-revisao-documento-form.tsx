import { cadastrarNovaRevisaoDocumento } from "@/app/modulo/documentos/_api/documentos"
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Form
} from '@/components/ui/form'
import { Progress } from "@/components/ui/progress"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { uploadFile } from "../../_actions/upload-actions"
import UploadForm from "../upload/upload-documentos"

const schemaNovaRevisaoDocumentoForm = z.object({
  id: z.string().uuid(),
  arquivo: z.string(),
})

export type NovaRevisaoDocumentoFormType = z.infer<typeof schemaNovaRevisaoDocumentoForm>

export interface NovaRevisaoDocumentoFormProps {
  idDocumento: string
}

export function NovaRevisaoDocumentoForm({ idDocumento }: NovaRevisaoDocumentoFormProps) {
  const [arquivoSelecionado, adicionaArquivo] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const queryClient = useQueryClient()

  const formNovaRevisaoDocumento = useForm<NovaRevisaoDocumentoFormType>({
    resolver: zodResolver(schemaNovaRevisaoDocumentoForm),
    defaultValues: {
      id: idDocumento,
      arquivo: crypto.randomUUID(),
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

  const handleUploadFile = async () => {
    if (!arquivoSelecionado) {
      toast.warning('Por favor, selecione um arquivo para fazer o upload.')
      return
    }

    try {
      setUploading(true)

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 100)


      const formData = new FormData()
      formData.append('file', arquivoSelecionado)
      formData.append('keyArquivo', formNovaRevisaoDocumento.getValues('arquivo'))

      const result = await uploadFile(formData)

      if (!result.success) {
        toast.error('Erro ao fazer upload do arquivo. Tente novamente.')
        console.log(result.error)
        return
      }

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadComplete(true)

      if (uploadComplete && result.success && result.key) {
        setUploading(false)
        toast.success('Upload realizado com sucesso!')
      }
    } catch (err) {
      toast.error('Erro ao fazer upload do arquivo. Tente novamente.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (data: NovaRevisaoDocumentoFormType) => {
    if (!uploadComplete) {
      toast.error('Por favor, faça o upload do arquivo antes de salvar.')
      return
    }

    await salvarRevisaoDocumento(data)
  }

  return (
    <Form {...formNovaRevisaoDocumento}>
      <form className="space-y-4" onSubmit={formNovaRevisaoDocumento.handleSubmit(handleSubmit)}>
        <div className="grid space-y-2">
          <UploadForm
            onSelectFile={adicionaArquivo}
            fileSelected={arquivoSelecionado}
            uploadingFile={uploading || uploadComplete}
          />
          {arquivoSelecionado && (
            <div className="mt-4">
              {uploading ||
                (uploadComplete && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {uploadComplete ? 'Upload completo!' : 'Enviando...'}
                      </span>
                      {uploadComplete && (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckIcon className="h-4 w-4 mr-1" /> Concluído
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                formNovaRevisaoDocumento.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {
            uploadComplete && !uploading ? (
              <Button
                type="submit"
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
                disabled={formNovaRevisaoDocumento.formState.isSubmitting}
              >
                {formNovaRevisaoDocumento.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            ) : (
              <Button
                type="button"
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
                disabled={uploading || !!uploadComplete}
                onClick={handleUploadFile}
              >
                {formNovaRevisaoDocumento.formState.isSubmitting ? 'Salvando arquivo...' : 'Salvar arquivo'}
              </Button>
            )
          }
        </DialogFooter>
      </form>
    </Form >
  )

}