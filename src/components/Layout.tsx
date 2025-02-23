import Head from 'next/head';
import { ReactNode } from 'react';
import Navbar from './Navbar';

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

            {/* Apply background image here */}
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

            <footer className="p-4 bg-gray-800 text-center text-white">
                &copy; {new Date().getFullYear()} Rental Service
            </footer>
        </div>
    );
}
