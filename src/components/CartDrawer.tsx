import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { X, Trash2, Plus, Minus, Clock, Sparkles, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onOrderPlaced?: (newOrder: any) => void;
  availableSlots?: string[];
  recommendedSlot?: string;
}

export const CartDrawer: React.FC<Props> = ({
  onOrderPlaced,
  availableSlots = [
    '10:30 AM - 10:45 AM',
    '10:45 AM - 11:00 AM',
    '11:00 AM - 11:15 AM',
    '12:30 PM - 12:45 PM',
    '12:45 PM - 01:00 PM',
    '01:30 PM - 01:45 PM',
    '02:00 PM - 02:15 PM',
    '02:15 PM - 02:30 PM',
    '02:30 PM - 02:45 PM',
    '03:30 PM - 03:45 PM',
  ],
  recommendedSlot = '02:00 PM - 02:15 PM',
}) => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, totalCount, selectedPickupSlot, setSelectedPickupSlot, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'Demo UPI' | 'Cash at Pickup'>('Demo UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!cart.length) return;
    setIsSubmitting(true);
    try {
      const orderItems = cart.map((c) => ({
        itemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
      }));

      const newOrder = await api.createOrder({
        userId: user?.id || 'user-student-1',
        userName: user?.name || 'Harsh Sharma',
        userEmail: user?.email || 'student@demo.com',
        userRole: user?.role || 'student',
        department: user?.department || 'Computer Science',
        items: orderItems,
        pickupSlot: selectedPickupSlot,
        timeSlotId: selectedPickupSlot.includes('02:') ? '01:30 PM - 02:30 PM' : '12:30 PM - 01:30 PM',
        paymentMethod,
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      clearCart();
      setIsCartOpen(false);
      if (onOrderPlaced) onOrderPlaced(newOrder);
    } catch (e: any) {
      alert(e.message || 'Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold">Your Pre-Order Cart</h2>
              <span className="text-xs text-slate-400">
                {totalCount} item{totalCount === 1 ? '' : 's'} selected
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-3">
                <span className="text-4xl">🛒</span>
                <p className="text-sm font-medium">Your cart is empty.</p>
                <p className="text-xs text-slate-400">
                  Select delicious items from the menu to schedule your quiet pickup.
                </p>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3 divide-y divide-slate-100">
                  {cart.map(({ item, quantity }) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500">₹{item.price} each</div>
                        <div className="text-xs font-semibold text-indigo-600 mt-0.5">
                          ₹{item.price * quantity}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Section 8: Choose Pickup Slot with AI Recommendation at top */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Choose Pickup Slot
                    </label>
                  </div>

                  {/* AI Recommended Choice Banner */}
                  <div
                    onClick={() => setSelectedPickupSlot(recommendedSlot)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedPickupSlot === recommendedSlot
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        ⭐ AI Recommended Slot
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Crowd: 28% • Wait: 3 min
                      </span>
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {recommendedSlot}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Optimal window right between scheduled lectures with zero queue congestion.
                    </p>
                  </div>

                  {/* Other Slot options */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Or select alternate slot:</span>
                    <select
                      value={selectedPickupSlot}
                      onChange={(e) => setSelectedPickupSlot(e.target.value)}
                      className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} {slot === recommendedSlot ? '(AI Recommended)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 27: Payment selection */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Payment Option
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Demo UPI')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                        paymentMethod === 'Demo UPI'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-400'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>Demo UPI</div>
                        <div className="text-[10px] text-slate-500 font-normal">Instant pre-pay</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash at Pickup')}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                        paymentMethod === 'Cash at Pickup'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-400'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>Cash at Pickup</div>
                        <div className="text-[10px] text-slate-500 font-normal">Pay at counter</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-semibold text-slate-600">Total Payable</span>
                <span className="text-2xl font-black text-slate-900">₹{totalAmount}</span>
              </div>

              <button
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Confirming Order...'
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-indigo-200" />
                    Confirm & Reserve Pickup Slot
                  </>
                )}
              </button>
              <div className="text-center text-[10px] text-slate-400">
                Pickup Token & QR pass generated immediately upon order confirmation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
