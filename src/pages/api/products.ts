import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supbaseClient"; // Supabase client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // Fetch products
        const { data, error } = await supabase.from("products").select("*");
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === "POST") {
        // Add product
        const { name, description, price, image } = req.body;
        const { data, error } = await supabase
            .from("products")
            .insert([{ name, description, price, image }])
            .select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data[0]);
    }

    res.status(405).json({ message: "Method Not Allowed" });
}
