import { deleteFile, uploadFile } from '@/app/modulo/documentos/[id]/novo/_actions/upload-actions'

export interface DocumentoUpload {
  id: string
  documento: string
  arquivo?: File
  chaveArquivo?: string
  urlArquivo?: string
  uploading?: boolean
}

// Gera um ID único para o documento
export function gerarIdDocumento(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Gera a chave do arquivo para o S3
export function gerarChaveArquivo(documentoId: string, nomeArquivo: string): string {
  const extensao = nomeArquivo.split('.').pop()
  return `contratacao/documentos/${documentoId}.${extensao}`
}

// Faz upload do arquivo para o S3
export async function uploadDocumento(arquivo: File, documentoId: string) {
  try {
    const chaveArquivo = gerarChaveArquivo(documentoId, arquivo.name)

    const formData = new FormData()
    formData.append('file', arquivo)
    formData.append('keyArquivo', chaveArquivo)

    const resultado = await uploadFile(formData)

    if (!resultado.success) {
      throw new Error(resultado.error || 'Erro no upload')
    }

    return {
      success: true,
      chaveArquivo: resultado.key as string
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Remove arquivo do S3
export async function removerDocumento(chaveArquivo: string) {
  try {
    const sucesso = await deleteFile(chaveArquivo)
    return sucesso
  } catch (error) {
    console.error('Erro ao remover arquivo:', error)
    return false
  }
}
