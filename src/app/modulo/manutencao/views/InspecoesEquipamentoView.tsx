'use client'

import { useQuery } from "@tanstack/react-query"
import { buscarInspecoesEquipamento } from "../api/InspecaoEquipamentoAPI"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ListaInspecoesAberto } from "../components/lists/ListaInspecoesAberto"
import { TabelaInspecoesEquipamento } from "../components/tables/inspecoes/tabela-inspecoes"
import IndicadoresInspecaoEquipamento from "../components/charts/IndicadorInspecaoEquipamento"
import { DadosInspecoesEquipamentoType } from "../schemas/EquipamentoSchema"

interface InspecaoEquipamentoProps {
  idEquipamento: string
  listaInspecoesEquipamento: Array<DadosInspecoesEquipamentoType>
  carregandoInspecoes: boolean
}

export default function InspecoesEquipamentoView({ idEquipamento, listaInspecoesEquipamento, carregandoInspecoes }: InspecaoEquipamentoProps) {
  
  return (
    <section className="flex-1">
        <TabelaInspecoesEquipamento
          idEquipamento={idEquipamento}
          data={listaInspecoesEquipamento?.filter((inspecoes) => inspecoes.finalizadoEm) ?? []}
          carregandoInspecoes={carregandoInspecoes}
        />
    </section>
  )
}