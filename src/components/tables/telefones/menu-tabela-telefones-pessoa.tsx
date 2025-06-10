'use client'

import { MoreVertical } from 'lucide-react'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ExcluirTelefonePessoaDialog } from '@/components/dialogs/RemoverTelefoneDialog'
import type { TelefonePessoaType } from './tabela-telefones-pessoa'

interface MenuTabelaTelefonesPessoaProps {
  telefonePessoa: TelefonePessoaType
}

export function MenuTabelaTelefonesPessoa({
  telefonePessoa
}: MenuTabelaTelefonesPessoaProps) {
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Excluir telefone
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExcluirTelefonePessoaDialog id={telefonePessoa.id} />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
