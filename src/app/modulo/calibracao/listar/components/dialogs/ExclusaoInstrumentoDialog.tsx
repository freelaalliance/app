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

import {
  CalibracoesInstrumentosEmpresaType,
  excluirInstrumento,
} from '../../api/Calibracao'

interface PropsDialogExclusaoInterface {
  idInstrumento: string
  nomeInstrumento: string
}

export function ExclusaoInstrumentoDialog({
  idInstrumento,
  nomeInstrumento,
}: PropsDialogExclusaoInterface) {
  const queryClient = useQueryClient()

  const { mutateAsync: excluirInstrumentoFn, isPending } = useMutation({
    mutationFn: excluirInstrumento,
    onMutate(idInstrumento: string) {
      const { cacheCalibracoes } = atualizarCacheCalibracoes(idInstrumento)

      return { listaAntigaCalibracoes: cacheCalibracoes }
    },
    onError(_, __, context) {
      if (context?.listaAntigaCalibracoes) {
        queryClient.setQueryData(
          ['listaCalibracoes'],
          context.listaAntigaCalibracoes,
        )
      }

      toast.error('Falha ao excluir instrumento, tente novamente!')
    },
    onSuccess() {
      toast.success('Instrumento excluído com sucesso!')
    },
  })

  function atualizarCacheCalibracoes(idInstrumento: string) {
    const cacheCalibracoes: CalibracoesInstrumentosEmpresaType | undefined =
      queryClient.getQueryData(['listaCalibracoes'])

    queryClient.setQueryData(
      ['listaCalibracoes'],
      cacheCalibracoes?.filter(
        (dadosCalibracao) => dadosCalibracao.instrumento.id !== idInstrumento,
      ),
    )

    return { cacheCalibracoes }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirma esta ação?</AlertDialogTitle>
        <AlertDialogDescription>
          {'Deseja realmente excluir o instrumento ' + nomeInstrumento}
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
            Excluindo...
          </Button>
        ) : (
          <AlertDialogAction
            onClick={async () => {
              await excluirInstrumentoFn(idInstrumento)
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
