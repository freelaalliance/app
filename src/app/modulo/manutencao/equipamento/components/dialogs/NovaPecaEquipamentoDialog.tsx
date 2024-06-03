import { DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormularioNovaPeca, NovaPecaEquipamentoProps } from "../forms/FormularioNovaPecaEquipamento";

export function NovaPecaEquipamentoDialog({ idEquipamento }: NovaPecaEquipamentoProps) {
  return (
    <DialogContent className="max-w-3xl h-auto">
      <DialogHeader>
        <DialogTitle>Adicionar peças</DialogTitle>
        <DialogDescription>Área para criar novas peças para o equipamento</DialogDescription>
      </DialogHeader>
      <FormularioNovaPeca idEquipamento={idEquipamento}/>
    </DialogContent>
  )
}