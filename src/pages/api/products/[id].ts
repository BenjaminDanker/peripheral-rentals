import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdminClient"; // Use the admin client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const productId = Array.isArray(id) ? id[0] : id; // Ensure ID is always a string

    console.log(`Incoming API request: ${req.method} /api/products/${productId}`);

    if (!productId) {
        console.error("❌ Missing product ID");
        return res.status(400).json({ error: "Missing product ID" });
    }

    if (req.method === "PUT") {
        // Update product
        const { name, description, price, image } = req.body;
        console.log(`🚀 Updating product with ID: ${productId}`);

        const { data, error } = await supabaseAdmin
            .from("products")
            .update({ name, description, price, image })
            .eq("id", productId)
            .select(); // Ensures data is returned

        console.log(`Supabase UPDATE Response:`, { data, error });

        if (error) {
            console.error("❌ Supabase UPDATE Error:", error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            console.warn(`⚠️ Product with ID ${productId} not found or not updated.`);
            return res.status(404).json({ error: "Product not found or not updated" });
        }

        return res.status(200).json({ message: "Product updated", data });
    }

    if (req.method === "DELETE") {
        console.log(`🚀 Attempting to delete product with ID: ${productId}`);

        // Run delete query using the admin client
        const { data, error } = await supabaseAdmin
            .from("products")
            .delete()
            .eq("id", productId)
            .select(); // Ensures data is returned

        console.log(`Supabase DELETE Response:`, { data, error });

        if (error) {
            console.error("❌ Supabase DELETE Error:", error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            console.warn(`⚠️ Product with ID ${productId} not found in Supabase.`);
            return res.status(404).json({ error: "Product not found or not deleted" });
        }

        console.log(`✅ Product ${productId} deleted successfully.`);
        return res.status(200).json({ message: "Product deleted", data });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
