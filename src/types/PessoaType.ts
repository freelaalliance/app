export type EnderecoPessoa = {
  logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
}

export type TelefonePessoa = {
  numero: string
}

export type EmailPessoa = {
  email: string
}

export type Pessoa = {
  id?: string
  nome: string
  Endereco?: EnderecoPessoa
  TelefonePessoa?: TelefonePessoa[]
  EmailPessoa?: EmailPessoa[]
}