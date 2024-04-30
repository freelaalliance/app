'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useFuncoesModulo } from '@/lib/CaseAtom'
import { cn } from '@/lib/utils'

import { FuncaoModuloType } from '../../../../schemas/SchemaModulo'

interface ListaFuncoesProps {
  listaFuncoes: FuncaoModuloType[]
  buscandoFuncoes: boolean
}

export function ListaFuncoes({
  listaFuncoes,
  buscandoFuncoes,
}: ListaFuncoesProps) {
  const [open, setOpen] = React.useState(false)

  const [funcaoSelecionado, selecionarFuncao] = useFuncoesModulo()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={buscandoFuncoes}
        >
          {listaFuncoes && listaFuncoes.length > 0
            ? funcaoSelecionado.selected
              ? listaFuncoes?.find(
                  (funcao) => funcao.id === funcaoSelecionado.selected,
                )?.nome
              : 'Selecione uma função...'
            : 'Funções não encontrado'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder="Filtrar pelo nome da função..." />
          <CommandEmpty>Função não encontrado</CommandEmpty>
          <CommandGroup>
            {listaFuncoes?.map((modulo) => (
              <CommandItem
                key={modulo.id}
                value={modulo.id}
                onSelect={(currentValue) => {
                  selecionarFuncao({
                    ...funcaoSelecionado,
                    selected:
                      currentValue === funcaoSelecionado.selected
                        ? listaFuncoes[0].id ?? null
                        : currentValue,
                  })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    funcaoSelecionado.selected === modulo.id
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {modulo.nome}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
