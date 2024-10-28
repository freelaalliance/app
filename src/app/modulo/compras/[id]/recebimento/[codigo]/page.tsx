'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'

import { listarPermissoesModuloPerfil } from '@/app/modulo/administrativo/empresa/api/Permissao'
import { Button } from '@/components/ui/button'

const VerficacaoPedido = dynamic(
  () => import('../../recebimento/(view)/VerificacaoEntregaPedido'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

export default function ConferenciaRecebimentoPedido() {
  const router = useRouter()
  const { codigo } = useParams<{ codigo: string }>()
  let idModulo = null

  if (typeof window !== 'undefined') {
    idModulo = localStorage.getItem('modulo')
  }

  const { data: listaPermissoesPerfil, isLoading: carregandoPermissoes } =
    useQuery({
      queryKey: ['permissoesModulosPerfil', idModulo],
      queryFn: () => listarPermissoesModuloPerfil(idModulo),
      staleTime: Infinity,
    })

  const consultaExistePermissao =
    listaPermissoesPerfil &&
    listaPermissoesPerfil.find(
      (permissao) => permissao.url === '/modulo/compras/[id]/recebimento',
    )

  return !carregandoPermissoes ? (
    !consultaExistePermissao ? (
      <div className="flex flex-col justify-center items-center h-full py-4 space-y-4">
        <p className="text-center text-gray-600">
          O seu perfil não tem permissão para acessar esta área
        </p>

        <Button
          onClick={() => {
            router.back()
          }}
          size={'default'}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded gap-2"
        >
          <ArrowLeft className="size-5" />
          Retornar
        </Button>
      </div>
    ) : (
      <VerficacaoPedido codigoPedido={codigo} />
    )
  ) : (
    <div className="flex flex-col justify-center items-center h-full py-4 space-y-4">
      <p className="text-center text-gray-600">Verificando permissões...</p>
    </div>
  )
}
