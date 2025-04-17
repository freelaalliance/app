import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatarDataBrasil } from '@/lib/utils'
import { Download } from 'lucide-react'
import { downloadFile } from '../../../_actions/upload-actions'
import type { TabelaRevisoesDocumentoProps } from '../../dialogs/revisoes-documento-dialog'

export function TabelaRevisoesDocumento({
  revisoes,
}: TabelaRevisoesDocumentoProps) {
  const handleDownload = async (arquivo: string) => {
    const url = await downloadFile(arquivo)

    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', arquivo)
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
    }
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Revisão</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Arquivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {revisoes.map(revisao => (
            <TableRow key={revisao.id}>
              <TableCell>{revisao.numeroRevisao}</TableCell>
              <TableCell>
                {formatarDataBrasil(new Date(revisao.revisadoEm), false, 'P')}
              </TableCell>
              <TableCell>{revisao.usuario}</TableCell>
              <TableCell>
                <Button
                  variant="default"
                  onClick={() => handleDownload(revisao.arquivoUrl)}
                >
                  <Download className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
