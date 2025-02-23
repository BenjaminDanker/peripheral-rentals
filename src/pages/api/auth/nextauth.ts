// src/pages/api/auth/[...nextauth].ts
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';

export interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string | null;
}

export interface Credentials {
    email: string;
    password: string;
}

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials?: Credentials): Promise<User | null> {
                if (!credentials) return null;

                // Fetch the user from your Supabase 'users' table.
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (error || !user) {
                    return null;
                }

                // (Optional) Verify the password here if needed.

                // The returned `user` object will include the auto-generated id.
                return user as User;
            }
        }),
        // Add other providers as needed.
    ],
    callbacks: {
        // Optionally include the user ID in your session:
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    // Optional: add additional NextAuth configuration options.
});
