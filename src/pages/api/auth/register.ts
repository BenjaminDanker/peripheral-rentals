import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supbaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password, username, firstname, lastname } = req.body;
    const normalizedEmail = email.toLowerCase();

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
            data: {
                username,
                firstname,
                lastname
            }
        }
    });

    if (authError) {
        return res.status(400).json({ error: authError.message });
    }

    return res.status(200).json({ message: "Check your email to verify your account!" });
}
