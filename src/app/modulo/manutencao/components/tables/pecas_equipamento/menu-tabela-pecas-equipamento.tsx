import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DadosPecasEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EdicaoPecaEquipamentoDialog } from "../../dialogs/(equipamento)/EdicaoPecaDialog";
import { ExclusaoPecaEquipamentoDialog } from "../../dialogs/(equipamento)/ExclusaoPecaEquipamentoDialog";

interface MenuTabelaPecasEquipamentoProps {
  row: DadosPecasEquipamentoType
}

export function MenuTabelaPecasEquipamento({ row }: MenuTabelaPecasEquipamentoProps) {
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
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Editar item
            </DropdownMenuItem>
          </DialogTrigger>
          <EdicaoPecaEquipamentoDialog
            idPeca={row.id}
            idEquipamento={row.equipamentoId}
            nome={row.nome}
            descricao={row.descricao}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Remover item
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoPecaEquipamentoDialog idPeca={row.id} idEquipamento={row.equipamentoId} />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}