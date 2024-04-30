import { FileX } from 'lucide-react'

import { Button } from '../ui/button'

interface listaArquivoProps {
  listaArquivoSelecionado: Array<File>
  excluiArquivo: () => void
}

export function ListaArquivo({
  listaArquivoSelecionado,
  excluiArquivo,
}: listaArquivoProps) {
  return listaArquivoSelecionado.length > 0 ? (
    <div className="flex flex-row justify-between items-center md:justify-normal gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-padrao-red hover:bg-red-800 shadow-md border-0 "
        onClick={excluiArquivo}
      >
        <FileX color="#fff" />
      </Button>
      <span className="text-sm font-semibold text-left bg-white px-3 py-2 rounded-md shadow md:text-base">
        {listaArquivoSelecionado[0].name}
      </span>
    </div>
  ) : (
    <></>
  )
}
