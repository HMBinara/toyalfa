import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function ProductCard({ product, onSelectProduct, onAddToCart, onToggleWishlist, onQuickView }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const handleCardClick = () => {
    if (onQuickView || onSelectProduct) {
      (onQuickView || onSelectProduct)(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    onAddToCart?.(product);
    toast.success(`${product.name.slice(0, 28)}… added to cart!`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    const added = toggleWishlist(product);
    onToggleWishlist?.(product, added);
    if (added) {
      toast.success('Added to wishlist ❤️');
    } else {
      toast('Removed from wishlist', { icon: '🤍' });
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer">
      <div>
        <div
          onClick={handleCardClick}
          className="relative bg-gray-50 aspect-square flex items-center justify-center overflow-hidden"
        >
          {product.badge && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold bg-rose-500 text-white px-2.5 py-0.5 rounded-full z-10 shadow-sm">
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold bg-gray-700 text-white px-2.5 py-0.5 rounded-full z-10">
              Out of Stock
            </span>
          )}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full transition opacity-0 group-hover:opacity-100 z-10 shadow-sm ${
              wishlisted ? 'text-rose-500 opacity-100' : 'text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition duration-500 ${isOutOfStock ? 'opacity-60' : ''}`}
          />
        </div>

        <div className="p-4 space-y-1.5" onClick={handleCardClick}>
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{product.category}</span>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-rose-600 transition">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <Star size={13} fill="currentColor" />
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
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="p-2.5 bg-gray-900 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition shadow-sm active:scale-95"
          title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </div>
  );
}