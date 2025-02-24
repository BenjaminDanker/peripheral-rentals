import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "../../../lib/supabaseAdminClient";

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
  debug: true, // Enable debugging to log errors and flow
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        try {
          if (!credentials) throw new Error("Missing credentials.");

          const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          console.log("Auth response from Supabase:", { authData, authError });

          if (authError || !authData.user) {
            console.error("Auth Error:", authError?.message);
            throw new Error("Invalid email or password.");
          }

          // Check if user is verified
          if (!authData.user.confirmed_at) {
            console.error("User email not verified:", authData.user);
            throw new Error("Please verify your email before logging in.");
          }

          // Fetch user role from your database
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("id, email, role")
            .eq("id", authData.user.id)
            .single();

          console.log("Fetched user data:", { userData, userError });

          if (userError || !userData) {
            console.error("Database Error:", userError?.message);
            throw new Error("Error fetching user data.");
          }

          return userData;
        } catch (error) {
          if (error instanceof Error) {
            console.error("Login Error:", error.message);
            throw new Error(error.message);
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
      console.log("JWT callback - before:", { token, user });
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log("JWT callback - after:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - before:", { session, token });
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      console.log("Session callback - after:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/admin-login",
    error: "/auth/error", // Custom error page
  },
});
