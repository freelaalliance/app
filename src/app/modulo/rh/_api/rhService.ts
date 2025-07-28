export interface ApiResponse<T> {
  status: boolean
  msg?: string
  dados?: T
}