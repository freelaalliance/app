import type { FormularioNovoEmail } from '@/components/forms/NovoEmail'
import { axiosInstance } from '@/lib/AxiosLib'
import type { ExcluirEmailPessoaDialogProps } from '../RemoverEmailDialog'

interface NovoEmailPessoaProps {
  idPessoa: string
  email: FormularioNovoEmail
}

export async function salvarNovoEmail({
  idPessoa,
  email,
}: NovoEmailPessoaProps) {
  const pessoaEmail = await axiosInstance.post(
    `pessoa/${idPessoa}/email`,
    email
  )

  return pessoaEmail.data
}

export async function excluirEmailPessoa({
  id,
}: Pick<ExcluirEmailPessoaDialogProps, 'id'>): Promise<{
  status: boolean
  msg: string
}> {
  const deletaEmail = await axiosInstance
    .delete<{
      status: boolean
      msg: string
    }>(`pessoa/email/${id}`)

    return deletaEmail.data
}
