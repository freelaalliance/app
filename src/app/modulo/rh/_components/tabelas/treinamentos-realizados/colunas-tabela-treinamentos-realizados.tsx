import { downloadFile } from '@/app/modulo/documentos/[id]/novo/_actions/upload-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DownloadCloudIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { TreinamentoRealizado } from '../../../_types/colaborador/ContratacaoType'

const handleDownload = async (arquivo: string) => {
  try {
    const result = await downloadFile(arquivo)

    if (!result.success) {
      toast.error(result.message || 'Erro ao baixar arquivo')
      return
    }

    // Abre o arquivo em uma nova aba para visualização (bom para PDFs)
    window.open(result.url, '_blank')

    toast.success('Download iniciado!')
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error)
    toast.error('Erro ao baixar arquivo. Tente novamente.')
  }
}

export const colunasTabelaTreinamentosRealizados: ColumnDef<TreinamentoRealizado>[] =
  [
    {
      accessorKey: 'colaborador',
      header: 'Colaborador',
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.original.colaborador ?? '—'}
          </div>
        )
      },
    },
    {
      accessorKey: 'treinamento.nome',
      header: 'Treinamento',
      cell: ({ row }) => {
        return <div>{row.original.treinamento?.nome ?? '—'}</div>
      },
    },
    {
      accessorKey: 'treinamento.tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const tipo = row.original.treinamento?.tipo
        const labels: Record<string, string> = {
          integracao: 'Integração',
          capacitacao: 'Capacitação',
          reciclagem: 'Reciclagem',
        }
        return (
          <Badge variant="outline" className="capitalize">
            {labels[tipo ?? ''] ?? tipo}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'treinamento.grupo',
      header: 'Grupo',
      cell: ({ row }) => {
        const grupo = row.original.treinamento?.grupo
        return (
          <Badge
            variant="secondary"
            className={
              grupo === 'externo'
                ? 'bg-orange-100 text-orange-800 border-orange-200'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }
          >
            {grupo === 'externo' ? 'Externo' : 'Interno'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      cell: ({ row }) => {
        return <div>{row.original.cargo ?? '—'}</div>
      },
    },
    {
      accessorKey: 'iniciadoEm',
      header: 'Início',
      cell: ({ row }) => {
        const data = row.original.iniciadoEm
        if (!data) return <div>—</div>
        return (
          <div>
            {format(new Date(data), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        )
      },
    },
    {
      accessorKey: 'finalizadoEm',
      header: 'Finalização',
      cell: ({ row }) => {
        const data = row.original.finalizadoEm
        if (!data)
          return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Pendente
            </Badge>
          )
        return (
          <div>
            {format(new Date(data), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        )
      },
    },
    {
      accessorKey: 'certificado',
      header: 'Certificado',
      cell: ({ row }) => {
        const certificado = row.original.certificado
        return certificado ? (
          <Button variant={'outline'} size={'icon'} onClick={() => handleDownload(certificado)}>
            <DownloadCloudIcon className='size-4' />
          </Button>
        ) : (
          <div>—</div>
        )
      },
    },
  ]
