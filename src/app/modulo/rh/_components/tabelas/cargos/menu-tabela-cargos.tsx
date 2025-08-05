import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, Eye, FileDown, List, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { Margin, Resolution, usePDF } from 'react-to-pdf'
import { toast } from 'sonner'
import { useTreinamentosCargo } from '../../../_hooks/cargos/useCargos'
import type { Cargo } from '../../../_types/cargos/CargoType'
import { AlertExcluirCargo } from '../../alerts/cargos/AlertExcluirCargo'
import { CargoPDF } from '../../cargos/CargoPDF'
import { DialogListarTreinamentosCargo } from '../../dialogs/cargos/DialogListarTreinamentosCargo'
import { DialogVisualizarCargo } from '../../dialogs/cargos/DialogVisualizarCargo'
import { FormularioAdicionarTreinamentoCargo } from '../../forms/cargos/FormularioAdicionarTreinamentoCargo'
import { FormularioEditarCargo } from '../../forms/cargos/FormularioEditarCargo'
import Link from 'next/link'

interface MenuTabelaCargosProps {
  dadosCargo: Cargo
}

export function MenuTabelaCargos({
  dadosCargo,
}: MenuTabelaCargosProps) {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreVertical className="size-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem asChild>
            <Link href={`cargos/pdf?id=${dadosCargo.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <FormularioEditarCargo cargo={dadosCargo}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </FormularioEditarCargo>
          <DialogListarTreinamentosCargo cargo={dadosCargo}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <List className="mr-2 h-4 w-4" />
              Listar Treinamentos
            </DropdownMenuItem>
          </DialogListarTreinamentosCargo>
          <FormularioAdicionarTreinamentoCargo cargo={dadosCargo}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Treinamento
            </DropdownMenuItem>
          </FormularioAdicionarTreinamentoCargo>
          <DropdownMenuSeparator />
          <AlertExcluirCargo cargo={dadosCargo}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </AlertExcluirCargo>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
