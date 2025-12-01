import type { ColumnDef } from '@tanstack/react-table'

import type { DocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'
import { MenuTabelaDocumentosUsuario } from './menu-tabela-documentos-usuario'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const ColunasDocumentosUsuario: Array<ColumnDef<DocumentoType>> = [
  {
    id: 'acoes',
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div className="flex flex-row justify-center">
        <MenuTabelaDocumentosUsuario documento={row.original}/>
      </div>
    ),
  },
  {
    accessorKey: 'categoriaDocumentoNome',
    header: 'Categoria',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <TooltipProvider >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='line-clamp-1'>{row.original.categoriaDocumentoNome}</span>
            </TooltipTrigger>
            <TooltipContent align='start' >
              <span>{row.original.categoriaDocumentoNome}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'nome',
    header: 'Cod. Documento',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => <span>{row.original.nome}</span>,
  },
  {
    accessorKey: 'descricaoDocumento',
    header: 'Tít. informação documentada',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <TooltipProvider >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='line-clamp-1'>{row.original.descricaoDocumento}</span>
            </TooltipTrigger>
            <TooltipContent align='start' >
              <span>{row.original.descricaoDocumento}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'revisao',
    header: 'Revisão',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => (<span>{row.original.revisoes[row.original.revisoes.length - 1]?.numeroRevisao}</span>),
  },
  {
    accessorKey: 'ultimaRevisao',
    header: 'Dt. última revisão',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dataUltimaRevisao = row.original.revisoes[row.original.revisoes.length - 1] ? new Date(
        row.original.revisoes[row.original.revisoes.length - 1]?.revisadoEm
      ) : null

      return (
        <div className='w-auto capitalize'>
          {dataUltimaRevisao ? format(dataUltimaRevisao, 'P', {
            locale: ptBR
          }) : '--'}
        </div>
      )
    },
  },
  {
    accessorKey: 'usuario',
    header: 'Usuário',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <span className='capitalize'>{row.original.revisoes[0]?.usuario}</span>
      )
    },
  },
  {
    accessorKey: 'retencao',
    header: 'Retenção/Validade',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dataVencimento = new Date(
        row.original.retencao
      )

      return (
        <div className='w-auto capitalize'>
          {formatarDataBrasil(dataVencimento, false, 'P')}
        </div>
      )
    },
  }
]
