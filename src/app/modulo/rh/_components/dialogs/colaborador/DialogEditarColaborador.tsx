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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { FormularioEditarColaborador } from '../../forms/colaborador/FormularioEditarColaborador'

interface DialogEditarColaboradorProps {
  contratacao: Contratacao
  children?: React.ReactNode
}

export function DialogEditarColaborador({
  contratacao,
  children,
}: DialogEditarColaboradorProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Dados do Colaborador</DialogTitle>
          <DialogDescription>
            Altere as informações pessoais do colaborador{' '}
            {contratacao.colaborador.pessoa.nome}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <FormularioEditarColaborador
            contratacao={contratacao}
            onSuccess={handleSuccess}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
