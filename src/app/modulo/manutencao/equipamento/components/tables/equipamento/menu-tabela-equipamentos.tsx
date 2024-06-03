import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DadosEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExclusaoEquipamentoDialog } from "../../dialogs/ExclusaoEquipamentoDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PecasEquipamentoDialog } from "../../dialogs/PecasEquipamentoDialog";
import { NovaPecaEquipamentoDialog } from "../../dialogs/NovaPecaEquipamentoDialog";
import { EdicaoEquipamentoDialog } from "../../dialogs/EdicaoEquipamentoDialog";
import { AgendaEquipamentoDialog } from "../../dialogs/AgendaEquipamentoDialog";

interface MenuTabelaEquipamentoProps {
  row: DadosEquipamentoType
}

export function MenuTabelaEquipamento({ row }: MenuTabelaEquipamentoProps) {
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
              Editar equipamento
            </DropdownMenuItem>
          </DialogTrigger>
          <EdicaoEquipamentoDialog
            id={row.id}
            codigo={row.codigo}
            especificacao={row.especificacao}
            frequencia={row.frequencia}
            nome={row.nome}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Excluir equipamento
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoEquipamentoDialog id={row.id} />
        </AlertDialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Agenda
            </DropdownMenuItem>
          </DialogTrigger>
          <AgendaEquipamentoDialog idEquipamento={row.id}/>
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Visualizar peças
            </DropdownMenuItem>
          </DialogTrigger>
          <PecasEquipamentoDialog idEquipamento={row.id} />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Adicionar peça
            </DropdownMenuItem>
          </DialogTrigger>
          <NovaPecaEquipamentoDialog idEquipamento={row.id} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}