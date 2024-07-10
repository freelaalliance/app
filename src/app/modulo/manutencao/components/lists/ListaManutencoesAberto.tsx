import { Skeleton } from "@/components/ui/skeleton";
import { DadosManutencaoEquipamentoType } from "../../schemas/ManutencaoSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatarDataBrasil } from "@/lib/utils";

interface ManutencaoAbertoEquipamentoProps {
  listaManutencoes: DadosManutencaoEquipamentoType[]
  carregandoManutencoes: boolean
}

export function ListaManutencaoAberto({
  listaManutencoes,
  carregandoManutencoes,
}: ManutencaoAbertoEquipamentoProps) {
  return (
    carregandoManutencoes ? (
      <div className="flex-1 justify-center items-center space-y-2" >
        <Skeleton className="w-full h-15 md:h-20 rounded shadow" />
        <Skeleton className="w-full h-15 md:h-20 rounded shadow" />
        <Skeleton className="w-full h-15 md:h-20 rounded shadow" />
      </div>
    ) :
      listaManutencoes?.length > 0 ? (
        <div className="flex-1 space-y-2">
          <ScrollArea className="h-48">
            {
              listaManutencoes.map((manutencao) => {
                return (
                  <div className="flex flex-row my-4">
                    <div className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg select-none bg-white dark:bg-gray-800 hover:bg-gray-50 rounded-md flex-1 items-center pt-2 px-2 space-y-3">
                      <div className="flex-1">
                        <div className="font-medium">
                          {`Criado em: ${formatarDataBrasil(new Date(manutencao.criadoEm))}`}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-medium dark:text-white capitalize line-clamp-2">
                                {manutencao.observacoes}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{manutencao.observacoes}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 items-center">
          <p>Nenhuma manutenção em aberto</p>
        </div>
      )
  )
}