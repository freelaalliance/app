import type { DocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { DialogTitle } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { TabelaRevisoesDocumento } from '../tables/revisoes/revisoes-documento'

interface DadosDocumentoDialogProps {
  documento: DocumentoType
}

export function DadosDocumentoDialog({ documento }: DadosDocumentoDialogProps) {
  return (
    <DialogContent className='md:max-w-screen-md'>
      <DialogHeader>
        <DialogTitle>{`Detalhes do documento ${documento.nome}`}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
          <p className="mt-1">{documento.descricaoDocumento}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cópias</h3>
            <p className="mt-1">{documento.copias}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Retenção</h3>
            <p className="mt-1 flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(documento.retencao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recuperação</h3>
            <p className="mt-1">{documento.recuperacao}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Elegibilidade</h3>
            <p className="mt-1">{documento.elegibilidade}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Disposição</h3>
            <p className="mt-1">{documento.disposicao}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Uso</h3>
            <p className="mt-1">{documento.uso}</p>
          </div>
        </div>
      </div>
      <Separator/>
      <TabelaRevisoesDocumento revisoes={documento.revisoes} />
    </DialogContent>
  )
}
