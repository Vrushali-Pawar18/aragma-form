
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';


const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
});
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, currency } = req.body; 

   try {
           const order=await razorpay.orders.create({
               amount,
               currency,
               receipt: `receipt_${Date.now()}`,
           });
           res.status(200).send({ order })
       } catch (error) {
           console.error('Error creating order:', error);
           return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
       }

    
  } else {
    res.status(500).json({ error: 'failed to load data' })
  }
}