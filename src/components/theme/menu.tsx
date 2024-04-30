'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function MenuTema() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="border-0 rounded-full" variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-0 shadow-md" align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Dia
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Noite
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          Padrão do sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
