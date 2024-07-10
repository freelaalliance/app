'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { buscarDuracaoManutencoesEquipamento, buscarManutencoesEquipamento } from "../api/ManutencaoEquipamentoAPI"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { differenceInMinutes, formatDistance } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, MailWarning, Play } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { TabelaManutencoesEquipamento } from "../components/tables/manutencoes/tabela-manutencao-equipamento"
import { toast } from "sonner"
import { AlertIniciarManutencaoEquipamento } from "../components/dialogs/(manutencao)/AlertDialogIniciarManutencao"
import { AlertEncerrarManutencaoEquipamento } from "../components/dialogs/(manutencao)/AlertDialogEncerrarManutencao"
import RankingDurancaoManutencaoEquipamento from "../components/charts/IndicadorTempoManutencaoEquipamento"
import IndicadoresMediaDuracaoManutencoesEquipamento from "../components/charts/IndicadorMediaDuracaoEquipamento"
import IndicadoresMediaEquipamentoParado from "../components/charts/IndicadorMediaEquipamentoParado"

interface ManutencaoEquipamentoProps {
  idEquipamento?: string
}

export default function ManutencoesEquipamentoView({ idEquipamento }: ManutencaoEquipamentoProps) {

  const queryClient = useQueryClient()

  const { data: estatisticasDuracaoManutencoesEquipamento, isLoading: carregandoEstatisticaDuracao } = useQuery({
    queryKey: ['estatisticaDuracaoManutencoesEquipamento', idEquipamento],
    queryFn: () => buscarDuracaoManutencoesEquipamento({ equipamentoId: idEquipamento ?? '' }),
    staleTime: Infinity
  })

  const { data: manutencoesEquipamento, isLoading: carregandoManutencoes } = useQuery({
    queryKey: ['manutencoesEquipamento', idEquipamento],
    queryFn: () => buscarManutencoesEquipamento({ equipamentoId: idEquipamento ?? '' }),
    staleTime: Infinity
  })

  const manutencaoAndamento = manutencoesEquipamento?.find((manutencoes) => manutencoes.criadoEm && (!manutencoes.finalizadoEm && !manutencoes.canceladoEm))
  const tempoEquipamentoParado = manutencaoAndamento ? differenceInMinutes(new Date(), new Date(manutencaoAndamento?.criadoEm)) : 0

  return (
    <section className="grid space-y-2">
      {manutencaoAndamento && (
        <Alert variant={'destructive'} className="shadow bg-red-100">
          <MailWarning className="size-5" />
          <AlertTitle>{`Equipamento parado à ${tempoEquipamentoParado} minuto(s) ${tempoEquipamentoParado > 60 ? `(${formatDistance(new Date(manutencaoAndamento?.criadoEm), new Date(), { locale: ptBR })})` : ''}`}</AlertTitle>
          <AlertDescription>
            {manutencaoAndamento.observacoes}
          </AlertDescription>
          {
            !manutencaoAndamento.iniciadoEm ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-auto gap-2 bg-sky-500 hover:bg-sky-600 mt-4">
                    <Play className="size-5 ml-0" />
                    Iniciar manutenção
                  </Button>
                </AlertDialogTrigger>
                <AlertIniciarManutencaoEquipamento equipamentoId={idEquipamento ?? ''} idManutencao={manutencaoAndamento.id} />
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-auto gap-2 bg-emerald-600 hover:bg-emerald-800 mt-4">
                    <Check className="size-5 ml-0" />
                    Encerrar manutenção
                  </Button>
                </AlertDialogTrigger>
                <AlertEncerrarManutencaoEquipamento equipamentoId={idEquipamento ?? ''} idManutencao={manutencaoAndamento.id} />
              </AlertDialog>
            )
          }
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Ranking manutenções</CardTitle>
            <CardDescription>
              {
                'Ranking de durações de manutenções no equipamento'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <RankingDurancaoManutencaoEquipamento dados={estatisticasDuracaoManutencoesEquipamento ?? []} />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Equipamento parado</CardTitle>
            <CardDescription>
              Duração média total do equipamento parado
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {
              carregandoManutencoes ? (
                <div className="flex flex-col md:flex-row justify-center gap-2">
                  <Skeleton className="h-52 w-52 rounded-full my-6" />
                </div>
              ) : (
                <IndicadoresMediaEquipamentoParado listaManutencoes={manutencoesEquipamento ?? []} />
              )
            }
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Duração da manutenções</CardTitle>
            <CardDescription>
              Média de duração das manutenções realizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {
              carregandoManutencoes ? (
                <div className="flex flex-col md:flex-row justify-center gap-2">
                  <Skeleton className="h-52 w-52 rounded-full my-6" />
                </div>
              ) : (
                <IndicadoresMediaDuracaoManutencoesEquipamento listaManutencoes={manutencoesEquipamento ?? []} />
              )
            }
          </CardContent>
        </Card>
      </div>
      <TabelaManutencoesEquipamento carregandoManutencoes={carregandoManutencoes} data={manutencoesEquipamento ?? []} idEquipamento={idEquipamento ?? ''} />
    </section>
  )
}