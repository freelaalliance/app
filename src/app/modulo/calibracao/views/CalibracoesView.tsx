'use client'

import { useQuery } from "@tanstack/react-query"
import { TabelaCalibracoes } from "../components/tables/(calibracoes)/data-table-calibracao"
import { recuperarCalibracoesInstrumentosEmpresa } from "../api/Calibracao"

export default function CalibracoesView(){

  const { data: listaCalibracoes, isLoading } = useQuery({
    queryKey: ['listaCalibracoes'],
    queryFn: recuperarCalibracoesInstrumentosEmpresa,
  })

  const calibracoes = listaCalibracoes
  ? listaCalibracoes?.map((dados) => {
      return {
        id: dados.calibracao.id,
        idInstrumento: dados.instrumento.id,
        codigo: dados.instrumento.codigo,
        nome: dados.instrumento.nome,
        localizacao: dados.instrumento.localizacao,
        marca: dados.instrumento.marca,
        data: dados.calibracao.realizadoEm,
        status: dados.calibracao.status,
        certificado: dados.calibracao.certificado,
      }
    })
  : []

  return (
    <section className="grid space-y-2">
      <TabelaCalibracoes data={calibracoes} carregandoCalibracoes={isLoading}/>
    </section>
  )
}