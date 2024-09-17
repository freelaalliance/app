import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import NovoEmailView from '../../(views)/NovoEmail'

export interface NovoEmailProps {
  idFornecedor: string
}

export function NovoEmailFornecedorDialog({ idFornecedor }: NovoEmailProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Email</DialogTitle>
        <DialogDescription>
          Área para cadastro de novo email do fornecedor
        </DialogDescription>
      </DialogHeader>
      <NovoEmailView idFornecedor={idFornecedor} />
    </DialogContent>
  )
}
