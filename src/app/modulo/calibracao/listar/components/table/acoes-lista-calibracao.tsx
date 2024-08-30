import { MoreVertical } from 'lucide-react'

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
import { handleDownloadFile } from '@/lib/utils'

import { EdicaoCalibracaoDialog } from '../dialogs/EdicaoCalibracaoDialog'
import { ExclusaoCalibracaoDialog } from '../dialogs/ExclusaoCalibracaoDialog'
import { ExclusaoInstrumentoDialog } from '../dialogs/ExclusaoInstrumentoDialog'

import { Calibracao } from './schemas/SchemaNovaCalibracao'

interface DataTableRowActionsProps {
  row: Calibracao
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
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
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Editar calibração
            </DropdownMenuItem>
          </DialogTrigger>
          <EdicaoCalibracaoDialog
            idCalibracao={row.id}
          ></EdicaoCalibracaoDialog>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Excluir calibração
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoCalibracaoDialog
            idCalibracao={row.id}
            nomeInstrumento={row.nome}
            dataCalibracao={new Date(row.data)}
          />
        </AlertDialog>
        <DropdownMenuItem
          onClick={() => {
            handleDownloadFile(row.certificado, row.id)
          }}
        >
          Baixar certificado
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Excluir instrumento
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoInstrumentoDialog
            idInstrumento={row.idInstrumento}
            nomeInstrumento={row.nome}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
