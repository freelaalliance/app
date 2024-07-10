import { ScrollArea } from "@/components/ui/scroll-area"
import { DadosInspecoesEquipamentoType } from "../../schemas/EquipamentoSchema"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { formatarDataBrasil } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RetomadaInspecaoEquipamentoDialog } from "../dialogs/(inspecao)/RetomadaInspecaoDialog"

interface ListaInspecoesAbertoProps {
  listaInspecoes: DadosInspecoesEquipamentoType[]
  carregandoInspecoes: boolean
}

export function ListaInspecoesAberto({ carregandoInspecoes, listaInspecoes }: ListaInspecoesAbertoProps) {

  function calcularProgressoInspecao(qtdTotalPontos: number, qtdPontosInspecionado: number) {
    const progresso = (qtdPontosInspecionado / qtdTotalPontos) * 100
    return Math.round(progresso)
  }

  return (
    carregandoInspecoes ? (
      <div className="flex-1 justify-center items-center space-y-2" >
        <Skeleton className="w-full h-15 md:h-20 rounded shadow" />
        <Skeleton className="w-full h-15 md:h-20 rounded shadow" />
        <Skeleton className="w-full h-15 md:h-20 rounded shadow" />
      </div>
    ) :
      listaInspecoes?.length > 0 ? (
        <div className="flex-1 space-y-2">
          <ScrollArea className="h-48">
            {
              listaInspecoes.map((inspecao) => {
                return (
                  <Dialog key={inspecao.id}>
                    <DialogTrigger asChild>
                      <div className="flex flex-row my-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg select-none bg-white dark:bg-gray-800 hover:bg-gray-50 rounded-md flex-1 items-center pt-2 px-2 space-y-3">
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {`Iniciado em: ${formatarDataBrasil(new Date(inspecao.iniciadoEm))}`}
                                  </div>
                                  <div className="font-medium dark:text-white capitalize">
                                    {inspecao.usuario.pessoa.nome}
                                  </div>
                                </div>
                                <Progress className="h-1 rounded-none" value={calcularProgressoInspecao(
                                  inspecao.PontosInspecaoEquipamento.length,
                                  inspecao.PontosInspecaoEquipamento.filter((pontos) => pontos.inspecionadoEm).length
                                )} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {`${calcularProgressoInspecao(
                                inspecao.PontosInspecaoEquipamento.length,
                                inspecao.PontosInspecaoEquipamento.filter((pontos) => pontos.inspecionadoEm).length
                              )}% do equipamento inspecionado`}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </DialogTrigger>
                    <RetomadaInspecaoEquipamentoDialog dadosInspecao={inspecao} />
                  </Dialog>
                )
              })
            }
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 items-center">
          <p>Nenhuma inspeção em aberto</p>
        </div>
      )
  )
}