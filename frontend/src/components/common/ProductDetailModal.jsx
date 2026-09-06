import React from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function ProductDetailModal({ product, onClose }) {
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 overflow-hidden flex flex-col md:flex-row gap-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition z-20"
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{product.name}</h2>
            
            <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
              <Star size={14} fill="currentColor" />
              <span className="font-semibold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount} customer reviews)</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Premium grade materials built for durability and high performance. Perfect addition to your collection.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 border-t border-b border-gray-100 py-2">
              <span className="flex items-center gap-1"><Truck size={14} className="text-rose-500"/> Fast Delivery</span>
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-rose-500"/> Verified Quality</span>
            </div>

            <button 
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <ShoppingBag size={16} /> Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}