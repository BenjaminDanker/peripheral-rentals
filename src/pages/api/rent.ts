import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // In a real app, you'd handle database updates, payment processing, etc.
        const { productId, rentalPeriod } = req.body
        return res.status(200).json({ message: 'Rental booked successfully', productId, rentalPeriod })
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}