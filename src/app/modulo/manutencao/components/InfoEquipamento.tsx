import { Info } from "lucide-react";
import { DadosEquipamentoType } from "../schemas/EquipamentoSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface InfoEquipamentoProps {
  dadosEquipamento?: DadosEquipamentoType
  carregandoDados: boolean
}

export function InformacaoEquipamento({ dadosEquipamento, carregandoDados }: InfoEquipamentoProps) {
  return (
    <>
      {carregandoDados ? (
        <div className="grid">
          <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
            <Skeleton className="w-10 rounded shadow-sm" />
            <Skeleton className="w-full rounded shadow-sm" />
            <Skeleton className="w-10 rounded shadow-sm" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      ) : !dadosEquipamento ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Equipamento não encontrado</AlertTitle>
          <AlertDescription>
            Nenhuma informação referente a este equipamento foi encontrado, procure o suporte!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid space-y-2">
          <div className="flex flex-col md:flex-row md:justify-around space-y-2 md:space-y-0 gap-2">
            <span className="p-4 border rounded w-full text-center"><b>{'Código: '}</b>{dadosEquipamento.codigo}</span>
            <span className="p-4 border rounded w-full text-center"><b>{'Nome: '}</b>{dadosEquipamento.nome}</span>
            <span className="p-4 border rounded w-full text-center"><b>{'Frequência: '}</b>{`${dadosEquipamento.frequencia} Dias`}</span>
          </div>
          {dadosEquipamento.especificacao && (
            <span className="p-2 border rounded w-full">
              {dadosEquipamento.especificacao}
            </span>
          )}
        </div>
      )}
    </>
  )
}