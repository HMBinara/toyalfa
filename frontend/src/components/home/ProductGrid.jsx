import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';

export default function ProductGrid({ products, onSelectProduct }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
        <a href="#" className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1">
          View All <ArrowRight size={14} />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
}