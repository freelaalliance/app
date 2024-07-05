import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validaCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]+/g, '')

  if (cnpj === '') return false

  if (cnpj.length !== 14) return false

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  )
    return false

  // Valida DVs
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  const digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== Number(digitos.charAt(0))) return false

  tamanho = tamanho + 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== Number(digitos.charAt(1))) return false

  return true
}

export function encodeFileToBase64(file: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof file === 'string') {
      resolve(btoa(file))
    } else {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    }
  })
}

export function identifyFileTypeFromBase64(
  base64String: string,
): string | null {
  if (!/^data:.*;base64,.*/.test(base64String)) {
    return null
  }

  const prefix = base64String.split(';')[0]
  const fileTypes = [
    'data:image/png',
    'data:image/jpeg',
    'data:image/gif',
    'data:application/pdf',
    'data:image/jpg',
    'data:image/webp',
  ]

  if (fileTypes.includes(prefix)) {
    return prefix.split('data:')[1]
  }

  return null
}

export const downloadFileFromBase64 = (
  base64String: string,
  fileName: string,
) => {
  const link = document.createElement('a')

  link.href = base64String
  link.download = fileName

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

export async function handleDownloadFile(
  certificado: string,
  id: string,
): Promise<void> {
  const tipoArquivo: string | null = identifyFileTypeFromBase64(certificado)

  if (!tipoArquivo) {
    toast.error('Falha ao identificar o tipo de arquivo, tente novamente!')
    return
  }

  const extensao = tipoArquivo.split('/')[1]

  await downloadFileFromBase64(certificado, `certificado_${id}.${extensao}`)
}

export function formatarDataBrasil(data: Date): string {
  return format(data, 'dd/MM/yyyy HH:mm', {
    locale: ptBR,
  })
}
