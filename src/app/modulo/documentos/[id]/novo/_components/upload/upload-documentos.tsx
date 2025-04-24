"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckIcon, FileIcon, Loader2, UploadIcon, X } from "lucide-react"
import Image from "next/image"
import { type ChangeEvent, type DragEvent, useRef, useState } from "react"
import { toast } from "sonner"
import { deleteFile, uploadFile } from "../../_actions/upload-actions"
import { Progress } from "@/components/ui/progress"

interface UploadFormProps {
  keyArquivo: string
  arquivoSelecionado: (selecionado: boolean) => void
}

export default function UploadForm({ keyArquivo, arquivoSelecionado }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [removendoArquivo, setRemovendoArquivo] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0])
    }
  }

  const resetForm = async () => {
    setRemovendoArquivo(true)

    const removeArquivo = await deleteFile(keyArquivo)
    if (!removeArquivo) {
      toast.error('Erro ao remover o arquivo. Tente novamente.')
      return
    }

    setRemovendoArquivo(false)
    setFile(null)
    setPreview(null)
    setUploading(false)
    setUploadComplete(false)
    arquivoSelecionado(!!file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadFile = async (selectedFile: File) => {
    setPreview(null)
    setFile(selectedFile)
    setUploading(true)
    arquivoSelecionado(!!selectedFile)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('keyArquivo', keyArquivo)

      const result = await uploadFile(formData)

      setUploadComplete(true)

      if (!result.success) {
        toast.error('Erro ao fazer upload do arquivo. Tente novamente.')
        console.log(result.error)
        return
      }

      if (uploadComplete && result.success && result.key) {

        setUploading(false)
        toast.success('Upload realizado com sucesso!')
      }
    } catch (err) {
      toast.error('Erro ao fazer upload do arquivo. Tente novamente.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-2">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging
            ? "border-primary bg-primary/5"
            : file
              ? "border-green-500 bg-green-50/50"
              : "border-gray-300 hover:border-primary hover:bg-primary/5"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input disabled={!!file} multiple={false} type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          {!file ? (
            <div className="flex flex-col items-center justify-center py-4">
              <UploadIcon className="size-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-center">
                Arraste e solte seu arquivo aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Suporta arquivos PDFs
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {
                uploading ? (
                  <>
                    <div className="relative flex size-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-8 bg-gray-400" />
                    </div>
                    <p className="text-center text-sm font-medium mt-6">Salvando arquivo...</p>
                  </>
                ) : uploadComplete && (
                  <>
                    <div className="flex items-center justify-center h-24 rounded-lg mb-4">
                      <FileIcon className="size-12 text-gray-400" />
                    </div>


                    <div className="text-center">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </>
                )
              }
            </div>
          )}

          {file && !uploading && (
            <Button
              size={'icon'}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                resetForm()
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              {removendoArquivo ? (<Loader2 className="size-4 animate-spin text-gray-500" />) : (<X className="size-4 text-gray-500" />)}
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
