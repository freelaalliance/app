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
import { formatarDataBrasil } from '@/lib/utils'

import {
  CalibracoesInstrumentosEmpresaType,
  excluirCalibracao,
} from '../../api/Calibracao'

interface PropsDialogExclusaoInterface {
  idCalibracao: string
  nomeInstrumento: string
  dataCalibracao: Date
}

export function ExclusaoCalibracaoDialog({
  idCalibracao,
  nomeInstrumento,
  dataCalibracao,
}: PropsDialogExclusaoInterface) {
  const queryClient = useQueryClient()

  const { mutateAsync: excluirCalibracaoFn, isPending } = useMutation({
    mutationFn: excluirCalibracao,
    onMutate(idCalibracao: string) {
      const { cacheCalibracoes } = atualizarCacheCalibracoes(idCalibracao)

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

  function atualizarCacheCalibracoes(idCalibracao: string) {
    const cacheCalibracoes: CalibracoesInstrumentosEmpresaType | undefined =
      queryClient.getQueryData(['listaCalibracoes'])

    queryClient.setQueryData(
      ['listaCalibracoes'],
      cacheCalibracoes?.filter(
        (dadosCalibracao) => dadosCalibracao.calibracao.id !== idCalibracao,
      ),
    )

    return { cacheCalibracoes }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirma esta ação?</AlertDialogTitle>
        <AlertDialogDescription>
          {'Deseja realmente excluir a calibração do instrumento ' +
            nomeInstrumento +
            ' realizado em ' +
            formatarDataBrasil(dataCalibracao)}
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
              await excluirCalibracaoFn(idCalibracao)
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
