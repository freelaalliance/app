import { axiosInstance } from '@/lib/AxiosLib'
import type { ExpedicaoFormData } from '../_components/forms/expedicao-form'

export async function enviarExpedicao(data: ExpedicaoFormData) {
  const response = await axiosInstance.post('/vendas/expedicao', data)
  return response.data
}
