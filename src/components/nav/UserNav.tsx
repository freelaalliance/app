'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { SenhaUsuarioDialog } from '@/components/dialogs/SenhaUsuarioDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { logout } from '../auth/api/AuthApi'
import { closeSession } from '../auth/api/SessaoUsuario'
import type { UsuarioType } from '../auth/schema/SchemaUsuario'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'

interface UserNavProps {
  usuario: UsuarioType
  carregandoDados: boolean
}

export function UserNav({ usuario, carregandoDados }: UserNavProps) {
  const queryClient = useQueryClient()
  const capturarIniciaisNome = (nomeUsuario: string) => {
    const parts = nomeUsuario.split(' ')
    const initials = parts.map((part: string) =>
      part.substring(0, 1).toUpperCase()
    )
    return initials.join('')
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={carregandoDados}
            variant="ghost"
            className="relative h-10 w-10 rounded-full border-0 p-1"
          >
            {carregandoDados ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Avatar className="size-12 text-primary-foreground shadow-lg">
                <AvatarFallback className='bg-primary'>
                  {capturarIniciaisNome(usuario.nome ?? 'Alliance Sistemas')}
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 border-0 shadow-md"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {usuario.nome ?? 'Alliance Sistemas'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {usuario.email ?? ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DialogTrigger asChild>
              <DropdownMenuItem>Alterar senha</DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await logout()
              await closeSession()
              queryClient.clear()
              localStorage.clear()
            }}
          >
            <span>Encerrar sessão</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SenhaUsuarioDialog id={usuario.id ?? ''} />
    </Dialog>
  )
}
