import Layout from '../components/Layout';
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: "",
        firstname: "",
        lastname: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }
            // Registration succeeded. Optionally, automatically sign in:
            await signIn("credentials", {
                email: form.email,
                password: form.password,
                callbackUrl: "/",
            });
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <Layout title="Register" backgroundImage='/images/all-peripherals.jpg'>
            <div className="min-h-screen w-full h-full flex flex-col items-center text-white text-center p-8 bg-black bg-opacity-50">
                <h1 className="text-4xl font-bold mb-4 text-center p-8">Register</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="max-w-md mx-auto text-white">
                    <form onSubmit={handleSubmit} className="mx-auto p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
                        <div className="mb-4">
                            <label className="block text-white">Username:</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white">First Name:</label>
                            <input
                                name="firstname"
                                value={form.firstname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white">Last Name:</label>
                            <input
                                name="lastname"
                                value={form.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white">Email:</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white">Password:</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
