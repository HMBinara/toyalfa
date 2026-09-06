// frontend/src/pages/HomePage.jsx
import React, { useState } from 'react';
import TopAnnouncement from '../components/layout/TopAnnouncement';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoBanner from '../components/home/PromoBanner';
import ProductGrid from '../components/home/ProductGrid';
import CartDrawer from '../components/cart/CartDrawer';
import ProductDetailModal from '../components/common/ProductDetailModal';
import { CATEGORIES, FEATURED_PRODUCTS } from '../data/mockData';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col justify-between">
      {/* Main Page Layout */}
      <div>
        <TopAnnouncement />
        <Navbar />
        <HeroBanner />
        <CategoryGrid categories={CATEGORIES} />
        <PromoBanner />
        <ProductGrid 
          products={FEATURED_PRODUCTS} 
          onSelectProduct={(product) => setSelectedProduct(product)} 
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Slide-Over Cart & Quick View Modals */}
      <CartDrawer />
      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}