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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase.from("products").select("*");
        if (error) console.error("Error fetching products:", error);
        else {
            setProducts(data || []);
            setFilteredProducts(data || []);
        }
    };

    // Search Filter
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const deleteProduct = async (id: string) => {
        await supabase.from("products").delete().eq("id", id);
        setProducts(products.filter((product) => product.id !== id));
        setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-200 text-center mb-6">Manage Products</h1>

            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={handleSearch}
                    className="p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-200 w-full max-w-md"
                />
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-gray-800 border border-gray-700 shadow-lg p-4 rounded-lg">
                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
                        <h3 className="text-lg font-bold text-gray-200">{product.name}</h3>
                        <p className="text-gray-400">{product.description}</p>
                        <p className="mt-2 font-semibold text-gray-300">${product.price} / day</p>

                        <div className="mt-4 flex justify-between">
                            <Link href={`/admin/edit/${product.id}`} className="text-blue-400 hover:underline">
                                Edit
                            </Link>
                            <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminPage;
