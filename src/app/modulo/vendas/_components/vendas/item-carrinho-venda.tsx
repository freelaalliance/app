'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatarValorMoeda } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'
import React from 'react'
import type { ItemCarrinhoType } from '../../_types/venda'

export interface ItemCarrinhoVendaProps {
  item: ItemCarrinhoType
  removerItem: (id: string) => void
  atualizarQuantidade: (id: string, quantidade: number) => void
}

export function ItemCarrinhoVenda({
  item,
  removerItem,
  atualizarQuantidade,
}: ItemCarrinhoVendaProps) {
  const [quantidadeItem, setQuantidadeItem] = React.useState<number>(item.quantidade)

  return (
    <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-medium text-sm">{item.nome}</h4>
          <p className="text-green-600 font-semibold">{formatarValorMoeda(item.preco)}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => removerItem(item.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2 w-full">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <Input
          type="number"
          value={quantidadeItem}
          onChange={(e) => {
            const novaQuantidade = Number(e.target.value)
            setQuantidadeItem(novaQuantidade)

            if (Number.isNaN(novaQuantidade) || novaQuantidade === 0) {
              return
            }

            if (novaQuantidade >= 1) {
              atualizarQuantidade(item.id, Number(novaQuantidade))
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
