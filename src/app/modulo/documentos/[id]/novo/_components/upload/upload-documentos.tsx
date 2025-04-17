"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileIcon, UploadIcon, X } from "lucide-react"
import Image from "next/image"
import { type ChangeEvent, type DragEvent, useRef, useState } from "react"

interface UploadFormProps {
  onSelectFile: (file: File | null) => void
  fileSelected?: File | null
  uploadingFile: boolean
}

export default function UploadForm({ onSelectFile, fileSelected, uploadingFile }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  
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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    setPreview(null)


    onSelectFile(selectedFile)
  }

  const resetForm = () => {
    setPreview(null)
    onSelectFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging
            ? "border-primary bg-primary/5"
            : fileSelected
              ? "border-green-500 bg-green-50/50"
              : "border-gray-300 hover:border-primary hover:bg-primary/5"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input disabled={!!fileSelected} multiple={false} type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          {!fileSelected ? (
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
              {preview ? (
                <div className="relative mb-4">
                  <Image
                    src={"/placeholder-file.png"}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="rounded-lg object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 w-24 bg-gray-100 rounded-lg mb-4">
                  <FileIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="text-center">
                <p className="text-sm font-medium">{fileSelected.name}</p>
                <p className="text-xs text-gray-500">{(fileSelected.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}

          {fileSelected && !uploadingFile && (
            <Button
              size={'icon'}
              onClick={(e) => {
                e.stopPropagation()
                resetForm()
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="size-4 text-gray-500" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
