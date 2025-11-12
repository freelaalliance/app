// ============================================================================
// TIPOS DE CONFIGURAÇÃO
// ============================================================================

export interface S3Config {
  S3_URL: string
  S3_ACCESS_KEY_ID: string
  S3_SECRET_ACCESS_KEY: string
  S3_BUCKET: string
}

// ============================================================================
// TIPOS DE RESULTADO (DISCRIMINATED UNIONS)
// ============================================================================

export type UploadResult =
  | {
    success: true
    key: string // UUID do arquivo
    keyCompleta: string // Caminho completo (prefixo/uuid.extensao)
    message: string
  }
  | {
    success: false
    error: string
    message: string
  }

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
