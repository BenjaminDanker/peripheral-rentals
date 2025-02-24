import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supbaseClient"; // Supabase client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // Extract query parameters with defaults
        const { searchTerm = '', minPrice, maxPrice, page = '1', limit = '9' } = req.query;

        // Convert page and limit to numbers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const from = (pageNumber - 1) * pageSize;
        // Query one extra item to check if there's a next page
        const to = from + pageSize; // Inclusive: will return (pageSize + 1) items if available

        // Build the base query
        let query = supabase.from("products").select("*");

        // Apply search term filter (case-insensitive)
        if (searchTerm) {
            query = query.ilike("name", `%${searchTerm}%`);
        }

        // Apply minimum price filter if provided
        if (minPrice) {
            query = query.gte("price", parseFloat(minPrice as string));
        }

        // Apply maximum price filter if provided
        if (maxPrice) {
            query = query.lte("price", parseFloat(maxPrice as string));
        }

        // Apply pagination
        query = query.range(from, to);

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });

        let hasMore = false;
        let products = data;
        // If we received one extra product, then there is a next page.
        if (data.length > pageSize) {
            hasMore = true;
            products = data.slice(0, pageSize);
        }

        return res.status(200).json({
            products,
            page: pageNumber,
            hasMore,
        });
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
