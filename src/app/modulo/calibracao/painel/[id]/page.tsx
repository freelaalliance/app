'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ClipboardCheck,
  ClipboardX,
  Clock11,
  SmartphoneNfc,
} from 'lucide-react'
import React from 'react'

import { LoadingCard } from '@/components/card-loading/CardLoading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { buscarEstatisticasCalibracoesEmpresa } from '../api/EstatisticasCalibracao'
import { CardInfo } from '../components/CardInfo'
import Historicos from '../historicos/page'
import Relatorios from '../relatorios/page'
import Vencimentos from '../vencimentos/page'

export default function Painel() {
  const { data, isLoading } = useQuery({
    queryKey: ['estatisticasCalibracaoes'],
    queryFn: buscarEstatisticasCalibracoesEmpresa,
  })

  return (
    <>
      <div className="grid grid-flow-col justify-stretch gap-4 overflow-x-auto pb-3">
        {isLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          <>
            <CardInfo
              titulo="Instrumentos"
              subtitulo={`${(data?.quantidadeInstrumentosCadastradoAtual ?? 0) <= 1 ? data?.quantidadeInstrumentosCadastradoAtual + ' instrumento cadastrado ' : data?.quantidadeInstrumentosCadastradoAtual + ' instrumentos cadastrados '} este mês`}
              informacao={data?.quantidadeInstrumentosEmpresa ?? 0}
              className="bg-gradient-to-br from-gray-300 to-padrao-gray-250"
              icon={SmartphoneNfc}
            />
            <CardInfo
              titulo="Aprovadas"
              subtitulo={`${(data?.quantidadeCalibracoesAprovadas ?? 0) + (data?.quantidadeCalibracoesReprovadas ?? 0) <= 1 ? (data?.quantidadeCalibracoesAprovadas ?? 0) + (data?.quantidadeCalibracoesReprovadas ?? 0) + ' Calibração realizada ' : (data?.quantidadeCalibracoesAprovadas ?? 0) + (data?.quantidadeCalibracoesReprovadas ?? 0) + ' Calibrações realizadas '}este mês`}
              informacao={data?.quantidadeCalibracoesAprovadas ?? 0}
              className="bg-gradient-to-br from-gray-300 to-padrao-gray-250"
              icon={ClipboardCheck}
            />
            <CardInfo
              titulo="Reprovadas"
              subtitulo={`${(data?.quantidadeCalibracoesAprovadas ?? 0) + (data?.quantidadeCalibracoesReprovadas ?? 0) <= 1 ? (data?.quantidadeCalibracoesAprovadas ?? 0) + (data?.quantidadeCalibracoesReprovadas ?? 0) + ' Calibração realizada ' : (data?.quantidadeCalibracoesAprovadas ?? 0) + (data?.quantidadeCalibracoesReprovadas ?? 0) + ' Calibrações realizadas '}este mês`}
              informacao={data?.quantidadeCalibracoesReprovadas ?? 0}
              className="bg-gradient-to-br from-gray-300 to-padrao-gray-250"
              icon={ClipboardX}
            />
            <CardInfo
              titulo="Vencendo / Vencidos"
              subtitulo={`${(data?.calibracoesDentroPrazo ?? 0) <= 1 ? data?.calibracoesDentroPrazo + ' Calibração ' : data?.calibracoesDentroPrazo + ' Calibrações '}  dentro do prazo`}
              informacao={`${data?.calibracoesVencendo ?? 0} / ${data?.calibracoesVencido ?? 0}`}
              className="bg-gradient-to-br from-gray-300 to-padrao-gray-250"
              icon={Clock11}
            />
          </>
        )}
      </div>
      <div>
        <Tabs defaultValue="vencimentos" className="space-y-4">
          <TabsList className="flex bg-transparent space-x-2 justify-between md:justify-start">
            <TabsTrigger
              className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500"
              value="vencimentos"
            >
              Vencimentos
            </TabsTrigger>
            <TabsTrigger
              className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500"
              value="historicos"
            >
              Histórico
            </TabsTrigger>
            <TabsTrigger
              className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600  data-[state=active]:text-white hover:bg-sky-500"
              value="relatorio"
            >
              Relatórios
            </TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="vencimentos">
            <Vencimentos />
          </TabsContent>
          <TabsContent value="historicos">
            <Historicos />
          </TabsContent>
          <TabsContent value="relatorio">
            <Relatorios />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
