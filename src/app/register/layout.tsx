import { getAuthSession } from "@/lib/decorators/withAuth";
import { redirect } from "next/navigation";

export default async function RegisterLayout({ children }: { children: React.ReactNode }) {
    const session = await getAuthSession();
    if (session?.user) {
        redirect("/dashboard");
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            {children}
        </div>
    );
}