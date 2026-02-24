export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  message: string
  error?: string
}

export type HousingType = 'BUY' | 'RENT' | 'JEONSE'

export type AlertType = 'PRICE_UP' | 'PRICE_DOWN' | 'VOLUME_SURGE'
