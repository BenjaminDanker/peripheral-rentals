// pages/api/products/add.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig } from 'next-multiparty';
import type { File as FormidableFile } from 'formidable';
import fs from 'fs';
import { supabaseAdmin } from '../../../lib/supabaseAdminClient';

// Extend the NextApiRequest type to include file-related properties.
// We relax the type for "files" to "any" to match what next-multiparty provides.
interface ExtendedNextApiRequest extends NextApiRequest {
    file?: FormidableFile;
    files?: any;
}

interface ProductPayload {
    name: string;
    description: string;
    price: number;
}

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('req.body:', req.body);
        console.log('req.fields:', (req as any).fields);
        console.log('req.file:', req.file);
        console.log('req.files:', req.files);

        // Use text fields from req.body, falling back to req.fields if needed
        const fields: Partial<ProductPayload> = (req.body || (req as any).fields) || {};
        const { name, description, price } = fields as ProductPayload;

        // Look for the uploaded file under the "image" field.
        const uploadedFile: FormidableFile | null =
            req.file || (req.files && req.files.image ? req.files.image[0] : null);

        if (!name || !description || !price || !uploadedFile) {
            return res.status(400).json({ error: 'Missing required fields or file.' });
        }

        // Read the file from the temporary location provided by next-multiparty
        const filePath = uploadedFile.filepath;
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = `${Date.now()}-${uploadedFile.originalFilename}`;

        // Upload the file to Supabase Storage.
        // This example uploads to the "images" bucket, under a "products" folder.
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('images')
            .upload(`products/${fileName}`, fileBuffer, {
                contentType: uploadedFile.mimetype || 'application/octet-stream',
            });

        if (uploadError) {
            console.error('Error uploading to Supabase Storage:', uploadError.message);
            return res.status(500).json({ error: 'Failed to upload file to storage.' });
        }

        // Retrieve the public URL for the uploaded file.
        const { data: urlData } = supabaseAdmin.storage
            .from('images')
            .getPublicUrl(`products/${fileName}`);
        const publicUrl = urlData?.publicUrl || '';

        // Insert product record into your Supabase DB table (assumed to be "products")
        const { data: productData, error: productError } = await supabaseAdmin
            .from('products')
            .insert({
                name,
                description,
                price,
                image: publicUrl,
            })
            .select()
            .single();

        if (productError) {
            console.error('Error inserting product:', productError.message);
            return res.status(500).json({ error: 'Failed to insert product into DB.' });
        }

        return res.status(200).json({
            message: 'Product added successfully',
            product: productData,
        });
    } catch (error: any) {
        console.error('Error handling product upload:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

// Wrap the handler with next-multiparty to handle multipart/form-data
export default withFileUpload(handler);
export const config = getConfig();
