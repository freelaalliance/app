import { axiosInstance } from '@/lib/AxiosLib'
import type { EdicaoEnderecoProps } from '../EdicaoEnderecoDialog'

export async function salvarModificacaoEnderecoPessoa({
  idPessoa,
  endereco,
}: Omit<EdicaoEnderecoProps, 'enderecoAtualizado'>) {
  const atualizaEndereco = await axiosInstance.put(
    `pessoa/${idPessoa}/endereco/${endereco.id}`,
    endereco
  )

  return atualizaEndereco.data
}
