'use client'
import { useQuery } from '@tanstack/react-query'
import { CalendarClock, FileText, FileX2, PackageCheck } from 'lucide-react'

import { IndicadorInformativo } from '@/components/IndicadorInfo'

import { buscarResumoCompras } from '../api/RelatorioCompras'

export default function PainelCompras() {
  const resumoEstatisticasCompras = useQuery({
    queryKey: ['resumoEstatisticaCompras'],
    queryFn: () => buscarResumoCompras(),
    staleTime: Infinity,
  })

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <IndicadorInformativo
          titulo="Compras registradas"
          info={String(resumoEstatisticasCompras.data?.totalPedidos)}
          carregandoInformacao={resumoEstatisticasCompras.isLoading}
          icon={FileText}
        />
        <IndicadorInformativo
          titulo="Compras canceladas"
          info={String(resumoEstatisticasCompras.data?.totalCancelados)}
          carregandoInformacao={resumoEstatisticasCompras.isLoading}
          icon={FileX2}
        />
        <IndicadorInformativo
          titulo="Compras recebidas"
          info={String(resumoEstatisticasCompras.data?.totalRecebidos)}
          carregandoInformacao={resumoEstatisticasCompras.isLoading}
          icon={PackageCheck}
        />
        <IndicadorInformativo
          titulo="Compras não recebidas"
          info={String(resumoEstatisticasCompras.data?.totalNaoRecebidos)}
          carregandoInformacao={resumoEstatisticasCompras.isLoading}
          icon={CalendarClock}
        />
      </div>
    </section>
  )
}
