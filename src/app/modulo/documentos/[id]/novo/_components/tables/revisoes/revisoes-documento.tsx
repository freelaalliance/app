import type { RevisoesDocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatarDataBrasil } from '@/lib/utils'
import { Download } from 'lucide-react'
import { downloadFile } from '../../../_actions/upload-actions'

interface TabelaRevisoesDocumentoProps {
  revisoes: Array<RevisoesDocumentoType>
}

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
        <TableHeader className='select-none'>
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
        <TableFooter className='flex flex-row h-8 items-center select-none px-4'>
          <span>{`${revisoes.length} ${revisoes.length <= 1 ? 'revisão registrada' : 'revisões registradas'}`}</span>
        </TableFooter>
      </Table>
    </div>
  )
}
