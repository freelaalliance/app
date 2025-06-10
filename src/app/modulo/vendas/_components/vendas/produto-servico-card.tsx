import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import type { ProdutoServicoType } from '../../_types/produtoServico'
import { formatarValorMoeda } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProdutoServicoCardProps {
  produto: ProdutoServicoType
  adicionarAoCarrinho: (produto: ProdutoServicoType) => void
}

export function ProdutoServicoCard({
  produto,
  adicionarAoCarrinho,
}: ProdutoServicoCardProps) {
  return (
    <Card key={produto.id} className="hover:shadow-lg transition-shadow w-full">
      <CardHeader>
        <CardTitle>{produto.nome}</CardTitle>
        <CardDescription>{produto.descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            {formatarValorMoeda(produto.preco)}
          </span>
        </div>
      </CardContent>
      <CardFooter className='flex-1 justify-end'>
        <Button onClick={() => adicionarAoCarrinho(produto)} className='bg-sky-600 hover:bg-sky-700 w-full'>
          <Plus className="w-4 h-4 mr-1 text-white" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  )
}
