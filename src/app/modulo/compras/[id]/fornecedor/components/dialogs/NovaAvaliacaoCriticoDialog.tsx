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

const HomologacaoFornecedorCritico = dynamic(
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
        <DialogTitle>Nova homologação</DialogTitle>
        <DialogDescription>
          Adicionar uma nova homologação para o fornecedor
        </DialogDescription>
      </DialogHeader>
      <HomologacaoFornecedorCritico idFornecedor={idFornecedor} />
    </DialogContent>
  )
}
