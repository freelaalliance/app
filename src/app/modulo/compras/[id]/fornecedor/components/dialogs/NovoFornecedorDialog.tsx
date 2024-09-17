import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const FormularioCadastroFornecedor = dynamic(
  () => import('../../(views)/CadastroFornecedor'),
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

export function NovoFornecedorDialog() {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-5xl">
      <DialogHeader>
        <DialogTitle>Novo Fornecedor</DialogTitle>
        <DialogDescription>
          Área para cadastro de novos fornecedores para pedidos
        </DialogDescription>
      </DialogHeader>
      <FormularioCadastroFornecedor />
    </DialogContent>
  )
}
