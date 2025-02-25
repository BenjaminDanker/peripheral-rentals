import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supbaseClient";
import AdminLayout from "../../components/AdminLayout";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

const AdminPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
            setFilteredProducts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [search, products]);

    const deleteProduct = async (id: string) => {
        console.log(`Delete button clicked for product ID: ${id}`);

        // ✅ Ensure ID is passed correctly
        const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
            method: "DELETE",
        });

        const result = await response.json();
        console.log("Delete API response:", result);

        if (response.ok) {
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            setFilteredProducts((prevFiltered) => prevFiltered.filter((product) => product.id !== id));
        } else {
            console.error("Failed to delete product:", result.error);
        }
    };

    if (loading) return <p className="text-gray-400 text-center">Loading products...</p>;

    return (
        <AdminLayout>
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-200 text-center mb-4">Manage Products</h1>
                <Link
                    href="/admin/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
                >
                    Add Product
                </Link>

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-200 w-full max-w-md"
                />
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg">
                            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
                            <h3 className="text-lg font-bold text-gray-200">{product.name}</h3>
                            <p className="text-gray-400">{product.description}</p>
                            <p className="mt-2 font-semibold text-gray-300">${product.price} / day</p>

                            <div className="mt-4 flex justify-between">
                                <Link href={`/admin/edit/${product.id}`} className="text-blue-400 hover:underline">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center w-full">No products found.</p>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPage;
