import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE! 
);

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        role: string;
    }

    interface Session {
        user: User;
    }

    interface JWT {
        id: string;
        role: string;
    }
}

export default NextAuth({
    debug: true, // ✅ Enable Debugging to Log Errors
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "admin@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            if (!credentials) throw new Error("Missing credentials.");
  
            const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password
            });
  
            if (authError || !authData.user) {
              console.error("Auth Error:", authError?.message);
              throw new Error("Invalid email or password.");
            }
  
            // ✅ Check if user is verified
            if (!authData.user.confirmed_at) {
              throw new Error("Please verify your email before logging in.");
            }
  
            // ✅ Fetch user role
            const { data: userData, error: userError } = await supabaseAdmin
              .from("users")
              .select("id, email, role")
              .eq("id", authData.user.id)
              .single();
  
            if (userError || !userData) {
              console.error("Database Error:", userError?.message);
              throw new Error("Error fetching user data.");
            }
  
            return userData;
  
          } catch (error) {
            if (error instanceof Error) {
              console.error("Login Error:", error.message);
              throw new Error(error.message); // ✅ Sends error to `/auth/error`
            } else {
              console.error("Login Error:", error);
              throw new Error("An unknown error occurred.");
            }
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/auth/admin-login",
      error: "/auth/error", // ✅ Custom error page
    },
  });