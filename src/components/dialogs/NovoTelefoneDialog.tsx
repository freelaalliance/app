import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface NovoTelefonePessoaProps {
  idPessoa: string
  atualizaTelefone: () => void
}

const ViewNovoTelefone = dynamic(() => import('@/components/forms/NovoTelefone'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export function NovoTelefonePessoaDialog({
  idPessoa,
  atualizaTelefone
}: NovoTelefonePessoaProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Telefone</DialogTitle>
        <DialogDescription>
          Área para cadastro de novos telefones do telefone
        </DialogDescription>
      </DialogHeader>
      <ViewNovoTelefone idPessoa={idPessoa} atualizaTelefone={atualizaTelefone}/>
    </DialogContent>
  )
}
