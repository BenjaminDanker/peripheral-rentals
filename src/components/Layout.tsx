import Head from 'next/head'
import { ReactNode } from 'react'
import Navbar from './Navbar'

interface LayoutProps {
    title?: string
    children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>{title ? `${title} | Rental Service` : 'Rental Service'}</title>
                <meta name="description" content="Peripheral rental service" />
            </Head>
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <footer className="p-4 bg-gray-800 text-center">
                &copy; {new Date().getFullYear()} Rental Service
            </footer>
        </div>
    )
}

export default Layout
