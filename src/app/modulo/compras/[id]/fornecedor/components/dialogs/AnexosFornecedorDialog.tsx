import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListaAnexosFornecedor } from "../lista-anexos-fornecedor";
import { useQuery } from "@tanstack/react-query";
import { consultarAnexosFornecedor } from "../../(api)/FornecedorApi";

export function DialogAnexosFornecedor({ idFornecedor }: { idFornecedor: string }) {

  const consultarAnexosFornecedores = useQuery({
    queryKey: ['anexosFornecedor', idFornecedor],
    queryFn: () => consultarAnexosFornecedor({ id: idFornecedor }),
    initialData: {
      dados: [],
      status: false,
      msg: '',
      erro: null
    },
  })

  return (
    <DialogContent className="overflow-auto max-h-screen max-w-5xl">
      <DialogHeader>
        <DialogTitle>Anexos do fornecedor</DialogTitle>
        <DialogDescription>
          Aqui estão os anexos relacionados ao fornecedor.
        </DialogDescription>
      </DialogHeader>
      <ListaAnexosFornecedor
        listarAnexos={consultarAnexosFornecedores.data}
        isLoading={consultarAnexosFornecedores.isLoading}
        idFornecedor={idFornecedor}
      />
    </DialogContent>
  )
}