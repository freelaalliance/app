import { axiosInstance } from '@/lib/AxiosLib'

export type ModuloPerfilUsuario = {
  idModulo: string
  nomeModulo: string
  urlModulo: string
}[]

export async function buscarModuloPerfilUsuario(): Promise<ModuloPerfilUsuario> {
  const listaPermissoes =
    await axiosInstance.get<ModuloPerfilUsuario>(`usuario/modulos`)

  return listaPermissoes.data
}
