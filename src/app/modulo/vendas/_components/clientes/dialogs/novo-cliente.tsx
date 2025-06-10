import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormualarioCliente } from "../form/clientes-form";

export function NovoClienteDialog() {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-auto">
      <DialogHeader>
        <DialogTitle>Novo Cliente</DialogTitle>
        <DialogDescription>
          Área para cadastro de novos clientes
        </DialogDescription>
      </DialogHeader>
      <FormualarioCliente />
    </DialogContent>
  )
}