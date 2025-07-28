import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Edit, Eye, MoreVertical, UserX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { AlertDialogDemitirColaborador } from '../../dialogs/colaborador/AlertDialogDemitirColaborador'
import { DialogEditarColaborador } from '../../dialogs/colaborador/DialogEditarColaborador'

interface MenuTabelaColaboradoresProps {
  dadosColaborador: Contratacao
}

export function MenuTabelaColaboradores({
  dadosColaborador,
}: MenuTabelaColaboradoresProps) {
  const router = useRouter()

  const handleVisualizarColaborador = () => {
    router.push(`colaboradores/visualizar/${dadosColaborador.id}`)
  }

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
          <DropdownMenuItem onSelect={handleVisualizarColaborador}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </DropdownMenuItem>
          <DialogEditarColaborador contratacao={dadosColaborador}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </DialogEditarColaborador>
          {!dadosColaborador.demitidoEm && (
            <AlertDialogDemitirColaborador contratacao={dadosColaborador}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <UserX className="mr-2 h-4 w-4" />
                Demitir
              </DropdownMenuItem>
            </AlertDialogDemitirColaborador>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
