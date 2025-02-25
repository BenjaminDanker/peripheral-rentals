// /pages/admin/add.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";

const AddProductPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name || !description || !price || !imageFile) {
            setErrorMsg("Please fill out all fields and select an image.");
            return;
        }

        try {
            setLoading(true);
            // Build FormData
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("image", imageFile);

            const response = await fetch("/api/products/add", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to add product");
            }

            // Success: redirect or show message
            router.push("/admin");
        } catch (error: any) {
            console.error("Add product error:", error);
            setErrorMsg(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-md mx-auto mt-10 bg-gray-800 p-6 rounded-md">
                <h1 className="text-2xl font-bold text-gray-200 mb-4">Add Product</h1>
                {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-1" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full p-2 rounded bg-gray-700 text-gray-200 border border-gray-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Product Name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-1" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="w-full p-2 rounded bg-gray-700 text-gray-200 border border-gray-600"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Product Description"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-1" htmlFor="price">
                            Price (per day)
                        </label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            className="w-full p-2 rounded bg-gray-700 text-gray-200 border border-gray-600"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="19.99"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-1" htmlFor="image">
                            Image
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            className="w-full text-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddProductPage;
