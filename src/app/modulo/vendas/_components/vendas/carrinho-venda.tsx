import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatarValorMoeda } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'
import type { ItemCarrinhoType } from '../../_types/venda'
import { FinalizarVendaClienteDialog } from './dialogs/finalizar-venda-cliente'
import {
  ItemCarrinhoVenda,
  type ItemCarrinhoVendaProps,
} from './item-carrinho-venda'

interface CarrinhoVendaProps extends Omit<ItemCarrinhoVendaProps, 'item'> {
  itens: Array<ItemCarrinhoType>
  idCliente: string
  limparItensCarrinho: () => void
}

export function CarrinhoVenda({
  itens,
  removerItem,
  atualizarQuantidade,
  idCliente,
  limparItensCarrinho
}: CarrinhoVendaProps) {
  const getTotalItems = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0)
  }

  const getValorTotal = () => {
    return itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    )
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
        <CardTitle className="flex flex-row items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Carrinho
          {getTotalItems() > 0 && (
            <Badge variant="secondary">{getTotalItems()}</Badge>
          )}
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-auto mt-4" disabled={itens.length === 0}>
              Finalizar
            </Button>
          </DialogTrigger>
          <FinalizarVendaClienteDialog
            itens={itens}
            idCliente={idCliente}
            vendaRealizada={limparItensCarrinho}
          />
        </Dialog>
      </CardHeader>
      <CardContent className='space-y-4'>
        {itens.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Seu carrinho está vazio
          </p>
        ) : (
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
              {itens.map(item => (
                <ItemCarrinhoVenda
                  key={item.id}
                  item={item}
                  removerItem={removerItem}
                  atualizarQuantidade={atualizarQuantidade}
                />
              ))}
            </div>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-green-600">
            {formatarValorMoeda(getValorTotal())}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
