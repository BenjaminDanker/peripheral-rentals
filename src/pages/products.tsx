// src/pages/products.tsx
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supbaseClient';
import { Product } from '../types/product';

export async function getStaticProps() {
    const { data: products, error } = await supabase.from('products').select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return { props: { products: [] }, revalidate: 10 };
    }

    return {
        props: { products },
        revalidate: 10,
    };
}

interface ProductsPageProps {
    products: Product[];
}

export default function ProductsPage({ products }: ProductsPageProps) {
    return (
        <Layout title="Products" backgroundImage="/images/all-peripherals.jpg">
            <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Available Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}