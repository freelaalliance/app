import Dropzone from 'react-dropzone'
import { toast } from 'sonner'

import { Label } from '../ui/label'

interface uploadProps {
  selecionaArquivo: (arquivo: Array<File>) => void
}

export function Upload({ selecionaArquivo }: uploadProps) {
  const arquivoSuportado = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.gif', '.jpeg', '.webp'],
  }

  const mensagemArquivo = (isDragActive: boolean, isDragReject: boolean) => {
    if (isDragReject) {
      return (
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-center text-sm text-red-700 dark:text-red-600">
            <span className="font-semibold">Arquivo não suportado!</span>
            <p className="text-xs text-red-700 dark:text-red-600">
              Selecione ou arrasta arquivo do tipo PDF, JPG, JPEG, GIF ou PNG
            </p>
          </p>
        </div>
      )
    }

    if (!isDragActive) {
      return (
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Clique aqui para escolher</span> ou
            arrasta o certificado até aqui e solte
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {'PDF, JPG, JPEG, GIF ou PNG'}
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">
            Clique para escolher o certificado
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {'PDF, JPG, JPEG, GIF ou PNG'}
        </p>
      </div>
    )
  }

  return (
    <>
      <Dropzone
        multiple={false}
        maxFiles={1}
        accept={arquivoSuportado}
        onDropAccepted={selecionaArquivo}
        onDropRejected={() => {
          toast.warning('Arquivo não suportado', {
            description: (
              <span>
                Selecione um arquivo do tipo PDF, JPG, JPEG, GIF ou PNG
              </span>
            ),
          })
        }}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <>
            <Label>Certificado</Label>
            <div
              className="p-10 flex items-center h-28 md:h-64 justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {mensagemArquivo(isDragActive, isDragReject)}
            </div>
          </>
        )}
      </Dropzone>
    </>
  )
}
