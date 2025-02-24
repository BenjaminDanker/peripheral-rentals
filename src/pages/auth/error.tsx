import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AuthError() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    // Ensure that `useRouter()` is only accessed on the client-side
    useEffect(() => {
        if (router.query.error) {
            setErrorMessage(router.query.error as string); // Error message from query
        }
    }, [router.query.error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-red-500">Authentication Error</h1>
            <p className="mt-4 text-gray-300">{errorMessage || "An unexpected error occurred."}</p>
            <button 
                onClick={() => router.push("/auth/admin-login")} 
                className="mt-6 px-4 py-2 bg-blue-600 rounded-md"
            >
                Back to Login
            </button>
        </div>
    );
}
