// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

// Use an environment variable for salt rounds or default to 10
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password, username, firstname, lastname } = req.body;

    // Validate required fields
    if (!email || !password || !username || !firstname || !lastname) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the email already exists in the database
    const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email);

    if (checkError) {
        return res
            .status(500)
            .json({ error: "Database error during user lookup" });
    }

    if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password using bcrypt
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (hashError) {
        return res.status(500).json({ error: "Error hashing password" });
    }

    // Insert the new user into the database, storing the hashed password
    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                email,
                password: hashedPassword,
                username,
                firstname,
                lastname,
            },
        ])
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    // After checking error and ensuring data exists:
    if (!data) {
        return res.status(500).json({ error: "No data returned from database" });
    }

    // Assert that data is an object with a password property
    const userData = data as { password: string;[key: string]: any };
    const { password: _removed, ...safeUser } = userData;

    res.status(200).json({ user: safeUser });

}
