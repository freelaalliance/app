"use server"

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { z } from "zod"
import type {
  DeleteResult,
  DownloadResult,
  S3Config,
  UploadResult,
} from "./types"

// ============================================================================
// SCHEMAS DE VALIDAÇÃO
// ============================================================================

const schemaS3Config = z.object({
  S3_URL: z.string().url("URL do S3 inválida"),
  S3_ACCESS_KEY_ID: z.string().min(1, "Access Key ID é obrigatório"),
  S3_SECRET_ACCESS_KEY: z.string().min(1, "Secret Access Key é obrigatório"),
  S3_BUCKET: z.string().min(1, "Nome do bucket é obrigatório"),
})

const schemaUploadFile = z.object({
  file: z.any().refine(
    (file) => file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file,
    { message: "Arquivo inválido" }
  ),
  prefixo: z.string().optional().nullable(),
})

const schemaFileName = z.string().min(1, "Nome do arquivo é obrigatório")

// ============================================================================
// CONFIGURAÇÃO E CLIENTE S3 (SINGLETON)
// ============================================================================

let s3Client: S3Client | null = null
let s3Config: S3Config | null = null

/**
 * Retorna ou cria uma instância singleton do cliente S3
 * Melhora a performance ao reutilizar o cliente entre operações
 */
function getS3Client(): S3Client {
  if (s3Client) {
    return s3Client
  }

  try {
    s3Config = schemaS3Config.parse({
      S3_URL: process.env.S3_URL,
      S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
      S3_BUCKET: process.env.S3_BUCKET,
    })

    s3Client = new S3Client({
      region: "auto",
      endpoint: s3Config.S3_URL,
      credentials: {
        accessKeyId: s3Config.S3_ACCESS_KEY_ID,
        secretAccessKey: s3Config.S3_SECRET_ACCESS_KEY,
      },
    })

    return s3Client
  } catch (error) {
    console.error("Erro ao configurar cliente S3:", error)
    throw new Error("Falha na configuração do S3")
  }
}

function getS3Config(): S3Config {
  if (!s3Config) {
    getS3Client()
  }
  if (!s3Config) {
    throw new Error("Falha ao obter configuração do S3")
  }
  return s3Config
}

// ============================================================================
// FUNÇÃO DE UPLOAD
// ============================================================================

/**
 * Faz upload de um arquivo para o bucket S3 do Cloudflare
 * Gera automaticamente um UUID como nome do arquivo
 * 
 * @param formData - FormData contendo o arquivo e prefixo opcional
 * @returns Objeto com resultado da operação incluindo o UUID gerado
 */
export async function uploadFile(formData: FormData): Promise<UploadResult> {
  try {
    const parseResult = schemaUploadFile.safeParse({
      file: formData.get("file"),
      prefixo: formData.get("prefixo"),
    })

    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message || "Dados inválidos"
      return {
        success: false,
        error: errorMessage,
        message: errorMessage,
      }
    }

    const { file, prefixo } = parseResult.data

    // Gera UUID para o arquivo
    const uuid = crypto.randomUUID()

    // Extrai a extensão do arquivo original
    const extensao = file.name.match(/\.[^.]+$/)?.[0] || ''

    // Monta a chave do arquivo (prefixo/uuid.extensao)
    const keyArquivo = prefixo?.trim()
      ? `${prefixo}/${uuid}${extensao}`
      : `${uuid}${extensao}`

    // Converte o arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const client = getS3Client()
    const config = getS3Config()

    // Envia o arquivo para o S3
    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET,
      Key: keyArquivo,
      Body: buffer,
      ContentType: file.type,
      ContentLength: file.size,
    })

    const response = await client.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        success: false,
        error: "Falha ao fazer upload do arquivo",
        message: "O servidor retornou um status inesperado",
      }
    }

    return {
      success: true,
      key: uuid, // Retorna apenas o UUID
      keyCompleta: keyArquivo, // Retorna o caminho completo
      message: "Upload realizado com sucesso",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return {
      success: false,
      error: "Falha ao fazer upload do arquivo",
      message: errorMessage,
    }
  }
}

// ============================================================================
// FUNÇÃO DE DOWNLOAD
// ============================================================================

/**
 * Gera uma URL assinada para download de um arquivo do S3
 * 
 * @param fileName - Nome/chave do arquivo no bucket (caminho completo com extensão)
 * @returns URL assinada válida por 1 hora ou objeto de erro
 */
export async function downloadFile(fileName: string): Promise<DownloadResult> {
  try {
    const parseResult = schemaFileName.safeParse(fileName)

    if (!parseResult.success) {
      return {
        success: false,
        error: "Nome do arquivo inválido",
        message: parseResult.error.errors[0]?.message || "Nome do arquivo inválido",
      }
    }

    const client = getS3Client()
    const config = getS3Config()

    // Verifica se o arquivo existe antes de gerar a URL
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: config.S3_BUCKET,
        Key: fileName,
      })
      await client.send(headCommand)
    } catch (error) {
      return {
        success: false,
        error: "Arquivo não encontrado",
        message: `O arquivo '${fileName}' não existe no bucket`,
      }
    }

    // Gera URL assinada com validade de 1 hora
    const command = new GetObjectCommand({
      Bucket: config.S3_BUCKET,
      Key: fileName,
    })

    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600, // 1 hora
    })

    return {
      success: true,
      url: signedUrl,
      message: "URL de download gerada com sucesso",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return {
      success: false,
      error: "Falha ao gerar URL de download",
      message: errorMessage,
    }
  }
}

// ============================================================================
// FUNÇÃO DE EXCLUSÃO
// ============================================================================

/**
 * Exclui um arquivo do bucket S3
 * 
 * @param fileName - Nome/chave do arquivo a ser excluído
 * @returns Resultado da operação de exclusão
 */
export async function deleteFile(fileName: string): Promise<DeleteResult> {
  try {
    const parseResult = schemaFileName.safeParse(fileName)

    if (!parseResult.success) {
      return {
        success: false,
        error: "Nome do arquivo inválido",
        message: parseResult.error.errors[0]?.message || "Nome do arquivo inválido",
      }
    }

    const client = getS3Client()
    const config = getS3Config()

    const command = new DeleteObjectCommand({
      Bucket: config.S3_BUCKET,
      Key: fileName,
    })

    const response = await client.send(command)

    // S3 retorna 204 para exclusões bem-sucedidas
    const isSuccess = response.$metadata.httpStatusCode === 204

    if (!isSuccess) {
      return {
        success: false,
        error: "Falha ao excluir arquivo",
        message: "O servidor retornou um status inesperado",
      }
    }

    return {
      success: true,
      message: "Arquivo excluído com sucesso",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return {
      success: false,
      error: "Falha ao excluir arquivo",
      message: errorMessage,
    }
  }
}