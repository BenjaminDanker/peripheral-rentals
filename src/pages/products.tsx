// src/pages/products.tsx
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/product';

export default function ProductsPage() {
    // States for search term, price filters, products, pagination, and flag for more products
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const limit = 9; // Maximum cards per page

    // Fetch products based on filters and pagination
    useEffect(() => {
        async function fetchProducts() {
            const query = new URLSearchParams({
                searchTerm,
                minPrice,
                maxPrice,
                page: page.toString(),
                limit: limit.toString(),
            });
            const res = await fetch(`/api/products?${query.toString()}`);
            const data = await res.json();
            setProducts(data.products);
            setHasMore(data.hasMore);
        }
        fetchProducts();
    }, [searchTerm, minPrice, maxPrice, page]);

    return (
        <Layout title="Products" backgroundImage="/images/all-peripherals.jpg">
            <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Available Products</h2>
                {/* Filter Section */}
                <div className="mb-4 max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset to page 1 on filter change
                        }}
                        className="p-2 rounded bg-gray-800 text-gray-200 w-full"
                    />
                    <div className="mt-2 flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => {
                                setMinPrice(e.target.value);
                                setPage(1);
                            }}
                            className="p-2 rounded bg-gray-800 text-gray-200 w-1/2"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => {
                                setMaxPrice(e.target.value);
                                setPage(1);
                            }}
                            className="p-2 rounded bg-gray-800 text-gray-200 w-1/2"
                        />
                    </div>
                </div>
                {/* Display Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-gray-700 text-white rounded mr-2 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={!hasMore}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
}
