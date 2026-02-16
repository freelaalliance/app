'use client'

import { buscarItensInspecoes } from '@/app/modulo/manutencao/api/InspecaoEquipamentoAPI'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatarDataBrasil } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { differenceInHours, differenceInMinutes } from 'date-fns'
import type { DadosInspecoesEquipamentoType } from '../../../schemas/EquipamentoSchema'

interface DadosInspecaoProps {
  dados: DadosInspecoesEquipamentoType
}

export function VisualizarInspecaoDialog({ dados }: DadosInspecaoProps) {
  const dataHoraInicio = new Date(dados.iniciadoEm)
  const dataHoraFim = dados.finalizadoEm
    ? new Date(dados.finalizadoEm)
    : new Date()

  const duracaoInspecaoHoras = differenceInHours(dataHoraFim, dataHoraInicio)
  const duracaoInspecaoMinutos = differenceInMinutes(
    dataHoraFim,
    dataHoraInicio
  )

  const { data: listaPontosInspecao, isLoading: carregandoPontos } = useQuery({
    queryKey: ['listaInspecaoPontosEquipamento', dados.id],
    queryFn: () => buscarItensInspecoes(dados.id),
  })

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Detalhes da inspeção</DialogTitle>
        <DialogDescription>{`Iniciado por ${dados.usuario.pessoa.nome} às ${formatarDataBrasil(dataHoraInicio)}`}</DialogDescription>
      </DialogHeader>
      {carregandoPontos ? (
        <>
          <div className="flex flex-row justify-between space-x-2 select-none">
            <Skeleton className="h-10 rounded shadow w-full" />
            <Skeleton className="h-10 rounded shadow w-full" />
            <Skeleton className="h-10 rounded shadow w-full" />
          </div>
          <Separator />
          <div className="flex flex-col justify-between gap-2 select-none">
            <Skeleton className="h-20 rounded shadow w-full" />
            <Skeleton className="h-20 rounded shadow w-full" />
            <Skeleton className="h-20 rounded shadow w-full" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between space-x-2 select-none">
            <div className="grid p-4 border rounded w-full">
              <span className="text-start text-md">Finalizado em </span>
              <span className="text-xl">{formatarDataBrasil(dataHoraFim)}</span>
            </div>
            <div className="grid p-4 border rounded w-full">
              <span className="text-start text-md">Situação: </span>
              <span
                className={cn(
                  'capitalize text-xl',
                  dados.statusInspecao === 'reprovado'
                    ? 'text-red-700'
                    : 'text-green-700'
                )}
              >
                {dados.statusInspecao}
              </span>
            </div>
            <div className="grid p-4 border rounded w-full">
              <span className="text-start text-md">Duração: </span>
              <span className="text-xl">
                {duracaoInspecaoHoras > 0
                  ? `${duracaoInspecaoHoras} hs`
                  : `${duracaoInspecaoMinutos} min`}
              </span>
            </div>
          </div>
          <ScrollArea className="max-h-72 w-full">
            {listaPontosInspecao?.map(ponto => (
              <div
                key={ponto.pecasEquipamento.id}
                className="flex-1 flex-row justify-between my-2 p-2 rounded-md border w-full select-none"
              >
                <div className="flex justify-between flex-row-reverse mb-4 mr-2 items-center">
                  <span className="text-muted-foreground text-xs">{`Inspecionado em: ${formatarDataBrasil(ponto.inspecionadoEm ? new Date(ponto.inspecionadoEm) : new Date())}`}</span>
                  <span className="text-start text-xl">{`Ponto: ${ponto.pecasEquipamento.nome}`}</span>
                </div>
                <div className="flex gap-2 items-baseline">
                  <span className='text-muted-foreground'>Situação:</span>
                  <span
                  className={cn(
                    'text-start text-xl',
                    ponto.aprovado ? 'text-green-700' : 'text-red-700'
                  )}
                >{`${ponto.aprovado ? 'Conforme' : 'Não Conforme'}`}</span>
                </div>
                <p className="text-justify text-muted-foreground">
                  {`Peça: ${ponto.pecasEquipamento.descricao || 'Sem descrição'}`}
                </p>
                <p className="text-justify text-muted-foreground">
                  {`Observações inspeção: ${ponto.observacao || 'Sem observações'}`}
                </p>
              </div>
            ))}
          </ScrollArea>
        </>
      )}
    </DialogContent>
  )
}
