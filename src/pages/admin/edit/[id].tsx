import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supbaseClient";
import AdminLayout from "@/components/AdminLayout";


const EditProduct = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
        if (error) console.error("Error fetching product:", error);
        else setProduct(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        await supabase.from("products").update(product).eq("id", id);
        router.push("/admin");
    };

    if (!product.name) return <p className="text-gray-600 text-center">Loading...</p>;

    return (
        <AdminLayout>
            <div className="bg-black min-h-screen text-gray-200">
                <div className="flex flex-col items-center justify-center flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit Product</h1>

                    <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-md text-gray-600"
                            placeholder="Product Name"
                        />

                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-md text-gray-600"
                            placeholder="Product Description"
                        />

                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-md text-gray-600"
                            placeholder="Price"
                        />

                        <input
                            type="text"
                            name="image"
                            value={product.image}
                            onChange={handleChange}
                            className="border p-2 w-full rounded-md text-gray-600"
                            placeholder="Image URL"
                        />

                        {product.image && <img src={product.image} alt="Preview" className="w-full h-40 object-cover rounded-md" />}

                        <button onClick={handleUpdate} className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600">
                            Update Product
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditProduct;
