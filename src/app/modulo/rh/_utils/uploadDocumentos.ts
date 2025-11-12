import { deleteFile, uploadFile } from '@/app/modulo/documentos/[id]/novo/_actions/upload-actions'

export interface DocumentoUpload {
  id: string
  documento: string
  arquivo?: File
  keyCompleta?: string // Armazena o caminho completo (prefixo/uuid.extensao)
  uploading?: boolean
}

// Gera um ID único para o documento (usado apenas para controle local)
export function gerarIdDocumento(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Faz upload do arquivo para o S3 usando o padrão com UUID automático
 * @param arquivo - Arquivo a ser enviado
 * @param prefixo - Prefixo opcional para organização no bucket (ex: "contratacao/documentos")
 * @returns Objeto com sucesso, UUID, keyCompleta e mensagem
 */
export async function uploadDocumento(arquivo: File, prefixo?: string) {
  try {
    const formData = new FormData()
    formData.append('file', arquivo)

    // Adiciona o prefixo se fornecido
    if (prefixo) {
      formData.append('prefixo', prefixo)
    }

    const resultado = await uploadFile(formData)

    if (!resultado.success) {
      throw new Error(resultado.error || 'Erro no upload')
    }

    return {
      success: true,
      uuid: resultado.key, // UUID gerado pelo servidor
      keyCompleta: resultado.keyCompleta, // Caminho completo no bucket
      message: resultado.message
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Remove arquivo do S3
 * @param keyCompleta - Caminho completo do arquivo no bucket (ex: "contratacao/documentos/uuid.pdf")
 * @returns true se sucesso, false se erro
 */
export async function removerDocumento(keyCompleta: string) {
  try {
    const resultado = await deleteFile(keyCompleta)
    return resultado.success
  } catch (error) {
    console.error('Erro ao remover arquivo:', error)
    return false
  }
}
