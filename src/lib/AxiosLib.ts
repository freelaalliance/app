import axios from 'axios'

export type RespostaType = {
  status: boolean
  msg: string
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_HOST || 'http://localhost:3333/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { axiosInstance }
