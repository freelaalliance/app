'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useInstrumento } from '@/lib/CaseAtom'

import { recuperarCalibracoesInstrumentosEmpresa } from '../../listar/api/Calibracao'

import { LinhaTempoCalibracoesInstrumento } from './components/LinhaTempoCalibracoesInstrumento'
import { ListaInstrumento } from './components/ListaInstrumento'

export default function Historicos() {
  const [instrumentoSelecionado] = useInstrumento()

  const { data: listaCalibracoes, isLoading } = useQuery({
    queryKey: ['historicoCalibracoes'],
    queryFn: recuperarCalibracoesInstrumentosEmpresa,
  })

  return (
    <Card className="shadow bg-gray-50">
      <CardTitle className="py-4 ml-3">Histórico de calibrações</CardTitle>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 space-x-10 space-y-2">
          <div className="col-span-1 md:col-span-2">
            <ListaInstrumento instrumentos={listaCalibracoes ?? []} />
          </div>
          <div className="col-span-1 md:col-span-3">
            {isLoading ? (
              <div className="flex h-[240px] w-full items-center justify-center">
                <Loader2 className="animate-spin h-16 w-16 " />
              </div>
            ) : listaCalibracoes?.length === 0 ? (
              <p className="text-sm font-medium mt-5 md:text-base lg:text-lg text-padrao-gray-200">
                Nenhuma calibração encontrada!
              </p>
            ) : (
              instrumentoSelecionado.selected && (
                <LinhaTempoCalibracoesInstrumento
                  calibracoes={
                    listaCalibracoes?.filter(
                      ({ instrumento }) =>
                        instrumento.id === instrumentoSelecionado.selected,
                    ) ?? []
                  }
                />
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
