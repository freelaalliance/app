import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreVertical } from 'lucide-react'
import type { ItemAvaliacaoExpedicaoType } from '../../../_api/AdmVendas'
import { AlterarDescricaoItemAvaliativoExpedicaoDialog } from '../dialogs/alterar-descricao-item-expedicao'

interface MenuTabelaItensAvaliativosExpedicaoProps {
  row: ItemAvaliacaoExpedicaoType
}

export function MenuTabelaItensAvaliacaoExpedicao({
  row,
}: MenuTabelaItensAvaliativosExpedicaoProps) {
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
          <AlterarDescricaoItemAvaliativoExpedicaoDialog
            id={row.id}
            pergunta={row.pergunta}
          />
        </Dialog>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
