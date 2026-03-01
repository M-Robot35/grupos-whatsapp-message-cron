import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpClient, HttpRequestOptions, HttpResponse } from './types'

export class AxiosHttpClient implements HttpClient {
    private axiosInstance: AxiosInstance

    constructor(config?: AxiosRequestConfig) {
        this.axiosInstance = axios.create(config)
    }

    async request<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
        try {
            const { method = 'GET', headers = {}, body, params, bearerToken, apiKey } = options

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

            const config: AxiosRequestConfig = {
                url,
                method,
                headers: mergedHeaders,
                data: body,
                params,
            }

            const response = await this.axiosInstance.request<T>(config)

            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers as Record<string, string>,
            }
        } catch (error: any) {
            // Formata o erro do Axios para casar com o que o adapter espera
            if (error.response) {
                throw {
                    message: error.message,
                    response: {
                        data: error.response.data,
                        status: error.response.status,
                        statusText: error.response.statusText,
                        headers: error.response.headers,
                    }
                }
            }
            throw error
        }
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
