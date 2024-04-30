import { MoreVertical } from 'lucide-react'

import { UsuarioType } from '@/app/modulo/administrativo/empresa/schemas/SchemaUsuarios'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ConfirmaAlteracaoStatusUsuarioDialog } from '../../dialogs/ConfirmaAlteraStatusDialog'
import { DialogEdicaoUsuario } from '../../dialogs/EdicaoUsuarioDialog'

interface MenuTabelaUsuarioProps {
  row: UsuarioType
}

export function MenuTabelaUsuario({ row }: MenuTabelaUsuarioProps) {
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
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Editar usuário
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogEdicaoUsuario dadosUsuario={row} />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              {row.status === 'desativado'
                ? 'Ativar usuário'
                : 'Desativar usuário'}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ConfirmaAlteracaoStatusUsuarioDialog
            idUsuario={row.id}
            statusUsuario={row.status === 'desativado'}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
