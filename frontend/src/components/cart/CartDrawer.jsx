import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, getSubtotal } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-rose-500" />
                <h2 className="text-lg font-bold text-gray-900">Your Shopping Cart</h2>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-white" />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                      <span className="text-xs font-bold text-rose-600">${item.price.toFixed(2)}</span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-semibold text-gray-800 px-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-100"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Subtotal & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                  <span>Subtotal</span>
                  <span className="text-rose-600">${getSubtotal().toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-gray-400">Taxes and shipping calculated at checkout.</p>
                
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Form Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
}