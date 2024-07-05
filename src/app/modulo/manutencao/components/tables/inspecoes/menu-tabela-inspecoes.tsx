import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DadosInspecoesEquipamentoType } from "../../../schemas/EquipamentoSchema"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { MoreVertical } from "lucide-react"
import { VisualizarInspecaoDialog } from "../../dialogs/(inspecao)/VisualizarInspecaoEquipamento"

interface MenuTabelaInspecoesEquipamentoProps {
  row: DadosInspecoesEquipamentoType
}

export function MenuTabelaInspecoesEquipamento({ row }: MenuTabelaInspecoesEquipamentoProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="size-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {
          row.finalizadoEm && (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  Visualizar inspeção
                </DropdownMenuItem>
              </DialogTrigger>
              <VisualizarInspecaoDialog dados={row}/>
            </Dialog>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}