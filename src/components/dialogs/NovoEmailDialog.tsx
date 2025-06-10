import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const ViewNovoEmail = dynamic(() => import('@/components/forms/NovoEmail'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export interface NovoEmailPessoaProps {
  idPessoa: string
  emailAtualizado: () => void
}

export function NovoEmailPessoaDialog({ idPessoa, emailAtualizado }: NovoEmailPessoaProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Email</DialogTitle>
        <DialogDescription>
          Área para cadastro de novo email
        </DialogDescription>
      </DialogHeader>
      <ViewNovoEmail idPessoa={idPessoa} emailAtualizado={emailAtualizado}/>
    </DialogContent>
  )
}
