// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from "./contexts/CartContext";
import { SessionProvider as AuthProvider } from "next-auth/react";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider session={pageProps.session}>
            <CartProvider>
                <Component {...pageProps} />
            </CartProvider>
        </AuthProvider>
    );
}