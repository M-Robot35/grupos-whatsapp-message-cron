import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type ActionResponse<T = undefined> =
    | { success: true; data: T }
    | { success: false; error: string; issues?: any[] };

/** Use in layouts/pages to read the session directly. */
export async function getAuthSession() {
    return await auth.api.getSession({ headers: await headers() });
}

/** Use to wrap Server Actions — enforces auth before the action runs. */
export function withAuth<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return (async (...args: Parameters<T>) => {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) throw new Error("Unauthorized");

        return await fn(...args);
    }) as T;
}
