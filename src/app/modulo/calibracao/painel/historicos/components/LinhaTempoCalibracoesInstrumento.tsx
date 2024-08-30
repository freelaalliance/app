import { CheckCircle, CircleOff, DownloadCloud } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatarDataBrasil, handleDownloadFile } from '@/lib/utils'

import { CalibracoesInstrumentosEmpresaType } from '../../../listar/api/Calibracao'

interface ListaCalibracoesInstrumentoPropsInterface {
  calibracoes: CalibracoesInstrumentosEmpresaType
}

export function LinhaTempoCalibracoesInstrumento({
  calibracoes,
}: ListaCalibracoesInstrumentoPropsInterface) {
  return (
    <ol className="end-6 md:end-0 relative border-s border-gray-200 dark:border-gray-700">
      {calibracoes.map(({ calibracao }) => {
        return (
          <li key={calibracao.id} className="mb-10 ms-4">
            <span
              className={cn(
                'absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-white',
                calibracao.status === 'aprovado'
                  ? 'bg-emerald-300'
                  : 'bg-red-300',
              )}
            >
              {calibracao.status === 'aprovado' ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <CircleOff className="h-4 w-4 text-red-600" />
              )}
            </span>
            <h3 className="flex items-center mt-0 ml-3 mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Calibração{' '}
              <Badge
                variant={'default'}
                className={cn(
                  'w-max me-2 px-2.5 py-0.5 ms-3 text-sm font-medium',
                  calibracao?.status === 'aprovado'
                    ? 'bg-emerald-200 text-emerald-600 hover:bg-emerald-300'
                    : 'bg-red-200 text-red-600 hover:bg-red-300',
                )}
              >
                {calibracao?.status.toUpperCase() ?? 'Não informado!'}
              </Badge>
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 ">
              {`Calibrado em ${formatarDataBrasil(new Date(calibracao.realizadoEm))} por ${calibracao.usuarioNome}`}
            </time>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {calibracao.observacao}
            </p>

            <Button
              className="mt-2 gap-2 shadow-md text-sm uppercase leading-none text-white bg-sky-600 hover:bg-sky-700"
              disabled={!calibracao?.certificado}
              onClick={async () => {
                if (calibracao?.certificado) {
                  await handleDownloadFile(
                    calibracao?.certificado,
                    calibracao?.id,
                  )
                } else {
                  toast.warning('Certificado não encontrado!')
                }
              }}
            >
              <DownloadCloud className="h-4 w-4" />
              Baixar o certificado
            </Button>
          </li>
        )
      })}
    </ol>
  )
}
