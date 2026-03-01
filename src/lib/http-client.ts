import { AxiosHttpClient } from '@/adapters/http/axios.adapter'
import { FetchHttpClient } from '@/adapters/http/fetch.adapter'
import { HttpClient } from '@/adapters/http/types'

/**
 * Factory and global instance for Http Client requests.
 * Permite trocar facilmente entre `axios` e `fetch` em toda a aplicação
 * alterando apenas esta instância.
 */

// Se quiser usar Fetch:
// export const httpClient: HttpClient = new FetchHttpClient()

// Se quiser usar Axios nativamente configurado:
export const httpClient: HttpClient = new AxiosHttpClient({
    timeout: 15000, // 15s timeout global
})
