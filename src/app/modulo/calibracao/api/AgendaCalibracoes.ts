import { differenceInDays } from 'date-fns'

import { axiosInstance } from '@/lib/AxiosLib'

export type AgendaCalibracaoEmpresaType = {
  id: string
  instrumento: string
  codigo: string
  nome: string
  agendadoPara: Date
}

export type CoresVencimentoCalibracaoType = {
  bgLista: string
  bgCalendario: string
}

export async function recuperaAgendaCalibracoesEmpresa() {
  const response = await axiosInstance.get<AgendaCalibracaoEmpresaType[]>(
    `instrumentos/calibracoes/agenda`,
  )

  return response.data
}

export function recuperaCorVencimentoCalibracoesAgenda(
  dataAgenda: Date,
): CoresVencimentoCalibracaoType {
  const diferencaDias: number = differenceInDays(dataAgenda, new Date())

  if (diferencaDias <= 0) {
    return {
      bgLista: 'bg-[#dc2626]',
      bgCalendario: '#dc2626',
    }
  } else if (diferencaDias >= 1 && diferencaDias <= 30) {
    return {
      bgLista: 'bg-[#d97706]',
      bgCalendario: '#d97706',
    }
  }

  return {
    bgLista: 'bg-[#027435]',
    bgCalendario: '#027435',
  }
}
