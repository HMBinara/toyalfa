import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
            ToyAlfa
          </div>
          <p className="text-gray-400">Your one-stop premium destination for toys, games, and creative learning sets.</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Shop All</a></li>
            <li><a href="#" className="hover:text-white transition">Featured Items</a></li>
            <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Customer Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Track Order</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Returns & Exchange</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Newsletter</h4>
          <p className="mb-3">Subscribe to get special discounts and updates.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-rose-500" />
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-4 py-2 rounded-lg transition">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center text-gray-500">
        &copy; {new Date().getFullYear()} ToyAlfa. All rights reserved.
      </div>
    </footer>
  );
}