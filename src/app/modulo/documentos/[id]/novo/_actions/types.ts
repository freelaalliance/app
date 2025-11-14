/**
 * Tipos para as operações de upload/download/delete de arquivos no S3
 */

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

export type S3Config = {
  S3_URL: string
  S3_ACCESS_KEY_ID: string
  S3_SECRET_ACCESS_KEY: string
  S3_BUCKET: string
}

// ============================================================================
// RESULTADOS DE OPERAÇÕES
// ============================================================================

/**
 * Resultado da operação de upload
 */
export type UploadResult =
  | {
    success: true
    key: string // UUID do arquivo
    keyCompleta: string // Caminho completo no bucket (prefixo/uuid.extensao)
    message: string
  }
  | {
    success: false
    error: string
    message: string
  }

/**
 * Resultado da operação de download
 */
export type DownloadResult =
  | {
    success: true
    url: string
    message: string
  }
  | {
    success: false
    error: string
    message: string
  }

/**
 * Resultado da operação de exclusão
 */
export type DeleteResult =
  | {
    success: true
    message: string
  }
  | {
    success: false
    error: string
    message: string
  }

// ============================================================================
// INPUTS
// ============================================================================

/**
 * Dados necessários para upload de arquivo
 * Nota: Em Server Actions, File é recebido via FormData como Blob
 */
export type UploadFileInput = {
  file: Blob | File
  prefixo?: string // Prefixo/pasta opcional
}

/**
 * Parâmetro para download/delete de arquivo
 */
export type FileNameInput = string

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Verifica se o resultado de upload foi bem-sucedido
 */
export function isUploadSuccess(result: UploadResult): result is Extract<UploadResult, { success: true }> {
  return result.success === true
}

/**
 * Verifica se o resultado de download foi bem-sucedido
 */
export function isDownloadSuccess(result: DownloadResult): result is Extract<DownloadResult, { success: true }> {
  return result.success === true
}

/**
 * Verifica se o resultado de exclusão foi bem-sucedido
 */
export function isDeleteSuccess(result: DeleteResult): result is Extract<DeleteResult, { success: true }> {
  return result.success === true
}
