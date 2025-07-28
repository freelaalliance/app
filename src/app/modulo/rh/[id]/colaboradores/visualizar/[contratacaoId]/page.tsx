'use client'

import { VisualizarColaborador } from '@/app/modulo/rh/_components/colaborador/VisualizarColaborador'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ColaboradorPage() {
  const params = useParams()
  const {contratacaoId} = params as { contratacaoId: string }

  return (
    <div className="space-y-2">
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-start items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => {
                history.back()
              }}
            >
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para a tela de colaboradores</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <VisualizarColaborador contratacaoId={contratacaoId} />
    </div>
  )
}
