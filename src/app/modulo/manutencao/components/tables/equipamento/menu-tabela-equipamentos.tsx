'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DadosEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { AgendaEquipamentoDialog } from "../../dialogs/(equipamento)/AgendaEquipamentoDialog";
import { EdicaoEquipamentoDialog } from "../../dialogs/(equipamento)/EdicaoEquipamentoDialog";
import { ExclusaoEquipamentoDialog } from "../../dialogs/(equipamento)/ExclusaoEquipamentoDialog";
import { NovaPecaEquipamentoDialog } from "../../dialogs/(equipamento)/NovaPecaEquipamentoDialog";
import { PecasEquipamentoDialog } from "../../dialogs/(equipamento)/PecasEquipamentoDialog";

interface MenuTabelaEquipamentoProps {
  row: DadosEquipamentoType
}

export function MenuTabelaEquipamento({ row }: MenuTabelaEquipamentoProps) {
  let idModulo = null

  if (typeof window !== 'undefined') {
    idModulo = localStorage.getItem('modulo')
  }

  return (
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
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Editar equipamento
            </DropdownMenuItem>
          </DialogTrigger>
          <EdicaoEquipamentoDialog
            id={row.id}
            codigo={row.codigo}
            especificacao={row.especificacao}
            frequencia={row.frequencia}
            nome={row.nome}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Excluir equipamento
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExclusaoEquipamentoDialog id={row.id} />
        </AlertDialog>
        
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Visualizar itens
            </DropdownMenuItem>
          </DialogTrigger>
          <PecasEquipamentoDialog idEquipamento={row.id} />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              Adicionar Item
            </DropdownMenuItem>
          </DialogTrigger>
          <NovaPecaEquipamentoDialog idEquipamento={row.id} />
        </Dialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`${idModulo}/equipamento?id=${row.id}&nome=${row.nome}`}>Preventivas e corretivas</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}