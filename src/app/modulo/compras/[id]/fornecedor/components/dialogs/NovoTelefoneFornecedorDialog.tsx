import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface NovoTelefoneProps {
  idFornecedor: string
}

const ViewNovoTelefone = dynamic(() => import('../../(views)/NovoTelefone'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export function NovoTelefoneFornecedorDialog({
  idFornecedor,
}: NovoTelefoneProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Telefone</DialogTitle>
        <DialogDescription>
          Área para cadastro de novos telefones do telefone
        </DialogDescription>
      </DialogHeader>
      <ViewNovoTelefone idFornecedor={idFornecedor} />
    </DialogContent>
  )
}
