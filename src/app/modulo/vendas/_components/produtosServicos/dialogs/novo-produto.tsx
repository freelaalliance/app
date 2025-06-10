import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormularioProdutoServico } from "../forms/produto-servico-form";

export function NovoProdutoServicoDialog() {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-auto">
      <DialogHeader>
        <DialogTitle>Novo Produto/Serviço</DialogTitle>
        <DialogDescription>
          Área para cadastro de novos produtos ou serviços
        </DialogDescription>
      </DialogHeader>
      <FormularioProdutoServico />
    </DialogContent>
  )
}