import type { ColumnDef } from '@tanstack/react-table'

import type { DocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'
import { MenuTabelaDocumentosUsuario } from './menu-tabela-documentos-usuario copy'

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
    cell: ({ row }) => (<span>{row.original.revisoes.length}</span>),
  },
  {
    accessorKey: 'ultimaRevisao',
    header: 'Dt. última revisão',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dataUltimaRevisao = new Date(
        row.original.revisoes[0]?.revisadoEm || new Date()
      )

      return (
        <div className='w-auto capitalize'>
          {formatarDataBrasil(dataUltimaRevisao, false, 'P')}
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
    accessorKey: 'copias',
    header: 'Cópias',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <span>{row.original.copias}</span>
      )
    },
  },
  {
    accessorKey: 'recuperacao',
    header: 'Recuperação',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <span className='capitalize'>{row.original.recuperacao}</span>
      )
    },
  },
  {
    accessorKey: 'uso',
    header: 'Uso',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <span className='capitalize'>{row.original.uso}</span>
      )
    },
  },
  {
    accessorKey: 'elegibilidade',
    header: 'Pres. legibilidade',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <TooltipProvider >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='line-clamp-1'>{row.original.elegibilidade}</span>
            </TooltipTrigger>
            <TooltipContent align='start' >
              <span>{row.original.elegibilidade}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'retencao',
    header: 'Retenção',
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
  },
  {
    accessorKey: 'disposicao',
    header: 'Disposição',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <span className='capitalize'>{row.original.disposicao}</span>
      )
    },
  },
]
