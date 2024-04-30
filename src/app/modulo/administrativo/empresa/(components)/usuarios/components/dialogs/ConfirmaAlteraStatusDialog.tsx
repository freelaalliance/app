import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useEmpresa } from '@/lib/CaseAtom'

import { alterarStatusUsuario } from '../../../../api/Usuario'
import { UsuarioType } from '../../../../schemas/SchemaUsuarios'

interface AlteracaoStatusUsuarioDialogProps {
  idUsuario: string
  statusUsuario: boolean
}

export function ConfirmaAlteracaoStatusUsuarioDialog({
  idUsuario,
  statusUsuario,
}: AlteracaoStatusUsuarioDialogProps) {
  const queryClient = useQueryClient()
  const [empresaSelecionada] = useEmpresa()

  const { mutateAsync: alterarStatus, isPending } = useMutation({
    mutationFn: ({
      idUsuario,
      status,
    }: {
      idUsuario: string
      status: boolean
    }) => alterarStatusUsuario(idUsuario, status),
    onMutate() {
      const { listaUsuariosEmpresa } = atualizaDadosUsuariosEmpresa(idUsuario)

      return { listaAntigaUsuarioEmpresa: listaUsuariosEmpresa }
    },
    onError(_, __, context) {
      if (context?.listaAntigaUsuarioEmpresa) {
        queryClient.setQueryData(
          ['listaUsuariosEmpresa', empresaSelecionada.selected],
          context.listaAntigaUsuarioEmpresa,
        )
      }

      toast.error(
        'Houve um erro ao alterar o status do usuário, tente novamente!',
      )
    },
    onSuccess() {
      toast.success('Status do usuario alterado com sucesso')
    },
  })

  function atualizaDadosUsuariosEmpresa(idUsuario: string) {
    const listaUsuariosEmpresa: Array<UsuarioType> | undefined =
      queryClient.getQueryData([
        'listaUsuariosEmpresa',
        empresaSelecionada.selected,
      ])

    if (listaUsuariosEmpresa) {
      const novaListaUsuariosEmpresa = listaUsuariosEmpresa.map((usuario) => {
        if (usuario.id === idUsuario) {
          return { ...usuario, status: statusUsuario ? 'ativo' : 'desativado' }
        }
        return usuario
      })

      queryClient.setQueryData(
        ['listaUsuariosEmpresa', empresaSelecionada.selected],
        novaListaUsuariosEmpresa,
      )
    } else {
      toast.error('Não foi possivel atualizar a lista de usuário')
    }

    return { listaUsuariosEmpresa }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirma esta ação?</AlertDialogTitle>
        <AlertDialogDescription>
          {`Deseja realmente ${statusUsuario ? 'desativar' : 'ativar'} este usuário?`}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
          Cancelar
        </AlertDialogCancel>
        {isPending ? (
          <Button
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow "
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Alterando...
          </Button>
        ) : (
          <AlertDialogAction
            onClick={async () => {
              await alterarStatus({ idUsuario, status: statusUsuario })
            }}
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow "
          >
            Confirmar
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
