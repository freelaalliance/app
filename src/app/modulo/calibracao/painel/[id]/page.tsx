'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Loader2,
} from 'lucide-react'

import dynamic from "next/dynamic";
import { recuperaAgendaCalibracoesEmpresa } from '../../api/AgendaCalibracoes'
import { buscarEstatisticasCalibracoesEmpresa } from '../../api/EstatisticasCalibracao'
import { recuperarCalibracoesInstrumentosEmpresa } from '../../api/Calibracao'

const CalibracoesView = dynamic(() => import('../../views/CalibracoesView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

const MetricasCalibracoesView = dynamic(() => import('../../views/MetricasCalibracoes'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export default function Painel() {
  const indicadoresCalibracoes = useQuery({
    queryKey: ['estatisticasCalibracaoes'],
    queryFn: buscarEstatisticasCalibracoesEmpresa,
  })

  const agendaCalibracoes = useQuery({
    queryKey: ['agendaCalibracoes'],
    queryFn: recuperaAgendaCalibracoesEmpresa,
  })

  const historicoCalibracoes = useQuery({
    queryKey: ['historicoCalibracoes'],
    queryFn: recuperarCalibracoesInstrumentosEmpresa,
  })

  return (
    <section className='grid '>
      <MetricasCalibracoesView
        indicadores={{
          dados: indicadoresCalibracoes.data ?? {
            calibracoesDentroPrazo: 0,
            calibracoesVencendo: 0,
            calibracoesVencido: 0,
            quantidadeInstrumentosEmpresa: 0,
            quantidadeInstrumentosCadastradoAtual: 0,
            quantidadeCalibracoesAprovadas: 0,
            quantidadeCalibracoesReprovadas: 0,
          },
          carregandoIndicadores: indicadoresCalibracoes.isLoading
        }}
        agenda={{
          carregandoAgenda: agendaCalibracoes.isLoading,
          eventos: agendaCalibracoes.data ?? []
        }}
        historicoCalibracoes={{
          dados: historicoCalibracoes.data ?? [],
          carregandoCalibracoes: historicoCalibracoes.isLoading
        }}
      />

      <CalibracoesView />
    </section>
  )
}
