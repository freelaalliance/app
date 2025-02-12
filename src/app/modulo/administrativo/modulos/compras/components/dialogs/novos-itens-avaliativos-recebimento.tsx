import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CadastroItensAvaliativoRecebimentoForm,
  type CadastroItensAvaliativoRecebimentoFormProps,
} from '../forms/cadastro-itens-avaliativos-recebimento'

export function CadastraItensAvaliativosRecebimentoDialog({
  empresaId,
}: CadastroItensAvaliativoRecebimentoFormProps) {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-5xl">
      <DialogHeader>
        <DialogTitle>Cadastra Itens Avaliativos</DialogTitle>
        <DialogDescription>
          Crie e vincule novas regras avaliativas de recebimento de pedidos
        </DialogDescription>
      </DialogHeader>
      <CadastroItensAvaliativoRecebimentoForm empresaId={empresaId} />
    </DialogContent>
  )
}
