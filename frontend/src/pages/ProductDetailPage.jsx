import { useState } from 'react';
import { ArrowLeft, ChevronDown, ShoppingBag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import StarRating from '../components/common/StarRating';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProductStore((state) => state.getProductById(id));
  const products = useProductStore((state) => state.products);
  const reviews = useProductStore((state) => state.getReviews(id));
  const addReview = useProductStore((state) => state.addReview);
  const addToCart = useCartStore((state) => state.addToCart);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [openSection, setOpenSection] = useState('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <button onClick={() => navigate('/shop')} className="mt-5 text-sm font-semibold text-rose-600 hover:text-rose-700">Return to shop</button>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart');
  };

  const handleReview = (event) => {
    event.preventDefault();
    if (!reviewRating || !reviewComment.trim()) return;
    addReview(product.id, { author: 'You', rating: reviewRating, date: new Date().toISOString().split('T')[0], comment: reviewComment.trim() });
    setReviewRating(0);
    setReviewComment('');
    toast.success('Thanks for sharing your review');
  };

  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const sections = [
    ['description', 'Description', <p key="description" className="text-sm text-gray-600 leading-7">{product.description}</p>],
    ['specs', 'Specifications', <dl key="specs" className="grid grid-cols-2 gap-4">{Object.entries(product.specs || {}).map(([label, value]) => <div key={label}><dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt><dd className="text-sm font-medium text-gray-800 mt-1">{value}</dd></div>)}</dl>],
    ['reviews', `Customer reviews (${reviews.length})`, <div key="reviews" className="space-y-5">{reviews.map((review) => <div key={review.id} className="border-b border-gray-100 pb-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-gray-900">{review.author}</p><span className="text-xs text-gray-400">{review.date}</span></div><StarRating value={review.rating} readonly size={14} /><p className="text-sm text-gray-600 mt-2">{review.comment}</p></div>)}<form onSubmit={handleReview} className="space-y-3 pt-2"><p className="text-sm font-semibold text-gray-900">Leave a review</p><StarRating value={reviewRating} onChange={setReviewRating} size={20} /><textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Share your experience" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-20 outline-none focus:border-rose-400" /><button disabled={!reviewRating || !reviewComment.trim()} className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg px-4 py-2">Submit review</button></form></div>],
  ];

  return (
    <main className="max-w-7xl mx-auto w-full px-6 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 mb-8"><ArrowLeft size={16} /> Back</button>
        <div className="grid lg:grid-cols-2 gap-12">
          <div><div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square"><img src={(product.images || [product.image])[galleryIndex]} alt={product.name} className="w-full h-full object-cover" /></div><div className="flex gap-3 mt-3">{(product.images || [product.image]).map((image, index) => <button key={image} onClick={() => setGalleryIndex(index)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${galleryIndex === index ? 'border-rose-500' : 'border-transparent'}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" /></button>)}</div></div>
          <div className="py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>
            <div className="flex items-center gap-3 mt-4"><StarRating value={product.rating} readonly size={17} /><span className="text-sm text-gray-500">{product.rating} ({product.reviewsCount} reviews)</span></div>
            <div className="flex items-baseline gap-3 mt-7"><span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>{product.originalPrice && <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}</div>
            <div className="mt-7 flex items-center gap-3"><button onClick={handleAddToCart} disabled={product.stock === 0} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-rose-600 disabled:bg-gray-300 text-white font-semibold rounded-lg px-6 py-3 transition"><ShoppingBag size={18} /> {product.stock === 0 ? 'Out of stock' : 'Add to cart'}</button><span className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}</span></div>
            <div className="border-t border-gray-100 mt-9">{sections.map(([key, title, content]) => <div key={key} className="border-b border-gray-100"><button onClick={() => setOpenSection(openSection === key ? '' : key)} className="w-full flex items-center justify-between py-4 text-sm font-semibold text-gray-900">{title}<ChevronDown size={17} className={`transition ${openSection === key ? 'rotate-180 text-rose-500' : 'text-gray-400'}`} /></button>{openSection === key && <div className="pb-5">{content}</div>}</div>)}</div>
          </div>
        </div>
        {relatedProducts.length > 0 && <section className="mt-16"><h2 className="text-xl font-bold text-gray-900 mb-5">You might also like</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </main>
  );
}