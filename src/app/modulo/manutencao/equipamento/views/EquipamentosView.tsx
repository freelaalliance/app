'use client'

import { useQuery } from "@tanstack/react-query";
import { TabelaEquipamentos } from "../components/tables/equipamento/tabela-equipamentos";
import { listarEquipamentos } from "../api/EquipamentoAPi";

export default function Equipamentos(){
  const {data: listaEquipamentos, isLoading} = useQuery({
    queryKey: ['listaEquipamentosEmpresa'],
    queryFn: listarEquipamentos,
  })

  return (
    <TabelaEquipamentos data={listaEquipamentos ?? []} carregandoEquipamentos={isLoading}/>
  )
}