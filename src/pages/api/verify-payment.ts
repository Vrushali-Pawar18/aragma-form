import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, currency, amount } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        const key_secret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!;
        if (!key_secret) {
            throw new Error('RAZORPAY_KEY_SECRET is not defined');
        }

        const hmac = crypto.createHmac('sha256', key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (hmac === razorpay_signature) {
            const razorpayResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}`).toString('base64')}`
                }
            });

            const paymentDetails = await razorpayResponse.json();

            if (paymentDetails.status === 'captured') {
                const amountInDollar = paymentDetails.amount / 100;
                const paymentData = {
                    razorpay_payment_id,
                    razorpay_order_id: paymentDetails.order_id,
                    razorpay_signature,
                    amount: amountInDollar.toString(),
                    currency: paymentDetails.currency,
                    status: 'paid',
                };

                const API_URL = process.env.NEXT_PUBLIC_SERVICE_BASE_URL!;
                const SERVICE_API = process.env.NEXT_PUBLIC_SERVICE_API!;

                const addFundRes = await fetch(`${API_URL}/${SERVICE_API}/add-funds/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(paymentData),
                });

                const addFundResBody = await addFundRes.json();

                if (addFundRes.ok) {
                    return res.status(200).json({ success: true });
                } else {
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to send data to third-party backend',
                        addFundResBody,
                    });
                }
            }
        } else {
            return res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ success: false, error: 'Failed to verify payment' });
    }
}
