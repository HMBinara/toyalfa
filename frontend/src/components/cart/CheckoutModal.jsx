import { useState } from 'react';
import { X, CheckCircle2, CreditCard, Truck, Tag, ChevronRight, Package, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

const STEP = { SHIPPING: 1, PAYMENT: 2, SUCCESS: 3 };

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, getSubtotal, appliedPromo, applyPromoCode, removePromoCode, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(STEP.SHIPPING);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 50 ? 0 : 4.99;
  const discount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? subtotal * (appliedPromo.discount / 100)
      : Math.min(appliedPromo.discount, subtotal)
    : 0;
  const taxableTotal = Math.max(0, subtotal - discount);
  const tax = taxableTotal * 0.08;
  const total = Math.max(0, taxableTotal + shippingFee + tax);

  const handleClose = () => {
    setStep(STEP.SHIPPING);
    setPlacedOrder(null);
    setPromoInput('');
    setPromoError('');
    setReceiptOpen(false);
    setShipping({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || '', city: '', zip: '' });
    setCard({ number: '', expiry: '', cvv: '' });
    onClose();
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput.trim());
    if (result.success) {
      toast.success(`Promo applied: ${result.label} 🎉`);
    } else {
      setPromoError(result.error);
    }
  };

  const handleShippingNext = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.zip) {
      toast.error('Please fill in your name, email, address, city, and ZIP code.');
      return;
    }
    setStep(STEP.PAYMENT);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card' && (!card.number || !card.expiry || !card.cvv)) {
      toast.error('Please fill in all card details.');
      return;
    }
    const order = placeOrder({
      items: cart,
      total,
      address: `${shipping.address}, ${shipping.city}, ${shipping.zip}`,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card',
      name: shipping.name,
      email: shipping.email,
      phone: shipping.phone,
      promoCode: appliedPromo?.code || null,
    });
    clearCart();
    setPlacedOrder(order);
    setStep(STEP.SUCCESS);
    toast.success('Order placed successfully! 🎉');
  };

  const updateShipping = (field) => (e) =>
    setShipping((s) => ({ ...s, [field]: e.target.value }));

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition placeholder:text-gray-400';

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {step === STEP.SHIPPING && 'Shipping Details'}
              {step === STEP.PAYMENT  && 'Payment & Review'}
              {step === STEP.SUCCESS  && 'Order Confirmed! 🎉'}
            </h2>
            {step !== STEP.SUCCESS && (
              <div className="flex gap-1 mt-1.5">
                {[STEP.SHIPPING, STEP.PAYMENT].map((s) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      step >= s ? 'bg-rose-500 w-8' : 'bg-gray-200 w-5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* ── STEP 1: SHIPPING ── */}
          {step === STEP.SHIPPING && (
            <form id="shipping-form" onSubmit={handleShippingNext} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={shipping.name}
                    onChange={updateShipping('name')}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={shipping.email}
                    onChange={updateShipping('email')}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    value={shipping.phone}
                    onChange={updateShipping('phone')}
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Shipping Address *</label>
                  <textarea
                    required
                    placeholder="123 Street Name, City, Country"
                    rows={2}
                    value={shipping.address}
                    onChange={updateShipping('address')}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City *</label>
                  <input type="text" required placeholder="Colombo" value={shipping.city} onChange={updateShipping('city')} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">ZIP / Postal Code *</label>
                  <input type="text" required placeholder="00700" value={shipping.zip} onChange={updateShipping('zip')} className={inputCls} />
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Tag size={12} /> Promo Code
                </label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm">
                    <span className="text-emerald-700 font-semibold">
                      ✓ {appliedPromo.code} — {appliedPromo.label}
                    </span>
                    <button type="button" onClick={removePromoCode} className="text-gray-400 hover:text-red-500 text-xs">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. SAVE10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className={`${inputCls} flex-1 uppercase`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition flex-shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                <p className="text-[11px] text-gray-400 mt-1">Try: SAVE10, ALFA20, FREE5</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck size={13} /> Shipping</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-600 font-medium">Free</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-rose-600">${total.toFixed(2)}</span>
                </div>
                {subtotal < 50 && (
                  <p className="text-[11px] text-gray-400">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                )}
              </div>
            </form>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === STEP.PAYMENT && (
            <form id="payment-form" onSubmit={handlePlaceOrder} className="p-6 space-y-4">
              {/* Cart summary */}
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <span className="flex-1 text-gray-700 line-clamp-1">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-sm">
                <span>Total Payable</span>
                <span className="text-rose-600">${total.toFixed(2)}</span>
              </div>

              {/* Payment method selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'cod',  label: 'Cash on Delivery', icon: <Truck size={16} /> },
                    { value: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={16} /> },
                  ].map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPaymentMethod(m.value)}
                      className={`flex items-center gap-2 border-2 rounded-xl px-3.5 py-3 text-xs font-semibold transition ${
                        paymentMethod === m.value
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (1234 5678 9012 3456)"
                    maxLength={19}
                    value={card.number}
                    onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                    className={inputCls}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength={3}
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    🔒 This is a mock demo — no real payment is processed.
                  </p>
                </div>
              )}
            </form>
          )}

          {/* ── STEP 3: SUCCESS ── */}
          {step === STEP.SUCCESS && placedOrder && (
            <div className="p-6 text-center space-y-5">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mx-auto">
                <CheckCircle2 size={48} className="text-emerald-500" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Confirmed!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Order <span className="font-semibold text-gray-700">{placedOrder.id}</span> placed successfully.
                </p>
              </div>

              {/* Tracking timeline */}
              <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1">
                  <Package size={13} /> Order Tracking
                </p>
                <div className="space-y-3">
                  {placedOrder.trackingSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          step.done
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {step.done && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-[11px] text-gray-400">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
                <button onClick={() => setReceiptOpen((open) => !open)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1 transition">
                  {receiptOpen ? 'Hide Receipt' : 'View Receipt'} <ArrowRight size={14} />
                </button>
              </div>
              {receiptOpen && <div className="text-left bg-white border border-gray-200 rounded-xl p-4 text-xs space-y-2"><p className="font-bold text-gray-900">ToyAlfa receipt</p><p className="text-gray-500">{placedOrder.id} · {placedOrder.date}</p>{placedOrder.items.map((item) => <div key={item.id} className="flex justify-between"><span>{item.name} × {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}<div className="border-t border-gray-100 pt-2 flex justify-between font-bold"><span>Total</span><span>${Number(placedOrder.total).toFixed(2)}</span></div></div>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== STEP.SUCCESS && (
          <div className="p-6 border-t border-gray-100 flex gap-3 flex-shrink-0">
            {step === STEP.PAYMENT && (
              <button
                type="button"
                onClick={() => setStep(STEP.SHIPPING)}
                className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              form={step === STEP.SHIPPING ? 'shipping-form' : 'payment-form'}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-sm"
            >
              {step === STEP.SHIPPING ? (
                <>Continue to Payment <ChevronRight size={16} /></>
              ) : (
                <>Place Order <CheckCircle2 size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}