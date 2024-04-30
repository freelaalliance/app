import { MoreVertical } from 'lucide-react'

import { PerfilType } from '@/app/modulo/administrativo/empresa/schemas/SchemaPerfil'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DialogConfirmaDeletaPerfil } from '../../dialogs/DialogConfirmaDeletaPerfil'
import { DialogEditaPerfil } from '../../dialogs/DialogEditaPerfil'
import { DialogPermissoesPerfil } from '../../dialogs/DialogPermissoesPerfil'

interface MenuTabelaPerfilProps {
  row: PerfilType
}

export function MenuTabelaPerfil({ row }: MenuTabelaPerfilProps) {
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
              Editar perfil
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogEditaPerfil
            idPerfil={row.id}
            nomePerfil={row.nome}
            perfilAdministrativo={row.administrativo}
            idEmpresa={row.empresaId}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Excluir perfil
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DialogConfirmaDeletaPerfil id={row.id} />
        </AlertDialog>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Editar permissões
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogPermissoesPerfil idPerfil={row.id} idEmpresa={row.empresaId} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
