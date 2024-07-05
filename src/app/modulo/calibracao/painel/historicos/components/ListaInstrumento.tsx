import { ChevronRight, Smartphone } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useInstrumento } from '@/lib/CaseAtom'

import { CalibracoesInstrumentosEmpresaType } from '../../../listar/api/Calibracao'

interface ListaInstrumentosCalibradosPropsInterface {
  instrumentos: CalibracoesInstrumentosEmpresaType
}

export function ListaInstrumento({
  instrumentos,
}: ListaInstrumentosCalibradosPropsInterface) {
  const [instrumentoSelecionado, selecionarInstrumento] = useInstrumento()
  const instrumentosCarregados: Array<string> = []

  return (
    <ScrollArea className="flex flex-col items-center justify-center w-full mx-auto max-h-screen">
      <ul className="flex flex-col">
        {instrumentos.length > 0 &&
          instrumentos.map(({ instrumento }) => {
            if (!instrumentosCarregados.includes(instrumento.id)) {
              instrumentosCarregados.push(instrumento.id)

              return (
                <li
                  key={instrumento.id}
                  className="flex flex-row mb-2 border-gray-400"
                >
                  <div className="transition duration-500 shadow ease-in-out transform hover:-translate-y-1 hover:shadow-lg select-none bg-white dark:bg-gray-800 rounded-md flex-1 items-center p-4">
                    <div className="flex flex-col items-center justify-center w-10 h-10 mr-4">
                      <div className="relative block">
                        <Smartphone />
                      </div>
                    </div>
                    <div className="flex-1 pl-1 md:mr-16">
                      <div className="font-medium dark:text-white capitalize">
                        {instrumento.codigo}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-200">
                        {instrumento.nome}
                      </div>
                    </div>
                    <button
                      className="flex justify-end w-auto text-right"
                      onClick={() => {
                        selecionarInstrumento({
                          ...instrumentoSelecionado,
                          selected: instrumento.id,
                        })
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </li>
              )
            } else {
              return <></>
            }
          })}
      </ul>
    </ScrollArea>
  )
}
