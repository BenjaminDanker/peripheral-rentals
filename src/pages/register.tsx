// src/pages/register.tsx
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
        <div>
            <h1>Register</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
