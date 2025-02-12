import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreVertical } from 'lucide-react'
import type { ItemAvaliacaoEmpresaType } from '../../../_api/AdmCompras'
import { AlterarDescricaoItemAvaliativoDialog } from '../dialogs/alterar-descricao-item-avaliativo'
import { AlterarStatusItemAvaliativoRecebimentoAlertDialog } from '../dialogs/alterar-status-item-avalitivo-recebimento'

interface MenuTabelaItensAvaliativosProps {
  row: ItemAvaliacaoEmpresaType
}

export function MenuTabelaItensAvaliacaoRecebimento({
  row,
}: MenuTabelaItensAvaliativosProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Editar item
            </DropdownMenuItem>
          </DialogTrigger>
          <AlterarDescricaoItemAvaliativoDialog
            id={row.id}
            descricao={row.descricao}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              {row.ativo ? 'Desativar item' : 'Ativar item'}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlterarStatusItemAvaliativoRecebimentoAlertDialog
            ativo={!row.ativo}
            id={row.id}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
