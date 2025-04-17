import { FileX } from 'lucide-react'

import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface listaArquivoProps {
  listaArquivoSelecionado: Array<File>
  excluiArquivo: (index: number) => void
}

export function ListaArquivo({
  listaArquivoSelecionado,
  excluiArquivo,
}: listaArquivoProps) {
  return (
    <div className="flex flex-row gap-2 overflow-auto">
      {listaArquivoSelecionado.map((arquivo, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="flex flex-row justify-between items-center md:justify-normal gap-2 rounded border shadow"
        >
          <Button
            variant="outline"
            size="icon"
            className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            onClick={() => excluiArquivo(index)}
          >
            <FileX color="#fff" />
          </Button>
          <Tooltip>
            <TooltipTrigger>
              <p className="truncate text-sm font-semibold text-left bg-white px-3 py-1 md:text-base w-24">
                {arquivo.name}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{arquivo.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}
