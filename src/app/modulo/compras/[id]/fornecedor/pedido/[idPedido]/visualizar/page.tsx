'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowBigDownDash, ArrowLeft, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import generatePDF, { Margin, type Options, Resolution } from 'react-to-pdf'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { consultarPedido } from '../../../(api)/ComprasApi'

const PedidoView = dynamic(
  () => import('../../../(views)/VisualizarDadosPedido'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  }
)

export default function VisualizarPedido() {
  const router = useRouter()
  const { idPedido } = useParams<{ idPedido: string }>()
  const searchParams = useSearchParams()

  const codigo = searchParams.get('codigo')

  const getDadosPedido = () => document.getElementById('pedido')

  const options: Options = {
    method: 'open',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    },
  }

  const dadosPedido = useQuery({
    queryKey: ['visualizarPedido', idPedido, codigo],
    queryFn: () =>
      consultarPedido({
        codigoPedido: codigo ?? '',
        idPedido,
      }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <section className="space-y-2">
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-between items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => router.back()}
            >
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para a pagina anterior</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'sm'}
              disabled={!dadosPedido.data || !dadosPedido.data.dados}
              className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
              onClick={() => generatePDF(getDadosPedido, options)}
            >
              <ArrowBigDownDash className="size-5" />
              {'Baixar PDF'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Baixar PDF pedido</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {dadosPedido.isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div id="pedido" className="grid bg-white p-4 rounded space-y-4">
          {dadosPedido.data?.dados ? (
            <PedidoView dadosPedido={dadosPedido.data.dados} />
          ) : (
            <div className="flex justify-center items-center h-full py-4">
              <p className="text-center text-gray-600">
                Nenhum pedido encontrado com os dados fornecidos.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
