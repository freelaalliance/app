import type { FormularioNovoTelefonePessoa } from '@/components/forms/NovoTelefone'
import { axiosInstance } from '@/lib/AxiosLib'
import type { ExcluirTelefonePessoaDialogProps } from '../RemoverTelefoneDialog'

interface NovoTelefonePessoaProps {
  telefone: FormularioNovoTelefonePessoa
  idPessoa: string
}

export async function salvarNovoTelefonePessoa({
  idPessoa,
  telefone,
}: NovoTelefonePessoaProps) {
  const novoTelefonePessoa = await axiosInstance.post(
    `pessoa/${idPessoa}/telefone`,
    {
      numero: `${telefone.codigoArea}${telefone.numero}`
    }
  )

  return novoTelefonePessoa.data
}

export async function excluirTelefonePessoa({
  id,
}: Pick<ExcluirTelefonePessoaDialogProps, 'id'>) {
  const deletaTelefone = await axiosInstance
    .delete<{
      status: boolean
      msg: string
    }>(`pessoa/telefone/${id}`)

  return deletaTelefone.data
}
