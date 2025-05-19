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

export async function consultarCep({ cep }: consultaCepProps): Promise<{
  erro: boolean
  msg: string
  dados: enderecoType
}> {

  const BASE_URL_VIACEP: string | null =
    process.env.NEXT_PUBLIC_URL_VIACEP || null

  if (!BASE_URL_VIACEP) return {
    erro: true,
    msg: 'URL do ViaCEP não configurada',
    dados: {
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
    }
  }

  const dadosCep = await axios.get(
    `${BASE_URL_VIACEP}${cep}/json`
  )
    .then((resp) => {
      if (resp.data.erro) {
        return {
          erro: true,
          msg: 'CEP não encontrado',
          dados: {
            cep: '',
            logradouro: '',
            complemento: '',
            bairro: '',
            localidade: '',
            uf: '',
          }
        }
      }

      return {
        erro: false,
        msg: 'CEP encontrado',
        dados: resp.data,
      }
    })
    .catch(() => ({
      erro: true,
      msg: 'CEP não encontrado',
      dados: {
        cep: '',
        logradouro: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
      }
    }))

  return dadosCep
}
