import type {
  AuthPropsInterface,
  UsuarioType,
} from '@/components/auth/schema/SchemaUsuario'
import { axiosInstance } from '@/lib/AxiosLib'

export async function recuperarDadosUsuarioSessao() {
  const response = await axiosInstance.get<UsuarioType>('usuario/dados')

  return response.data
}

export async function login({ email, senha }: AuthPropsInterface) {
  const response = await axiosInstance.post('usuario/login', {
    email,
    senha,
  })

  return response.data
}
