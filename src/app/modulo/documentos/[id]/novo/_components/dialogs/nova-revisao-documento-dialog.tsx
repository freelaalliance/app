import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  NovaRevisaoDocumentoForm,
  type NovaRevisaoDocumentoFormProps,
} from '../forms/nova-revisao-documento-form'

export function NovaRevisaoDocumentoDialog({
  idDocumento,
}: NovaRevisaoDocumentoFormProps) {
  return (
    <DialogContent className="md:max-w-screen-md" >
      <DialogHeader>
        <DialogTitle>Nova revisão do documento</DialogTitle>
        <DialogDescription>
          Selecione o arquivo para fazer o upload da nova revisão do documento.
        </DialogDescription>
      </DialogHeader>
      <NovaRevisaoDocumentoForm idDocumento={idDocumento} />
    </DialogContent>
  )
}
