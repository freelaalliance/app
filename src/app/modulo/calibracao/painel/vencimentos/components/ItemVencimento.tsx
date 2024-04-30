import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { cn, formatarDataBrasil } from '@/lib/utils'

import { DetalhesInstrumentoDialog } from '../../components/historico_instrumento/DetalhesInstrumentoDialog'

interface itemVencimentoProps {
  className?: string
  instrumento: string
  codigoInstrumento: string
  nomeInstrumento: string
  agendadoPara: Date
}

export function ItemVencimento({
  className,
  instrumento,
  codigoInstrumento,
  nomeInstrumento,
  agendadoPara,
}: itemVencimentoProps) {
  return (
    <li
      className={cn(
        'flex justify-between space-x-6 p-4 transition duration-500 shadow ease-in-out transform hover:-translate-y-1 hover:shadow-lg select-none',
        className,
      )}
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="font-medium text-sm capitalize md:text-md lg:text-lg">
            {`${codigoInstrumento} - ${nomeInstrumento}`}
          </p>
          <p className="font-medium text-sm md:text-md lg:text-lg">
            {`Vencimento: ${formatarDataBrasil(new Date(agendadoPara))}`}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-slate-50 hover:bg-slate-50 shadow-md hover:transition-colors delay-150 absolute flex items-center justify-center h-10 w-10 rounded-full p-1">
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </Button>
          </DialogTrigger>
          <DetalhesInstrumentoDialog idInstrumento={instrumento} />
        </Dialog>
      </div>
    </li>
  )
}
