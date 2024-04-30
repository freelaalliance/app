import { useQuery } from '@tanstack/react-query'
import {
  CalendarClock,
  History,
  Loader2,
  MapPin,
  SmartphoneNfc,
} from 'lucide-react'
import Image from 'next/image'
import { useId } from 'react'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useCalibracao } from '@/lib/CaseAtom'
import { formatarDataBrasil } from '@/lib/utils'

import { buscarDadosHistoricoInstrumento } from './api/HistoricoInstrumento'
import { DetalheCalibracaoInstrumento } from './calibracao/DetalheCalibracaoInstrumento'
import { ListaCalibracoesInstrumentos } from './calibracao/ListaCalibracoesInstrumento'

interface DetalhesInstrumentoDialogPropsInterface {
  idInstrumento: string
}

export function DetalhesInstrumentoDialog({
  idInstrumento,
}: DetalhesInstrumentoDialogPropsInterface) {
  const [calibracaoSelecionada] = useCalibracao()
  const { data: dadosInstrumento, isLoading: isLoadingDadosInstrumento } =
    useQuery({
      queryKey: ['dadosDetalhadoInstrumento', idInstrumento],
      queryFn: () => buscarDadosHistoricoInstrumento(idInstrumento),
    })

  const dadosCalibracaoSelecionada = dadosInstrumento?.calibracoes.find(
    (item) => item.id === calibracaoSelecionada.selected,
  )

  const idDetalhesInstrumentos: string = useId()
  const idDetalhesCalibracaoInstrumentos: string = useId()

  return (
    <DialogContent className="h-screen max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg overflow-x-auto md:h-auto">
      {isLoadingDadosInstrumento ? (
        <div className="flex justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>{`Detalhes do instrumento (${dadosInstrumento?.nome})`}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-center md:flex-row md:justify-between">
            <Card className="mt-4 sm:w-max md:w-[200px] lg:w-[235px] border-0 shadow-md text-muted dark:text-white bg-gradient-to-br from-gray-300 to-padrao-gray-250 dark:shadow-none dark:bg-muted">
              <CardTitle className="p-2 text-md">
                Codigo
                <SmartphoneNfc className="w-5 h-5 mt-1 float-end" />
              </CardTitle>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {dadosInstrumento?.codigo ?? ''}
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4 sm:w-max md:w-[200px] lg:w-[235px] border-0 shadow-md text-muted dark:text-white bg-gradient-to-br from-gray-300 to-padrao-gray-250 dark:shadow-none dark:bg-muted">
              <CardTitle className="p-2 text-md">
                Localização
                <MapPin className="w-5 h-5 mt-1 float-end" />
              </CardTitle>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {dadosInstrumento?.localizacao ?? ''}
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4 sm:w-max md:w-[200px] lg:w-[235px] border-0 shadow-md text-muted dark:text-white bg-gradient-to-br from-gray-300 to-padrao-gray-250 dark:shadow-none dark:bg-muted">
              <CardTitle className="p-2 text-md">
                Freq. Calibração
                <CalendarClock className="w-5 h-5 mt-1 float-end" />
              </CardTitle>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{`${dadosInstrumento?.repeticao}x - ${dadosInstrumento?.frequencia} Mês(es)`}</div>
              </CardContent>
            </Card>
            <Card className="mt-4 sm:w-max md:w-[200px] lg:w-[235px] border-0 shadow-md text-muted dark:text-white bg-gradient-to-br from-gray-300 to-padrao-gray-250 dark:shadow-none dark:bg-muted">
              <CardTitle className="p-2 text-md">
                Última calibração
                <History className="w-5 h-5 mt-1 float-end" />
              </CardTitle>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {dadosInstrumento?.calibracoes[0].realizadoEm
                    ? formatarDataBrasil(
                        new Date(dadosInstrumento?.calibracoes[0].realizadoEm),
                      )
                    : formatarDataBrasil(new Date())}
                </div>
              </CardContent>
            </Card>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2">
              <ListaCalibracoesInstrumentos
                key={idDetalhesInstrumentos}
                items={dadosInstrumento?.calibracoes ?? []}
              />
            </div>
            <div className="md:col-span-3">
              {!calibracaoSelecionada.selected ? (
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={'/choice_option.svg'}
                    alt="Nenhuma calibração selecionada"
                    width={250}
                    height={250}
                  />
                  <p className="text-sm font-medium mt-5 md:text-base lg:text-lg text-padrao-gray-200">
                    Nenhuma calibração selecionada!
                  </p>
                </div>
              ) : (
                <DetalheCalibracaoInstrumento
                  key={idDetalhesCalibracaoInstrumentos}
                  dados={dadosCalibracaoSelecionada || null}
                />
              )}
            </div>
          </div>
        </>
      )}
    </DialogContent>
  )
}
