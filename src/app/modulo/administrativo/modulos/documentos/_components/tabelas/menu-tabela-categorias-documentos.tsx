import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreVertical } from 'lucide-react'
import type { CategoriaDocumentoType } from '../../../_api/AdmDocumentos'
import { RemoverCategoriaDocumentoAlertDialog } from '../dialogs/remover-categoria-alert'

interface MenuTabelaCategoriaDocumentosProps {
  row: CategoriaDocumentoType
}

export function MenuTabelaCategoriasDocumento({
  row,
}: MenuTabelaCategoriaDocumentosProps) {
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Remover categoria
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <RemoverCategoriaDocumentoAlertDialog
            id={row.id}
            nome={row.nome}
            empresaId={row.empresaId}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
