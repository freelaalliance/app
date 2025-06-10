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
import type { ProdutoServicoType } from '../../../_types/produtoServico'
import { EdicaoProdutoServicoDialog } from '../dialogs/edicao-produto'
import { ExcluirProdutoServicoDialog } from '../dialogs/remover-produto'

interface MenuTabelaProdutoServicoProps {
  dadosProduto: ProdutoServicoType
}

export function MenuTabelaProdutoServico({
  dadosProduto,
}: MenuTabelaProdutoServicoProps) {
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
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Editar produto/serviço
            </DropdownMenuItem>
          </DialogTrigger>
          <EdicaoProdutoServicoDialog produto={dadosProduto} />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Excluir produto/serviço
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExcluirProdutoServicoDialog
            id={dadosProduto.id}
            nome={dadosProduto.nome}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
