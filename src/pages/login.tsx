import Layout from '../components/Layout';
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger signIn with credentials
        await signIn("credentials", { email, password });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Layout title="Login" backgroundImage='/images/all-peripherals.jpg'>
            <div className="min-h-screen w-full h-full flex flex-col items-center text-white text-center p-8 bg-black bg-opacity-50">
                <h1 className="text-4xl font-bold mb-4 text-center p-8">Login</h1>
                <div className="max-w-md mx-auto text-white">
                    {session ? (
                        <>
                            <p className="text-center mb-4">
                                Welcome, {session.user?.name || session.user?.email}
                            </p>
                            <button
                                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="mx-auto p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
                            <div className="mb-4">
                                <label className="block text-white">Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white">Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}
