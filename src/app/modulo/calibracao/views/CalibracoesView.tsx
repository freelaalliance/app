'use client'

import { useQuery } from '@tanstack/react-query'
import { recuperarCalibracoesInstrumentosEmpresa } from '../api/Calibracao'
import { TabelaCalibracoes } from '../components/tables/(calibracoes)/data-table-calibracao'
import type { Calibracao } from '../schemas/(calibracoes)/SchemaNovaCalibracao'

export default function CalibracoesView() {
  const { data: listaCalibracoes, isLoading } = useQuery({
    queryKey: ['listaCalibracoes'],
    queryFn: recuperarCalibracoesInstrumentosEmpresa,
  })

  const calibracoes: Calibracao[] = listaCalibracoes
    ? listaCalibracoes?.map(dados => {
        return {
          id: dados.calibracao.id,
          idInstrumento: dados.instrumento.id,
          codigo: dados.instrumento.codigo,
          nome: dados.instrumento.nome,
          localizacao: dados.instrumento.localizacao,
          marca: dados.instrumento.marca,
          resolucao: dados.instrumento.resolucao,
          numeroCertificado: dados.calibracao.numeroCertificado,
          observacao: dados.calibracao.observacao,
          frequencia: dados.instrumento.frequencia,
          tolerancia: Number(dados.calibracao.toleranciaEstabelicida),
          erroEncontrado: Number(dados.calibracao.erroEncontrado),
          incertezaTendencia: Number(
            dados.calibracao.incertezaTendenciaEncontrado
          ),
          data: dados.calibracao.realizadoEm,
          status: dados.calibracao.status,
          certificado: dados.calibracao.certificado,
          usuario: dados.calibracao.usuarioNome,
        }
      })
    : []

  return (
    <section className="grid space-y-2">
      <TabelaCalibracoes data={calibracoes} carregandoCalibracoes={isLoading} />
    </section>
  )
}
