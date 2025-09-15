import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validaCNPJ(documento: string) {
  let cnpj = documento.replace(/[^\d]+/g, '')

  if (cnpj === '') return false

  if (cnpj.length === 13 || cnpj.length === 12) {
    if (cnpj.length === 13) {
      cnpj = `0${cnpj}`
    }
    if (cnpj.length === 12) {
      cnpj = `00${cnpj}`
    }
  } else if (cnpj.length <= 11) return false

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

export function validarCPF(cpf: string) {
  if (cpf.length !== 11) return false

  if (
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  )
    return false

  let sum: number
  let rest: number
  sum = 0
  for (let i = 1; i <= 9; i++) {
    sum = sum + Number.parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== Number.parseInt(cpf.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum = sum + Number.parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== Number.parseInt(cpf.substring(10, 11))) return false

  return true
}

export function validarDocumento(documento: string) {
  const documentoPessoa = documento.replace(/[^\d]+/g, '')

  return documentoPessoa.length === 11 ? validarCPF(documentoPessoa) : validaCNPJ(documentoPessoa)
}

export function encodeFileToBase64(file: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof file === 'string') {
      resolve(btoa(file))
    } else {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
      reader.readAsDataURL(file)
    }
  })
}

export function identifyFileTypeFromBase64(
  base64String: string
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
  fileName: string
) => {
  const link = document.createElement('a')

  link.href = base64String
  link.download = fileName

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

export async function handleDownloadFile(
  anexo: string,
  id: string
): Promise<void> {
  const tipoArquivo: string | null = identifyFileTypeFromBase64(anexo)

  if (!tipoArquivo) {
    toast.error('Falha ao identificar o tipo de arquivo, tente novamente!')
    return
  }

  const extensao = tipoArquivo.split('/')[1]

  await downloadFileFromBase64(anexo, `anexo_${id}.${extensao}`)
}

export function formatarDataBrasil(
  data: Date,
  horas = false,
  formato = 'PPPP'
): string {
  if (horas) {
    const dataComHoras = new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate(),
      data.getHours(),
      data.getMinutes()
    )
    return format(dataComHoras, 'dd/MM/yyyy HH:mm', {
      locale: ptBR,
    })
  }

  const dataFormatada = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1)

  return format(dataFormatada, formato, {
    locale: ptBR,
  })
}

export function formatCamelCase(palavra: string) {
  // Adiciona um espaço antes de cada letra maiúscula e transforma tudo em minúsculas
  const formattedStr = palavra.replace(/([a-z])([A-Z])/g, '$1 $2')
  const arrayPalavra = formattedStr.split(' ')

  const formatacaoPrimeiraPalavra = String(arrayPalavra[0]).replace(
    /\b\w/g,
    char => {
      return char.toUpperCase()
    }
  )

  return (
    formatacaoPrimeiraPalavra +
    (arrayPalavra[1] ? ` ${arrayPalavra[1].toLowerCase()}` : '')
  )
}

export function formatarDocumento(valor: string): string {
  const valorNumeros = valor.replace(/\D/g, '')

  if (valorNumeros.length === 11) {
    return valorNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return valorNumeros.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  )
}

export function aplicarMascaraDocumento(valor: string): string {
  const valorNumeros = String(valor).replace(/\D/g, '')

  if (valorNumeros.length === 11) {
    return valorNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4')
  }
  return valorNumeros.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.***.***/$4-$5'
  )
}

export function formatarValorMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarNumeroTelefone(telefone: string): string {

  if (telefone.length === 9) {
    return telefone.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3')
  }

  return telefone.replace(/(\d{4})(\d{4})/, '$1-$2')
}

export function formatarNumeroTelefoneComDDD(telefone: string): string {

  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4')
  }

  return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export function removerCaracteresEspecial(informacao: string) {
  return informacao.replace(/[^a-zA-Z0-9 ]/g, '')
}

// Função para formatear números decimais (vírgula -> ponto)
export function formatDecimalInput(value: string): string {
  // Remove caracteres não numéricos exceto vírgula e ponto
  let cleaned = value.replace(/[^\d,.-]/g, '')

  // Substitui vírgula por ponto
  cleaned = cleaned.replace(/,/g, '.')

  // Remove pontos extras (mantém apenas o primeiro)
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = `${parts[0]}.${parts.slice(1).join('')}`
  }

  return cleaned
}

// Hook personalizado para campos numéricos decimais
export function useDecimalInput(field: { onChange: (value: number) => void; value: number }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDecimalInput(e.target.value)
    // Converte o valor formatado para number antes de enviar para o form
    const numericValue = formattedValue === '' ? 0 : Number.parseFloat(formattedValue)
    field.onChange(numericValue)
  }

  return {
    ...field,
    value: field.value?.toString() || '', // Converte number para string para exibição
    onChange: handleChange,
  }
}
