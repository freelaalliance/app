import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PropsFormularioEdicaoInterface, FormaularioEdicaoCalibracao } from '../../forms/(calibracoes)/FormularioEdicaoCalibracao'

export function EdicaoCalibracaoDialog({
  idCalibracao,
}: PropsFormularioEdicaoInterface) {
  return (
    <DialogContent className="h-screen md:h-auto max-w-[48rem] overflow-x-auto">
      <DialogHeader>
        <DialogTitle>Dados da calibração</DialogTitle>
        <DialogDescription>
          Atualize os dados da calibração do instrumento
        </DialogDescription>
      </DialogHeader>
      <FormaularioEdicaoCalibracao idCalibracao={idCalibracao} />
    </DialogContent>
  )
}
