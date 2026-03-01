export function withRetry<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    maxRetries: number = 3
): T {
    return (async (...args: Parameters<T>) => {
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                return await fn(...args);
            } catch (error) {
                attempt++;
                if (attempt >= maxRetries) {
                    console.error(`[withRetry] Falha definitiva após ${maxRetries} tentativas.`);
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
            }
        }
    }) as T;
}
