'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ArrowRightLeft, MoreHorizontal, UserX } from 'lucide-react'
import { useState } from 'react'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { AlertDialogDemitirColaborador } from './AlertDialogDemitirColaborador'
import { DialogTransferirCargo } from './DialogTransferirCargo'

interface PopoverAcoesColaboradorProps {
  contratacao: Contratacao
}

export function PopoverAcoesColaborador({
  contratacao,
}: PopoverAcoesColaboradorProps) {
  const [open, setOpen] = useState(false)

  const handleActionSuccess = () => {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Ações
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          <DialogTransferirCargo 
            contratacao={contratacao}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transferir Cargo
            </Button>
          </DialogTransferirCargo>

          <Separator />

          <AlertDialogDemitirColaborador
            contratacao={contratacao}
            onSuccess={handleActionSuccess}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <UserX className="h-4 w-4 mr-2" />
              Demitir Colaborador
            </Button>
          </AlertDialogDemitirColaborador>
        </div>
      </PopoverContent>
    </Popover>
  )
}
