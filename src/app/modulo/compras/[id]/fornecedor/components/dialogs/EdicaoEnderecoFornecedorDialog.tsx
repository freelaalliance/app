import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import { EnderecoFornecedorType } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface EdicaoEnderecoFornecedorProps {
  idFornecedor: string
  endereco: EnderecoFornecedorType
}

const EdicaoEnderecoFornecedor = dynamic(
  () => import('../../(views)/EdicaoEnderecoFornecedor'),
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

export function EdicaoEnderecoFornecedorDialog({
  idFornecedor,
  endereco,
}: EdicaoEnderecoFornecedorProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modificar endereço do fornecedor</DialogTitle>
        <DialogDescription>
          Atualize os dados do endereço do fornecedor para evitar erros
        </DialogDescription>
      </DialogHeader>
      <EdicaoEnderecoFornecedor
        idFornecedor={idFornecedor}
        endereco={endereco}
      />
    </DialogContent>
  )
}
