import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AtualizacaoItemAvaliativoExpedicaoForm,
  type AtualizacaoItemAvaliativoExpedicaoFormProps,
} from '../forms/atualizacao-item-avaliativo-expedicao'

export function AlterarDescricaoItemAvaliativoExpedicaoDialog({
  id,
  pergunta,
}: AtualizacaoItemAvaliativoExpedicaoFormProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edição do item</DialogTitle>
        <DialogDescription>
          Alterar a descrição do item avaliativo de expedição
        </DialogDescription>
      </DialogHeader>
      <AtualizacaoItemAvaliativoExpedicaoForm id={id} pergunta={pergunta} />
    </DialogContent>
  )
}
