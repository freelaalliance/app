"use server"

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const schemaS3 = z.object({
  S3_URL: z.string().url(),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
})

const envS3 = schemaS3.parse(process.env)

const s3 = new S3Client({
  region: "auto",
  endpoint: envS3.S3_URL,
  credentials: {
    accessKeyId: envS3.S3_ACCESS_KEY_ID,
    secretAccessKey: envS3.S3_SECRET_ACCESS_KEY,
  },
});

export async function uploadFile(formData: FormData) {
  try {
    
    const file = formData.get("file") as File

    const buffer = Buffer.from(await file.arrayBuffer());

    const resultUpload = await s3.send(
      new PutObjectCommand({
        Bucket: envS3.S3_BUCKET,
        Key: file.name,
        Body: buffer,
        ContentType: file.type,
      })
    )
    
    console.log("Upload result:", resultUpload)

    if (!file) {
      throw new Error("Nenhum arquivo fornecido")
    }

    return {
      success: true,
      key: file.name,
    }
  } catch (error) {
    console.error("Erro ao fazer upload:", error)
    return {
      success: false,
      error: "Falha ao fazer upload do arquivo",
    }
  }
}

export async function downloadFile(fileName: string) {
  try {
    
    const resultDownload = new GetObjectCommand({
      Bucket: envS3.S3_BUCKET,
      Key: fileName,
    })

    const signedUrl = await getSignedUrl(s3, resultDownload, { expiresIn: 60 * 5 });

    return signedUrl
  } catch (error) {
    console.error("Erro ao fazer download:", error)
    return null
  }
}
