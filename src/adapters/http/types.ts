export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequestOptions {
    method?: HttpMethod
    headers?: Record<string, string>
    body?: unknown
    params?: Record<string, string | number | boolean>

    /** Automagically adds "Authorization: Bearer <token>" to headers */
    bearerToken?: string

    /** Automagically adds "apikey: <key>" to headers */
    apiKey?: string
}

export interface HttpResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
}

export interface HttpClient {
    request<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>
    get<T>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>>
    post<T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>>
    put<T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>>
    patch<T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>>
    delete<T>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>>
}
