'use client'

import { MoreVertical } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { schemaEmailForm } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ExclusaoEmailFornecedor } from '../../dialogs/RemoverEmailDialog'

interface MenuTabelaEmailsFornecedorProps {
  emailFornecedor: z.infer<typeof schemaEmailForm>
}

export function MenuTabelaEmailsFornecedor({
  emailFornecedor,
}: MenuTabelaEmailsFornecedorProps) {
  const searchParams = useSearchParams()

  const idFornecedor = searchParams.get('id')

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
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Excluir email
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoEmailFornecedor
            idFornecedor={idFornecedor ?? ''}
            id={emailFornecedor.id ?? ''}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
