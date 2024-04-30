import { ScrollArea } from '@radix-ui/react-scroll-area'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { useCalibracao } from '@/lib/CaseAtom'
import { cn, formatarDataBrasil } from '@/lib/utils'

interface ListaCalibracaoInstrumentoProps {
  items: Array<{
    id: string
    numeroCertificado: string
    erroEncontrado: number
    incertezaTendenciaEncontrado: number
    toleranciaEstabelicida: number
    certificado: string
    observacao: string | null
    status: string
    realizadoEm: Date
    usuarioUltimaAlteracao: string
  }>
}

export function ListaCalibracoesInstrumentos({
  items,
}: ListaCalibracaoInstrumentoProps) {
  const [calibracaoSelecionada, selecionarCalibracao] = useCalibracao()

  return (
    <ScrollArea className="max-h-screen mr-4">
      <div className="flex flex-col gap-2 pt-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Image
              src={'/empty-item.svg'}
              width={200}
              height={200}
              alt="Nenhuma calibração realizada neste instrumento!"
            />
            <span className="font-semibold">Nenhuma calibração encontrada</span>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                calibracaoSelecionada.selected === item.id && 'bg-muted',
              )}
              onClick={() =>
                selecionarCalibracao({
                  ...calibracaoSelecionada,
                  selected: item.id,
                })
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {item.numeroCertificado}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xs',
                      calibracaoSelecionada.selected === item.id
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {`${formatarDataBrasil(new Date(item.realizadoEm))}`}
                  </div>
                </div>
                <div className="text-xs font-medium">{`${item.usuarioUltimaAlteracao}`}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.observacao ? item.observacao.substring(0, 300) : ''}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    item.status === 'aprovado'
                      ? 'bg-emerald-300 text-emerald-900 hover:bg-emerald-400'
                      : 'bg-red-300 text-red-900 hover:bg-red-400',
                  )}
                  key={`${item.status}-${item.id}`}
                >
                  {item.status.toUpperCase()}
                </Badge>
              </div>
            </button>
          ))
        )}
      </div>
    </ScrollArea>
  )
}
