import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Truck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, getTotalPrice } = useCartStore();
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 size={56} className="text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
            <p className="text-xs text-gray-500">Thank you for shopping with ToyAlfa. We are preparing your shipment.</p>
            <button 
              onClick={() => { setSubmitted(false); onClose(); }} 
              className="bg-rose-500 text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-rose-600 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Complete Your Order</h2>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Full Name</label>
                <input required type="text" placeholder="John Doe" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-rose-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Email</label>
                  <input required type="email" placeholder="john@example.com" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Phone</label>
                  <input required type="tel" placeholder="+94 7X XXX XXXX" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-rose-500" />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium">Shipping Address</label>
                <input required type="text" placeholder="123 Street Name, City" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-rose-500" />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between text-xs font-bold text-gray-900">
              <span>Total Payable Amount</span>
              <span className="text-rose-600">${getTotalPrice().toFixed(2)}</span>
            </div>

            <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl text-xs shadow-sm transition">
              Place Order Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}