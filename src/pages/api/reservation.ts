import type { NextApiRequest, NextApiResponse } from 'next';

const reservations: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, mobile, date, mealType, specialOccasion, isGift } = req.body;

        if (!name || !mobile || !date || !mealType || !isGift) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        try {
            const newReservation = {
                id: reservations.length + 1,
                name,
                mobile,
                date,
                mealType,
                specialOccasion,
                isGift,
                createdAt: new Date(),
            };

            reservations.push(newReservation);

            return res.status(201).json({ success: true, data: newReservation });
        } catch (error) {
            console.error('Error saving reservation:', error);
            return res.status(500).json({ success: false, error: 'Failed to save reservation' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
    }
}
