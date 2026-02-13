'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from '@/components/upload/upload'
import { ListaArquivo } from '@/components/upload/lista-arquivo'
import { encodeFileToBase64 } from '@/lib/utils'

import {
  type ResponseAnexosFornecedorType,
  salvarAnexoFornecedor,
} from '../(api)/FornecedorApi'

interface FormularioAnexoFornecedorProps {
  idFornecedor: string
}

export function FormularioAnexoFornecedor({
  idFornecedor,
}: FormularioAnexoFornecedorProps) {
  const queryClient = useQueryClient()
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([])
  const [observacao, setObservacao] = useState<string>('')

  const { mutateAsync: novoAnexo, isPending } = useMutation({
    mutationFn: salvarAnexoFornecedor,
    onError: error => {
      toast.error('Erro ao salvar o anexo, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: data => {
      if (data.status) {
        const anexosFornecedor: ResponseAnexosFornecedorType | undefined =
          queryClient.getQueryData(['anexosFornecedor', idFornecedor])

        queryClient.setQueryData(['anexosFornecedor', idFornecedor], {
          ...anexosFornecedor,
          dados: [...(anexosFornecedor?.dados ?? []), data.dados],
        })

        setArquivosSelecionados([])
        setObservacao('')

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
  })

  function selecionaArquivo(arquivos: File[]) {
    setArquivosSelecionados(arquivos)
  }

  function excluiArquivo(index: number) {
    setArquivosSelecionados(prev => prev.filter((_, i) => i !== index))
  }

  async function handleAdicionarAnexo() {
    if (arquivosSelecionados.length === 0) {
      toast.warning('Selecione um arquivo para adicionar')
      return
    }

    const arquivo = arquivosSelecionados[0]
    const arquivo64 = await encodeFileToBase64(arquivo)

    await novoAnexo({
      anexo: {
        nome: arquivo.name,
        arquivo: arquivo64,
        observacao: observacao.trim() || null,
      },
      idFornecedor,
    })
  }

  return (
    <div className="space-y-4">
      <Upload selecionaArquivo={selecionaArquivo} />

      {arquivosSelecionados.length > 0 && (
        <ListaArquivo
          listaArquivoSelecionado={arquivosSelecionados}
          excluiArquivo={excluiArquivo}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="observacao">Observação</Label>
        <Textarea
          id="observacao"
          placeholder="Adicione uma observação sobre o documento (opcional)"
          value={observacao}
          onChange={e => setObservacao(e.target.value)}
          rows={3}
        />
      </div>

      <Button
        className="w-full shadow bg-padrao-red hover:bg-red-800"
        disabled={isPending || arquivosSelecionados.length === 0}
        onClick={handleAdicionarAnexo}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          'Adicionar anexo'
        )}
      </Button>
    </div>
  )
}
