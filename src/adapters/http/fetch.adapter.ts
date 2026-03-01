import { HttpClient, HttpRequestOptions, HttpResponse } from './types'

export class FetchHttpClient implements HttpClient {
    async request<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
        const { method = 'GET', headers = {}, body, params, bearerToken, apiKey } = options

        let fullUrl = url
        if (params) {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                searchParams.append(key, String(value))
            })
            fullUrl = `${url}?${searchParams.toString()}`
        }

        const mergedHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers
        }

        if (bearerToken) {
            mergedHeaders['Authorization'] = `Bearer ${bearerToken}`
        }

        if (apiKey) {
            mergedHeaders['apikey'] = apiKey
        }

        const init: RequestInit = {
            method,
            headers: mergedHeaders,
        }

        if (body) {
            init.body = typeof body === 'string' ? body : JSON.stringify(body)
        }

        const response = await fetch(fullUrl, init)

        // Attempt to parse JSON response safely
        let data = null
        const text = await response.text()
        if (text) {
            try {
                data = JSON.parse(text)
            } catch {
                data = text as unknown as T
            }
        }

        const responseHeaders: Record<string, string> = {}
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value
        })

        const httpResponse: HttpResponse<T> = {
            data: data as T,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        }

        if (!response.ok) {
            throw { response: httpResponse, message: `Request failed with status ${response.status}` }
        }

        return httpResponse
    }

    async get<T>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
        return this.request<T>(url, { ...options, method: 'GET' })
    }

    async post<T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
        return this.request<T>(url, { ...options, method: 'POST', body })
    }

    async put<T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
        return this.request<T>(url, { ...options, method: 'PUT', body })
    }

    async patch<T>(url: string, body?: unknown, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
        return this.request<T>(url, { ...options, method: 'PATCH', body })
    }

    async delete<T>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
        return this.request<T>(url, { ...options, method: 'DELETE' })
    }
}
