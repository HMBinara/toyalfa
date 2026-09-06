import React from 'react';
import { ShoppingBag, Search, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Navbar() {
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
          ToyAlfa
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="text-rose-600 font-semibold">Home</a>
          <a href="#" className="hover:text-rose-600 transition">Shop</a>
          <a href="#" className="hover:text-rose-600 transition">Categories</a>
          <a href="#" className="hover:text-rose-600 transition">New Arrivals</a>
        </nav>

        <div className="flex items-center gap-5 text-gray-700">
          <Search size={20} className="cursor-pointer hover:text-rose-600 transition" />
          <User size={20} className="cursor-pointer hover:text-rose-600 transition" />
          
          <div onClick={openCart} className="relative cursor-pointer hover:text-rose-600 transition">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}