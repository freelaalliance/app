'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CarrinhoVenda } from '../../../_components/vendas/carrinho-venda'
import { ProdutosServicosPlaceholder } from '../../../_components/vendas/placeholder/produtos-servicos-placeholder'
import { ProdutoServicoCard } from '../../../_components/vendas/produto-servico-card'
import { useProdutosServicos } from '../../../_servicos/useProdutoServico'
import type { ProdutoServicoType } from '../../../_types/produtoServico'
import type { ItemCarrinhoType } from '../../../_types/venda'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export default function VendaClientePage() {

  const searchParams = useSearchParams()

  const idCliente = searchParams.get('cliente')

  const [cart, setCart] = useState<ItemCarrinhoType[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const produtosServicoEmpresa = useProdutosServicos()

  const adicionarItem = (product: ProdutoServicoType) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantidade: 1 }]
    })
  }

  const updateQuantity = (id: string, novaQuantidade: number) => {
    if (novaQuantidade === 0) {
      removeFromCart(id)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantidade: novaQuantidade } : item
        )
      )
    }
  }

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const filtraProdutoServico = produtosServicoEmpresa.data.filter((produtoServico: ProdutoServicoType) => produtoServico.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <section className="space-y-4">
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-start items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => {
                history.back()
              }}
            >
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para lista de clientes</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid lg:grid-cols-6 gap-4">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className='space-y-4'>
              <CardTitle className="flex items-center gap-2">Produtos/serviços disponíveis</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Filtrar pelo nome do produto ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={produtosServicoEmpresa.isFetching}
                />
              </div>
            </CardHeader>
            <CardContent>
              {produtosServicoEmpresa.isFetching ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <ProdutosServicosPlaceholder key={index} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filtraProdutoServico.map((produto: ProdutoServicoType) => (
                      <ProdutoServicoCard
                        key={produto.id}
                        produto={produto}
                        adicionarAoCarrinho={adicionarItem}
                      />
                    ))}
                  </div>

                  {filtraProdutoServico.length === 0 && !produtosServicoEmpresa.isFetching && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum produto ou serviço encontrado para "{searchTerm}"</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <CarrinhoVenda
            idCliente={idCliente ?? ''}
            itens={cart}
            removerItem={removeFromCart}
            atualizarQuantidade={updateQuantity}
            limparItensCarrinho={() => {
              setCart([])
            }}
          />
        </div>
      </div>
    </section>
  )
}
