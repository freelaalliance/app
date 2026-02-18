import type {
  AuthPropsInterface,
  UsuarioType,
} from '@/components/auth/schema/SchemaUsuario'
import { axiosInstance } from '@/lib/AxiosLib'

export interface AuthResponse {
  status: boolean
  msg: string
}

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

export async function logout(): Promise<AuthResponse> {
  try {
    const { data } = await axiosInstance.post<AuthResponse>('/usuario/logout')

    return data
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    const errorMessage = error.response?.data?.msg || 'Erro ao fazer logout'
    throw new Error(errorMessage)
  }
}