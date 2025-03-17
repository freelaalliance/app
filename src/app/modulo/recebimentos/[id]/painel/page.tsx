import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const VisualizarDadosRecebimento = dynamic(
  () => import('./_views/RecebimentosView'),
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

export default function PagePainelRecebimentos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Painel</CardTitle>
        <CardDescription>
          Visualize as estatísticas de todos os recebimentos realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VisualizarDadosRecebimento />
      </CardContent>
    </Card>
  )
}