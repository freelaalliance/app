import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NovaCalibracaoForm } from "../../forms/(calibracoes)/FormularioNovaCalibracao";

export function NovaCalibracaoDialog() {
  return (
    <DialogContent className="h-screen md:h-full max-w-5xl overflow-x-auto">
      <DialogHeader>
        <DialogTitle>Nova Calibração</DialogTitle>
        <DialogDescription>Área para inserção de nova calibração</DialogDescription>
      </DialogHeader>
      <NovaCalibracaoForm />
    </DialogContent>
  )
}