import axios from 'axios'

interface consultaCepProps {
  cep: string
}

export type enderecoType = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}

export async function consultarCep({ cep }: consultaCepProps) {

  const BASE_URL_VIACEP: string | null =
    process.env.NEXT_PUBLIC_URL_VIACEP || null

  if (!BASE_URL_VIACEP) return null

  const dadosCep = await axios.get<enderecoType>(`${BASE_URL_VIACEP}${cep}/json`)

  return dadosCep
}
