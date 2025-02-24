import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== "loading" && (status === "unauthenticated" || session?.user?.role !== "admin")) {
            router.replace("/auth/no-access"); // Use replace() to prevent going back to admin
        }
    }, [status, session, router]);

    if (status === "loading" || !session?.user) {
        return <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">Checking authentication...</div>;
    }

    if (session?.user?.role !== "admin") {
        return null; // Prevent unauthorized users from seeing content even for a second
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <AdminNavbar />
            <div className="max-w-6xl mx-auto p-6">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
