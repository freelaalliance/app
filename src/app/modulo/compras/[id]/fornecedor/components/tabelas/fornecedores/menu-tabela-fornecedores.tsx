import { MoreVertical } from 'lucide-react'
import Link from 'next/link'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import type { FornecedoresEmpresaType } from '../../../(api)/FornecedorApi'
import { NovaAvaliacaoCriticoDialog } from '../../dialogs/NovaAvaliacaoCriticoDialog'
import { NovoPedidoDialog } from '../../dialogs/NovoPedidoDialog'
import { ExclusaoFornecedor } from '../../dialogs/RemoverFornecedorDialog'
import { DialogAnexosFornecedor } from '../../dialogs/AnexosFornecedorDialog'

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
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Anexos
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogAnexosFornecedor idFornecedor={fornecedor.id} />
        </Dialog>
        {fornecedor.aprovado && (
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault()
                }}
              >
                Novo pedido
              </DropdownMenuItem>
            </DialogTrigger>
            <NovoPedidoDialog fornecedorId={fornecedor.id} />
          </Dialog>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Excluir fornecedor
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoFornecedor idFornecedor={fornecedor.id} />
        </AlertDialog>
        <Separator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Reavaliar
            </DropdownMenuItem>
          </DialogTrigger>
          <NovaAvaliacaoCriticoDialog idFornecedor={fornecedor.id} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
