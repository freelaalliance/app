import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DadosManutencaoEquipamentoType } from "../../../schemas/ManutencaoSchema";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertCancelarManutencaoEquipamento } from "../../dialogs/(manutencao)/AlertDialogCancelaManutencao";
import { AlertEncerrarManutencaoEquipamento } from "../../dialogs/(manutencao)/AlertDialogEncerrarManutencao";

interface MenuTabelaManutencaoEquipamentoProps {
  row: DadosManutencaoEquipamentoType
}

export function MenuTabelaManutencaoEquipamento({ row }: MenuTabelaManutencaoEquipamentoProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!(row.criadoEm || row.iniciadoEm) && (!row.canceladoEm && !row.finalizadoEm)}>
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
          (row.criadoEm || row.iniciadoEm) && (!row.canceladoEm && !row.finalizadoEm) ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                    }}
                    disabled={!row.iniciadoEm}
                  >
                    Finalizar manutenção
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertEncerrarManutencaoEquipamento idManutencao={row.id} equipamentoId={row.equipamentoId}/>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                    }}
                  >
                    Cancelar manutenção
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertCancelarManutencaoEquipamento idManutencao={row.id} equipamentoId={row.equipamentoId} />
              </AlertDialog>
            </>
          ) : (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
              disabled
            >
              Manutenção finalizada ou cancelada
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}