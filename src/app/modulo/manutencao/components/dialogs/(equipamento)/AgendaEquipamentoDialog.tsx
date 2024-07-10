
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AgendaEquipamentoDialogProps } from "../../../views/AgendaEquipamentoView"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const AgendaEquipamentoView = dynamic(() => import('../../../views/AgendaEquipamentoView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export function AgendaEquipamentoDialog({
  idEquipamento
}: AgendaEquipamentoDialogProps) {
  return (
    <DialogContent className="max-w-max lg:max-w-5xl">
      <DialogHeader>
        <DialogTitle>
          Agenda de inspeções
        </DialogTitle>
        <DialogDescription>
          Agenda de inspeções do equipamento
        </DialogDescription>
      </DialogHeader>
      <AgendaEquipamentoView idEquipamento={idEquipamento}/>
    </DialogContent>
  )
}