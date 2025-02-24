import Head from 'next/head';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

interface LayoutProps {
    title?: string;
    backgroundImage?: string;
    children: ReactNode;
}

export default function Layout({ title, children, backgroundImage }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Head>
                <title>
                    {title ? `${title} | Peripherals Rentals` : 'Peripherals Rentals'}
                </title>
                <meta name="description" content="Peripherals Rentals" />
            </Head>

            <Navbar />

            <main
                className="flex-grow w-full text-white bg-black "
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {children}
            </main>

            <footer className="p-4 bg-gray-800 text-center text-gray-300">
                <p>
                    &copy; {new Date().getFullYear()} Rental Service &nbsp;|&nbsp;
                    <Link href="/admin" className="text-blue-400 hover:underline">
                        Admin Panel
                    </Link>
                </p>
            </footer>
        </div>
    );
}
