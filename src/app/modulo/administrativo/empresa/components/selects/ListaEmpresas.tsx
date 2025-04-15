'use client'

import { useQuery } from '@tanstack/react-query'
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
import { useEmpresa } from '@/lib/CaseAtom'
import { cn } from '@/lib/utils'

import { listarEmpresas } from '../../api/Empresa'

export function ListaEmpresas() {
  const { data: dadosEmpresas, isLoading: carregandoDados } = useQuery({
    queryKey: ['empresas'],
    queryFn: listarEmpresas,
    initialData: [],
  })

  const [open, setOpen] = React.useState(false)

  const [empresaSelecionada, selecionarEmpresa] = useEmpresa()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full md:w-56 justify-between"
          disabled={carregandoDados}
        >
          {empresaSelecionada
            ? dadosEmpresas?.find(
              (empresa) => empresa.id === empresaSelecionada.selected,
            )?.nome
            : 'Selecione uma empresa...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder="Filtrar pelo nome da empresa..." />
          <CommandEmpty>Empresa não encontrada</CommandEmpty>
          <CommandGroup>
            {dadosEmpresas?.map((empresa) => (
              <CommandItem
                key={empresa.id}
                value={empresa.id}
                onSelect={(currentValue) => {
                  selecionarEmpresa({
                    ...empresaSelecionada,
                    selected:
                      currentValue === empresaSelecionada.selected
                        ? dadosEmpresas[0].id ?? null
                        : currentValue,
                  })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    empresaSelecionada.selected === empresa.id
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {empresa.nome}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
