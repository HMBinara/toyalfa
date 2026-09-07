import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { useProductStore } from '../store/productStore';

const SORT_OPTIONS = [['featured', 'Featured'], ['price-low', 'Price: Low to High'], ['price-high', 'Price: High to Low'], ['newest', 'Newest'], ['rating', 'Top Rated']];

function FilterContent({ categories, selectedCategory, toggleCategory, price, setPrice, rating, setRating, inStockOnly, setInStockOnly }) {
    return <div className="space-y-7"><div><h3 className="text-sm font-semibold text-gray-900 mb-3">Price range</h3><input type="range" min="0" max="120" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="w-full accent-rose-500" /><div className="flex justify-between text-xs text-gray-500 mt-2"><span>$0</span><span>Up to ${price}</span></div></div><div><h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3><div className="space-y-2">{categories.map((category) => <label key={category} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" checked={selectedCategory === category} onChange={() => toggleCategory(category)} className="accent-rose-500" />{category}</label>)}</div></div><div><h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3><select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-400"><option value="0">Any rating</option><option value="4">4 stars & up</option><option value="4.5">4.5 stars & up</option></select></div><label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer"><span>In stock only</span><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="accent-rose-500 w-4 h-4" /></label></div>;
}

export default function ShopPage() {
    const products = useProductStore((state) => state.products);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    const filterParam = searchParams.get('filter');
    
    const [price, setPrice] = useState(120);
    const [rating, setRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);
    
    useEffect(() => { const timer = setTimeout(() => setLoading(false), 250); return () => clearTimeout(timer); }, []);
    
    const activeSort = sortParam || (filterParam === 'new' ? 'newest' : 'featured');
    
    const visibleProducts = useMemo(() => {
        const filtered = products.filter((product) => product.price <= price && product.rating >= rating && (!inStockOnly || product.stock > 0) && (!categoryParam || product.category === categoryParam));
        return [...filtered].sort((a, b) => { if (activeSort === 'price-low') return a.price - b.price; if (activeSort === 'price-high') return b.price - a.price; if (activeSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt); if (activeSort === 'rating') return b.rating - a.rating; return Number(b.isFeatured) - Number(a.isFeatured); });
    }, [products, price, rating, inStockOnly, categoryParam, activeSort]);
    
    const toggleCategory = (category) => {
        const nextParams = new URLSearchParams(searchParams);
        if (categoryParam === category) {
            nextParams.delete('category');
        } else {
            nextParams.set('category', category);
        }
        setSearchParams(nextParams, { replace: true });
    };
    
    const setSortValue = (nextSort) => {
        const nextParams = new URLSearchParams(searchParams);
        if (nextSort === 'featured' || !nextSort) {
            nextParams.delete('sort');
        } else {
            nextParams.set('sort', nextSort);
        }
        nextParams.delete('filter');
        setSearchParams(nextParams, { replace: true });
    };
    
    const clearFilters = () => {
        setPrice(120);
        setRating(0);
        setInStockOnly(false);
        setSearchParams({}, { replace: true });
    };
    
    const filterProps = { categories, selectedCategory: categoryParam, toggleCategory, price, setPrice, rating, setRating, inStockOnly, setInStockOnly };

    return <div className="min-h-screen bg-white text-gray-800"><main className="max-w-7xl mx-auto w-full px-6 py-10"><div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"><div><p className="text-sm text-rose-500 font-semibold">Explore the collection</p><h1 className="text-3xl font-bold text-gray-900 mt-1">Shop all toys</h1><p className="text-sm text-gray-500 mt-2">{visibleProducts.length} products ready for play.</p></div><div className="flex items-center gap-3"><button onClick={() => setFiltersOpen(true)} className="md:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium"><Filter size={16} /> Filters</button><label className="flex items-center gap-2 text-sm text-gray-500">Sort by<select value={activeSort} onChange={(event) => setSortValue(event.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-rose-400">{SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button type="button" onClick={clearFilters} className="text-xs font-semibold text-rose-600 hover:text-rose-700">Clear filters</button></div></div><div className="grid lg:grid-cols-[230px_1fr] gap-8"><aside className="hidden md:block border-r border-gray-100 pr-6"><div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold"><SlidersHorizontal size={17} /> Filters</div><FilterContent {...filterProps} /></aside><section className="min-w-0">{loading ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div> : visibleProducts.length ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="border border-dashed border-gray-200 rounded-xl py-20 text-center"><p className="font-semibold text-gray-900">No products match these filters.</p><p className="text-sm text-gray-500 mt-2">Try widening your price range or clearing a category.</p></div>}</section></div></main>{filtersOpen && <div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} /><aside className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white p-6 shadow-xl overflow-y-auto"><div className="flex items-center justify-between mb-7"><h2 className="font-semibold text-gray-900">Filters</h2><button onClick={() => setFiltersOpen(false)} className="text-gray-500"><X size={19} /></button></div><FilterContent {...filterProps} /></aside></div>}</div>;
}