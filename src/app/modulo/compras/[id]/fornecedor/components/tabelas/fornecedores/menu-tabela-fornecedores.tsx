import { MoreVertical } from 'lucide-react'
import Link from 'next/link'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { FornecedoresEmpresaType } from '../../../(api)/FornecedorApi'
import { ExclusaoFornecedor } from '../../dialogs/RemoverFornecedorDialog'

interface MenuTabelaFornecedoresProps {
  fornecedor: FornecedoresEmpresaType
}

export function MenuTabelaFornecedores({
  fornecedor,
}: MenuTabelaFornecedoresProps) {
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
        <DropdownMenuItem asChild>
          <Link href={`fornecedor/visualizar?id=${fornecedor.id}`}>
            Visualizar
          </Link>
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Excluir fornecedor
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoFornecedor idFornecedor={fornecedor.id} />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
