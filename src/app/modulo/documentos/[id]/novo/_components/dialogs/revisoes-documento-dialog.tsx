import type { RevisoesDocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { TabelaRevisoesDocumento } from '../tables/revisoes/revisoes-documento'

export interface TabelaRevisoesDocumentoProps {
  revisoes: Array<RevisoesDocumentoType>
}

export function RevisoesDocumentoDialog({ revisoes }: TabelaRevisoesDocumentoProps) {
  return (
    <DialogContent className='md:max-w-screen-md'>
      <DialogHeader>
        <DialogTitle>Histórico de revisões do documento</DialogTitle>
        <DialogDescription>{`Total de ${revisoes.length} ${revisoes.length <= 1 ? 'revisão' : 'revisões'}`}</DialogDescription>
      </DialogHeader>
      <TabelaRevisoesDocumento revisoes={revisoes} />
    </DialogContent>
  )
}
