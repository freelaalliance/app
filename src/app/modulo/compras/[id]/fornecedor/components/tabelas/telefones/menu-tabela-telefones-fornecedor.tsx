'use client'

import { MoreVertical } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import type { z } from 'zod'

import type { schemaTelefoneForm } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ExclusaoTelefoneFornecedor } from '../../dialogs/RemoverTelefoneDialog'

interface MenuTabelaTelefonesFornecedorProps {
  telefoneFornecedor: z.infer<typeof schemaTelefoneForm>
}

export function MenuTabelaTelefonesFornecedor({
  telefoneFornecedor,
}: MenuTabelaTelefonesFornecedorProps) {
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
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Excluir telefone
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoTelefoneFornecedor
            id={telefoneFornecedor.id ?? ''}
            idFornecedor={idFornecedor ?? ''}
          />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
