import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EdicaoPecaProps, FormularioEdicaoPeca } from "../../forms/(equipamento)/FormularioEdicaoPecaEquipamento";

export function EdicaoPecaEquipamentoDialog({idEquipamento, idPeca, nome, descricao}: EdicaoPecaProps){
  return(
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Edição de peças</DialogTitle>
        <DialogDescription>Alterar dados da peça do equipamento</DialogDescription>
      </DialogHeader>
      <FormularioEdicaoPeca idPeca={idPeca} idEquipamento={idEquipamento} nome={nome} descricao={descricao} />
    </DialogContent>
  )
}