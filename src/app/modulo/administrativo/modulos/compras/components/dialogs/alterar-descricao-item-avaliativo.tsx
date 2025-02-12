import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AtualizacaoItemAvaliativoRecebimentoForm,
  type AtualizacaoItemAvaliativoRecebimentoFormProps,
} from '../forms/atualizacao-item-avaliativo-recebimento'

export function AlterarDescricaoItemAvaliativoDialog({
  id,
  descricao,
}: AtualizacaoItemAvaliativoRecebimentoFormProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edição do item</DialogTitle>
        <DialogDescription>
          Alterar a descrição do item avaliativo de recebimento
        </DialogDescription>
      </DialogHeader>
      <AtualizacaoItemAvaliativoRecebimentoForm id={id} descricao={descricao} />
    </DialogContent>
  )
}
