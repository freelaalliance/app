'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import { listarEquipamentos } from '../api/EquipamentoAPi'
import { buscarAgendaInspecoesEmpresa } from '../api/InspecaoEquipamentoAPI'
import {
  consultaEstatatisticaEquipamento,
  consultaEstatatisticaManutencao,
  consultaIndicadoresManutencaoEquipamentosEmpresa,
} from '../api/ManutencaoEquipamentoAPI'
import { TabelaEquipamentos } from '../components/tables/equipamento/tabela-equipamentos'

const MetricasManutencaoView = dynamic(() => import('./MetricasEmpresaView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export default function Equipamentos() {
  const { data: listaEquipamentos, isLoading: carregandoEquipamentos } =
    useQuery({
      queryKey: ['listaEquipamentosEmpresa'],
      queryFn: listarEquipamentos,
      staleTime: Number.POSITIVE_INFINITY,
    })

  const agendaInspecoes = useQuery({
    queryKey: ['agendaInspecoesEmpresa'],
    queryFn: buscarAgendaInspecoesEmpresa,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const estatisticasEquipamento = useQuery({
    queryKey: ['estatisticasEquipamentos'],
    queryFn: consultaEstatatisticaEquipamento,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const estatisticasManutencao = useQuery({
    queryKey: ['estatisticasManutencao'],
    queryFn: consultaEstatatisticaManutencao,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const estatisticasManutencaoMTTReMTBF = useQuery({
    queryKey: ['estatisticasManutencaoMTTRMTBFEmpresa'],
    queryFn: consultaIndicadoresManutencaoEquipamentosEmpresa,
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <section className="grid space-y-2">
      <MetricasManutencaoView
        listaEquipamentos={{
          dados: listaEquipamentos ?? [],
          carregandoEquipamentos,
        }}
        indicadores={{
          dados: estatisticasManutencaoMTTReMTBF.data ?? [],
          carregandoIndicadores: estatisticasManutencaoMTTReMTBF.isLoading,
        }}
        metricasManutencoes={{
          dados: estatisticasManutencao?.data ?? {
            qtd_equipamentos_manutencao_em_dia: 0,
            media_duracao: 0,
            qtd_manutencoes_realizadas: 0,
            total_duracao_manutencoes: 0,
          },
          carregandoMetricasManutencao: estatisticasManutencao.isLoading,
        }}
        metricasEquipamentos={{
          dados: estatisticasEquipamento?.data ?? {
            qtd_equipamentos_parados: 0,
            qtd_equipamentos_funcionando: 0,
          },
          carregandoMetricasEquipamentos: estatisticasEquipamento.isLoading,
        }}
        agendaEquipamento={{
          eventos: agendaInspecoes.data ?? [],
          carregandoAgenda: agendaInspecoes.isLoading,
        }}
      />
      <TabelaEquipamentos
        data={listaEquipamentos ?? []}
        carregandoEquipamentos={carregandoEquipamentos}
      />
    </section>
  )
}
