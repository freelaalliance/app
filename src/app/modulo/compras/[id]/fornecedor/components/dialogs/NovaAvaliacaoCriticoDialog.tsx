import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface NovaAvaliacaoCriticoProps {
  idFornecedor: string
}

const AvalicaoFornecedorCritico = dynamic(
  () => import('../../(views)/NovaAvaliacao'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

export function NovaAvaliacaoCriticoDialog({
  idFornecedor,
}: NovaAvaliacaoCriticoProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova avaliação</DialogTitle>
        <DialogDescription>
          Adicionar uma nova avaliação para o fornecedor
        </DialogDescription>
      </DialogHeader>
      <AvalicaoFornecedorCritico idFornecedor={idFornecedor} />
    </DialogContent>
  )
}
