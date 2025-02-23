// src/pages/index.tsx
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
    return (
        <Layout title="Home">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Store!</h1>
                <p className="mb-8">Discover amazing products and exclusive deals.</p>
                <Link href="/products" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Browse Products
                </Link>
            </div>
        </Layout>
    );
}