import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EnderecoType } from '../forms/EdicaoEndereco'

export interface EdicaoEnderecoProps {
  idPessoa: string
  endereco: EnderecoType,
  enderecoAtualizado: () => void
}

const EdicaoEndereco = dynamic(
  () => import('@/components/forms/EdicaoEndereco'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  }
)

export function EdicaoEnderecoDialog({
  idPessoa,
  endereco,
  enderecoAtualizado
}: EdicaoEnderecoProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modificar endereço</DialogTitle>
        <DialogDescription>
          Atualize os dados do endereço para evitar erros
        </DialogDescription>
      </DialogHeader>
      <EdicaoEndereco
        idPessoa={idPessoa}
        endereco={endereco}
        enderecoAtualizado={enderecoAtualizado}
      />
    </DialogContent>
  )
}
