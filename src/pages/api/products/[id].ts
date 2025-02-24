import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supbaseClient"; // Supabase client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "PUT") {
        // Update product
        const { name, description, price, image } = req.body;
        const { error } = await supabase
            .from("products")
            .update({ name, description, price, image })
            .eq("id", id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: "Product updated" });
    }

    if (req.method === "DELETE") {
        // Delete product
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: "Product deleted" });
    }

    res.status(405).json({ message: "Method Not Allowed" });
}
