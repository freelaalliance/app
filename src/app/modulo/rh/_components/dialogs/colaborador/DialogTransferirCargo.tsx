'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowRightLeft } from 'lucide-react'
import { useState } from 'react'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { FormularioTransferirCargo } from '../../forms/colaborador/FormularioTransferirCargo'

interface DialogTransferirCargoProps {
  contratacao: Contratacao
  children?: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function DialogTransferirCargo({
  contratacao,
  children,
  onOpenChange,
}: DialogTransferirCargoProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSuccess = () => {
    setOpen(false)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Transferir Cargo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Cargo</DialogTitle>
          <DialogDescription>
            Transfira o colaborador {contratacao.colaborador.pessoa.nome} para um novo cargo.
            Esta ação irá atualizar o cargo atual do colaborador.
          </DialogDescription>
        </DialogHeader>
        <FormularioTransferirCargo
          contratacao={contratacao}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
