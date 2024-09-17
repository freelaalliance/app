'use client'

import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

const VisualizarDadosFornecedor = dynamic(
  () => import('../(views)/VisualizarDadosFornecedores'),
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

export default function PageVisualizarFornecedor() {
  const searchParams = useSearchParams()

  const idFornecedor = searchParams.get('id')

  return (
    <section className="space-y-2">
      <VisualizarDadosFornecedor idFornecedor={idFornecedor ?? ''} />
    </section>
  )
}
