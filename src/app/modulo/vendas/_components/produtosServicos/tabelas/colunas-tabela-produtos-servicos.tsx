import { formatPrice } from '@/lib/NumeroUtils'
import type { ColumnDef } from '@tanstack/react-table'
import type { ProdutoServicoType } from '../../../_types/produtoServico'
import { MenuTabelaProdutoServico } from './menu-tabela-produto-servico'

export const colunasTabelaProdutosServicos: ColumnDef<ProdutoServicoType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="max-w-10">
        <MenuTabelaProdutoServico dadosProduto={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.nome}</div>,
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.descricao || 'Sem descrição'}</div>,
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize">{row.original.tipo}</div>,
  },
  {
    accessorKey: 'preco',
    header: 'Valor (R$)',
    enableHiding: false,
    cell: ({ row }) => <div>{formatPrice(row.original.preco)}</div>,
  },
]
