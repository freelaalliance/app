import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormNovaOrdemManutencaoEquipamento,
  type FormNovaOrdemManutencaoEquipamentoProps,
} from '../../forms/(manutencoes)/FormNovaOrdemManutencao'

export function NovaOrdemManutencaoDialog({
  equipamentoId,
}: FormNovaOrdemManutencaoEquipamentoProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{'Nova ordem de manutenção'}</DialogTitle>
      </DialogHeader>
      <FormNovaOrdemManutencaoEquipamento equipamentoId={equipamentoId} />
    </DialogContent>
  )
}
