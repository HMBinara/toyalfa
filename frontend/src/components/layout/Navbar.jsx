import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function Navbar({ onOpenAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCart, getTotalItems } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const totalItems = getTotalItems();
  const isActive = (path) => location.pathname === path;
  const handleAccount = () => isLoggedIn ? navigate('/profile') : onOpenAuth();
  const handleWishlist = () => isLoggedIn ? navigate('/profile') : onOpenAuth();

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
          ToyAlfa
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className={isActive('/') ? 'text-rose-600 font-semibold' : 'hover:text-rose-600 transition'}>Home</Link>
          <Link to="/shop" className={isActive('/shop') ? 'text-rose-600 font-semibold' : 'hover:text-rose-600 transition'}>Shop</Link>
          <Link to="/shop" className="hover:text-rose-600 transition">Categories</Link>
          <Link to="/shop?sort=newest" className="hover:text-rose-600 transition">New Arrivals</Link>
        </nav>

        <div className="flex items-center gap-5 text-gray-700">
          <button type="button" onClick={() => navigate('/shop')} title="Search products" className="hover:text-rose-600 transition"><Search size={20} /></button>
          <button type="button" onClick={handleAccount} title={isLoggedIn ? 'Open profile' : 'Sign in'} className="hover:text-rose-600 transition"><User size={20} /></button>
          <button type="button" onClick={handleWishlist} title="Wishlist" className="relative hover:text-rose-600 transition"><Heart size={20} />{wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}</button>
          
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