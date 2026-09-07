// frontend/src/pages/HomePage.jsx
import { useState } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoBanner from '../components/home/PromoBanner';
import ProductGrid from '../components/home/ProductGrid';
import ProductDetailModal from '../components/common/ProductDetailModal';
import { CATEGORIES, FEATURED_PRODUCTS } from '../data/mockData';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="font-sans">
        <HeroBanner />
        <CategoryGrid categories={CATEGORIES} />
        <PromoBanner />
        <ProductGrid 
          products={FEATURED_PRODUCTS} 
          onSelectProduct={(product) => setSelectedProduct(product)} 
        />
      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}