import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, List, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'
import { AlertExcluirTreinamento } from '../../alerts/treinamentos/AlertExcluirTreinamento'
import { DialogListarPlanos } from '../../dialogs/treinamentos/DialogListarPlanos'
import { FormularioAdicionarPlano } from '../../forms/treinamentos/FormularioAdicionarPlano'
import { FormularioEditarTreinamento } from '../../forms/treinamentos/FormularioEditarTreinamento'

interface MenuTabelaTreinamentosProps {
  dadosTreinamento: TreinamentosType
}

export function MenuTabelaTreinamentos({
  dadosTreinamento,
}: MenuTabelaTreinamentosProps) {
  const [editarOpen, setEditarOpen] = useState(false)
  const [adicionarPlanoOpen, setAdicionarPlanoOpen] = useState(false)
  const [listarPlanosOpen, setListarPlanosOpen] = useState(false)
  const [excluirOpen, setExcluirOpen] = useState(false)

  const handleEdit = () => {
    setEditarOpen(true)
  }

  const handleAddPlan = () => {
    setAdicionarPlanoOpen(true)
  }

  const handleListPlans = () => {
    setListarPlanosOpen(true)
  }

  const handleDelete = () => {
    setExcluirOpen(true)
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
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleListPlans}>
            <List className="mr-2 h-4 w-4" />
            Listar Planos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddPlan}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Plano
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormularioEditarTreinamento
        treinamento={dadosTreinamento}
        open={editarOpen}
        onOpenChange={setEditarOpen}
      />

      <FormularioAdicionarPlano
        treinamento={dadosTreinamento}
        open={adicionarPlanoOpen}
        onOpenChange={setAdicionarPlanoOpen}
      />

      <DialogListarPlanos
        treinamento={dadosTreinamento}
        open={listarPlanosOpen}
        onOpenChange={setListarPlanosOpen}
      />

      <AlertExcluirTreinamento
        treinamento={dadosTreinamento}
        open={excluirOpen}
        onOpenChange={setExcluirOpen}
      />
    </>
  )
}
