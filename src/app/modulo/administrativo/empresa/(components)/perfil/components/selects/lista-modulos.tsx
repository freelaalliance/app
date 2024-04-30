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
import { useModulos } from '@/lib/CaseAtom'
import { cn } from '@/lib/utils'

import { ModuloType } from '../../../../schemas/SchemaModulo'

interface ListaModulosProps {
  listaModulos: Array<ModuloType>
  buscandoModulos: boolean
}

export function ListaModulos({
  listaModulos,
  buscandoModulos,
}: ListaModulosProps) {
  const [open, setOpen] = React.useState(false)

  const [moduloSelecionado, selecionarModulo] = useModulos()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={buscandoModulos}
        >
          {listaModulos.length > 0
            ? moduloSelecionado.selected
              ? listaModulos?.find(
                  (modulo) => modulo.id === moduloSelecionado.selected,
                )?.nome
              : 'Selecione um módulo...'
            : 'Módulos não encontrado'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder="Filtrar pelo nome do módulo..." />
          <CommandEmpty>Módulo não encontrado</CommandEmpty>
          <CommandGroup>
            {listaModulos?.map((modulo) => (
              <CommandItem
                key={modulo.id}
                value={modulo.id}
                onSelect={(currentValue) => {
                  selecionarModulo({
                    ...moduloSelecionado,
                    selected:
                      currentValue === moduloSelecionado.selected
                        ? listaModulos[0].id ?? null
                        : currentValue,
                  })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    moduloSelecionado.selected === modulo.id
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
