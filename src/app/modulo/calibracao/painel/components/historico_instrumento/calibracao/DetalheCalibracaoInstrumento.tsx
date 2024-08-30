import { DownloadCloud } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn, formatarDataBrasil, handleDownloadFile } from '@/lib/utils'

import { HistoricoCalibracoesInstrumentoType } from '../api/HistoricoInstrumento'

interface DetalheCalibracaoInstrumentoProps {
  dados: HistoricoCalibracoesInstrumentoType | null
}

export function DetalheCalibracaoInstrumento({
  dados = null,
}: DetalheCalibracaoInstrumentoProps) {
  return (
    <>
      <dl className="my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Realizado:</dt>
          <div className="flex justify-between">
            <dd className="text-gray-700 sm:col-span-2">
              {dados?.usuarioUltimaAlteracao ?? 'Não informado'}
            </dd>
            <dd className="text-gray-700 sm:col-span-2">
              {formatarDataBrasil(
                dados?.realizadoEm ? new Date(dados?.realizadoEm) : new Date(),
              )}
            </dd>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">N° Certificado</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {dados?.numeroCertificado ?? 'Não informado'}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Status</dt>
          <Badge
            variant={'default'}
            className={cn(
              'w-max',
              dados?.status === 'aprovado'
                ? 'bg-emerald-200 text-emerald-600 hover:bg-emerald-300'
                : 'bg-red-200 text-red-600 hover:bg-red-300',
            )}
          >
            {dados?.status.toUpperCase() ?? 'Não informado!'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Erro encontrado</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {dados?.erroEncontrado ?? 0}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Incerteza/Tendencia</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {dados?.incertezaTendenciaEncontrado ?? 0}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Tolerância</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {dados?.toleranciaEstabelicida ?? 0}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Observação</dt>
          <dd className="text-gray-700 sm:col-span-2 h-12">
            {dados?.observacao ?? 'Não informado'}
          </dd>
        </div>
      </dl>
      <Separator />
      <Button
        className="mt-2 gap-2 shadow-md text-sm uppercase leading-none text-white bg-sky-600  hover:bg-sky-700"
        disabled={!dados?.certificado}
        onClick={async () => {
          if (dados?.certificado) {
            await handleDownloadFile(dados?.certificado, dados?.id)
          } else {
            toast.warning('Certificado não encontrado!')
          }
        }}
      >
        <DownloadCloud className="h-4 w-4" />
        Baixar o certificado
      </Button>
    </>
  )
}
