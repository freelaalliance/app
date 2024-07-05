import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TabelaPecasEquipamento, TabelaPecasEquipamentoProps } from "../../tables/pecas_equipamento/tabela-pecas-equipamento";

export function PecasEquipamentoDialog({idEquipamento}: TabelaPecasEquipamentoProps){
  return(
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Peças do equipamento</DialogTitle>
        <DialogDescription>Visualizar todas as peças do equipamento</DialogDescription>
      </DialogHeader>
      <TabelaPecasEquipamento idEquipamento={idEquipamento} />
    </DialogContent>
  )
}