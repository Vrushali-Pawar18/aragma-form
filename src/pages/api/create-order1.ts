
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    console.log("vvvvvvvvvvvvvv");
    
    const { amount,currency} = await req.json();
    console.log("amount",amount);
    
    try {
        const order=await razorpay.orders.create({
            amount,
            currency,
            receipt: `receipt_${Date.now()}`,
        });
        console.log("order",order);
        
        return NextResponse.json({ order: order }, { status: 200 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }

}
