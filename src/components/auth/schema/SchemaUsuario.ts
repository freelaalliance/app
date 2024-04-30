export type UsuarioType = {
  id: string
  nome: string
  email: string
  perfil: string
}

export interface AuthPropsInterface {
  email: string
  senha: string
}
