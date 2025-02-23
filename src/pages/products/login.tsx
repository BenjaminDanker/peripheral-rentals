// src/pages/login.tsx
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
        <div>
            {session ? (
                <>
                    <p>Welcome, {session.user?.name || session.user?.email}</p>
                    <button onClick={() => signOut()}>Sign Out</button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login / Register</button>
                </form>
            )}
        </div>
    );
}
