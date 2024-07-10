import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EdicaoEquipamentoForm, FormEdicaoEquipamentoProps } from "../../forms/(equipamento)/FormularioEdicaoEquipamento";

export function EdicaoEquipamentoDialog({ id, codigo, nome, especificacao, frequencia }: FormEdicaoEquipamentoProps) {
  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Edição do equipamento</DialogTitle>
        <DialogDescription>Alterar dados do equipamento</DialogDescription>
      </DialogHeader>
      <EdicaoEquipamentoForm
        id={id}
        codigo={codigo}
        nome={nome}
        especificacao={especificacao}
        frequencia={frequencia}
      />
    </DialogContent>
  )
}