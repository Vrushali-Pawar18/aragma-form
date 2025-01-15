import React, { useState } from "react";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    date: "",
    mealType: "",
    specialOccasion: "",
    isGift: "",
  });

  const [loading, setLoading] = useState(false);
  const [revalidateBalance, setRevalidateBalance] = useState<boolean>(false)


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const reservationResponse = await fetch('/api/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const reservationResult = await reservationResponse.json();

        if (!reservationResult.success) {
            throw new Error(reservationResult.error || 'Failed to save reservation');
        }

        const amount = 5000;
        const orderResponse = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amount, currency: 'USD' }),
        });

        const order = await orderResponse.json();

        if (!order.order?.id) {
            throw new Error('Order creation failed');
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: order.order.amount,
            currency: order.order.currency,
            order_id: order.order.id,
            handler: async (response: any) => {
                response.currency = order.order.amount;

                const verifyResponse = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(response),
                });

                const result = await verifyResponse.json();

                if (result.success) {
                    setLoading(false);
                    setRevalidateBalance((prev) => !prev);
                    alert('Payment Successful and Verified!');
                } else {
                    setLoading(false);
                    setRevalidateBalance((prev) => !prev);
                    alert('Payment verification failed.');
                }
            },
            theme: {
                color: '#3399cc',
            },
        };

        if (!(window as any).Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            };
            document.body.appendChild(script);
        } else {
            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        }
    } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment initiation failed.');
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Reservation Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="123-456-7890"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Meal Type */}
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">
              Meal Type
            </label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select...</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          {/* Special Occasion */}
          <div>
            <label
              htmlFor="specialOccasion"
              className="block text-sm font-medium text-gray-700"
            >
              Special Occasion or Allergies
            </label>
            <textarea
              id="specialOccasion"
              name="specialOccasion"
              value={formData.specialOccasion}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Let us know if you are celebrating something or have allergies"
              rows={3}
            ></textarea>
          </div>

          {/* Is Gift */}
          <div>
            <label htmlFor="isGift" className="block text-sm font-medium text-gray-700">
              Is this experience a gift for someone?
            </label>
            <select
              id="isGift"
              name="isGift"
              value={formData.isGift}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
