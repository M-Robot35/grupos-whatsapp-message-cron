export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiError = {
  success: false
  message: string
  issues?: Array<{
    path: string
    message: string
  }>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
