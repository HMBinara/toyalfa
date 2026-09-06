import React from 'react';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function ProductCard({ product, onSelectProduct }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        <div 
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="relative bg-gray-50 aspect-square flex items-center justify-center overflow-hidden cursor-pointer"
        >
          {product.badge && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold bg-rose-500 text-white px-2.5 py-0.5 rounded-full z-10 shadow-sm">
              {product.badge}
            </span>
          )}
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-rose-500 transition opacity-0 group-hover:opacity-100 z-10 shadow-sm">
            <Heart size={16} />
          </button>
          
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
        </div>

        <div className="p-4 space-y-2">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{product.category}</span>
          <h3 
            onClick={() => onSelectProduct && onSelectProduct(product)}
            className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-rose-600 transition cursor-pointer"
          >
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <Star size={14} fill="currentColor" />
            <span className="font-medium text-gray-700 ml-0.5">{product.rating}</span>
            <span className="text-gray-400 text-[11px]">({product.reviewsCount})</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="p-2.5 bg-gray-900 hover:bg-rose-600 text-white rounded-lg transition shadow-sm active:scale-95"
          title="Add to Cart"
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  );
}