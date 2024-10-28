'use client'

import { differenceInMinutes, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, MailWarning, Play } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { AlertEncerrarManutencaoEquipamento } from '../components/dialogs/(manutencao)/AlertDialogEncerrarManutencao'
import { AlertIniciarManutencaoEquipamento } from '../components/dialogs/(manutencao)/AlertDialogIniciarManutencao'
import { TabelaManutencoesEquipamento } from '../components/tables/manutencoes/tabela-manutencao-equipamento'
import { DadosManutencaoEquipamentoType } from '../schemas/ManutencaoSchema'

interface ManutencaoEquipamentoProps {
  idEquipamento: string
  listaManutencoes: Array<DadosManutencaoEquipamentoType>
  carregandoManutencoes: boolean
}

export default function ManutencoesEquipamentoView({
  idEquipamento,
  carregandoManutencoes,
  listaManutencoes,
}: ManutencaoEquipamentoProps) {
  const manutencaoAndamento = listaManutencoes.find(
    (manutencoes) =>
      manutencoes.criadoEm &&
      !manutencoes.finalizadoEm &&
      !manutencoes.canceladoEm,
  )
  const tempoEquipamentoParado = manutencaoAndamento
    ? differenceInMinutes(new Date(), new Date(manutencaoAndamento?.criadoEm))
    : 0

  return (
    <section className="flex flex-col space-y-2">
      {manutencaoAndamento && (
        <Alert variant={'destructive'} className="shadow bg-red-100">
          <MailWarning className="size-5" />
          <AlertTitle>{`Equipamento parado à ${tempoEquipamentoParado} minuto(s) ${tempoEquipamentoParado > 60 ? `(${formatDistance(new Date(manutencaoAndamento?.criadoEm), new Date(), { locale: ptBR })})` : ''}`}</AlertTitle>
          <AlertDescription>{manutencaoAndamento.observacoes}</AlertDescription>
          {!manutencaoAndamento.iniciadoEm ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-auto gap-2 bg-sky-500 hover:bg-sky-600 mt-4">
                  <Play className="size-5 ml-0" />
                  Iniciar manutenção
                </Button>
              </AlertDialogTrigger>
              <AlertIniciarManutencaoEquipamento
                equipamentoId={idEquipamento ?? ''}
                idManutencao={manutencaoAndamento.id}
              />
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-auto gap-2 bg-emerald-600 hover:bg-emerald-800 mt-4">
                  <Check className="size-5 ml-0" />
                  Encerrar manutenção
                </Button>
              </AlertDialogTrigger>
              <AlertEncerrarManutencaoEquipamento
                equipamentoId={idEquipamento ?? ''}
                idManutencao={manutencaoAndamento.id}
              />
            </AlertDialog>
          )}
        </Alert>
      )}

      <TabelaManutencoesEquipamento
        carregandoManutencoes={carregandoManutencoes}
        data={listaManutencoes}
        idEquipamento={idEquipamento}
      />
    </section>
  )
}
