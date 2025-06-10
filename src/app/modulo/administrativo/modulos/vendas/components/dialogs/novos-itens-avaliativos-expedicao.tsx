import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CadastroItensAvaliativoExpedicaoForm,
  type CadastroItensAvaliativoExpedicaoFormProps,
} from '../forms/cadastro-itens-avaliativos-expedicao'
export function CadastraItensAvaliativosExpedicaoDialog({
  empresaId,
}: CadastroItensAvaliativoExpedicaoFormProps) {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-5xl">
      <DialogHeader>
        <DialogTitle>Cadastra itens avaliativos</DialogTitle>
        <DialogDescription>
          Crie e vincule novas regras avaliativas de expedição de vendas
        </DialogDescription>
      </DialogHeader>
      <CadastroItensAvaliativoExpedicaoForm empresaId={empresaId} />
    </DialogContent>
  )
}
