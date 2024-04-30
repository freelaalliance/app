import { z } from 'zod'

export const schemaUsuario = z.object({
  id: z.string(),
  nome: z.string().trim(),
  email: z.string().email(),
  status: z.enum(['ativo', 'desativado']),
  perfil: z.string(),
})

export type UsuarioType = z.infer<typeof schemaUsuario>

export const schemaFormularioNovoUsuario = z.object({
  nome: z
    .string({
      required_error: 'Necessário informar o nome do usuario',
    })
    .trim(),
  email: z
    .string({
      required_error: 'Necessário informar o nome do usuário',
    })
    .email({
      message: 'Email informado é inválido',
    }),
  senha: z
    .string({
      required_error: 'Necessário criar uma senha inicial do usuário',
    })
    .min(8, {
      message: 'A senha precisa ter no mínimo 8 caractéres',
    }),
  perfil: z
    .string({
      required_error: 'Necessário informar o perfil do usuário',
    })
    .uuid({
      message: 'Perfil inválido',
    }),
  empresa: z
    .string({
      required_error:
        'Necessário informar a empresa que este usuario vai pertencer',
    })
    .uuid({
      message: 'Empresa inválida',
    }),
})

export type FormularioNovoUsuarioType = z.infer<
  typeof schemaFormularioNovoUsuario
>

export const schemaFormularioEdicaoUsuario = z.object({
  id: z.string().uuid(),
  nome: z
    .string({
      required_error: 'Necessário informar o nome do usuario',
    })
    .trim(),
  email: z
    .string({
      required_error: 'Necessário informar o nome do usuário',
    })
    .email({
      message: 'Email informado é inválido',
    }),
  perfil: z
    .string({
      required_error: 'Necessário informar o perfil do usuário',
    })
    .uuid({
      message: 'Perfil inválido',
    }),
})

export type FormularioEdicaoUsuarioType = z.infer<
  typeof schemaFormularioEdicaoUsuario
>
