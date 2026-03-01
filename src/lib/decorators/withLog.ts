export function withLog<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return (async (...args: Parameters<T>) => {
        const fnName = fn.name || 'Anonymous function';
        console.log(`[INFO] Executando ${fnName}...`);
        const start = performance.now();
        try {
            const result = await fn(...args);
            const end = performance.now();
            console.log(`[SUCCESS] ${fnName} finalizada em ${(end - start).toFixed(2)}ms.`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.error(`[ERROR] ${fnName} falhou em ${(end - start).toFixed(2)}ms.`, error);
            throw error;
        }
    }) as T;
}
