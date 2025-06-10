import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ProdutoServicoType } from '../../../_types/produtoServico'
import { FormularioProdutoServico } from '../forms/produto-servico-form'

interface EditarProdutoServicoDialogProps {
  produto: ProdutoServicoType
}

export function EdicaoProdutoServicoDialog({
  produto,
}: EditarProdutoServicoDialogProps) {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-auto">
      <DialogHeader>
        <DialogTitle>Editar Produto/Serviço</DialogTitle>
        <DialogDescription>
          Atualize os dados do item selecionado.
        </DialogDescription>
      </DialogHeader>
      <FormularioProdutoServico id={produto.id} defaultValues={produto} />
    </DialogContent>
  )
}
