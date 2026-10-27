import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { api } from '../services/api.ts';
import {
  FoodItem,
  Order,
  SlotCrowdPrediction,
  DashboardAnalytics,
  CrowdPredictionResponse,
  TimetableEntry,
} from '../types.ts';
import { CrowdStatusBanner } from '../components/CrowdStatusBanner.tsx';
import { SlotForecastGrid } from '../components/SlotForecastGrid.tsx';
import { QrTokenCard } from '../components/QrTokenCard.tsx';
import {
  Utensils,
  ShoppingBag,
  Sparkles,
  Clock,
  Plus,
  Minus,
  Check,
  Calendar,
  AlertCircle,
  Filter,
  Search,
  ChevronRight,
} from 'lucide-react';

interface Props {
  activeSubTab?: string;
  onOpenReport?: () => void;
}

export const StudentDashboard: React.FC<Props> = ({ activeSubTab = 'dashboard', onOpenReport }) => {
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, setIsCartOpen, setSelectedPickupSlot, selectedPickupSlot } = useCart();

  const [tab, setTab] = useState<'dashboard' | 'menu' | 'orders' | 'recommendations'>(
    (activeSubTab as any) || 'dashboard'
  );
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [predictionData, setPredictionData] = useState<CrowdPredictionResponse | null>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [studentRecommendation, setStudentRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync tab if parent changes
  useEffect(() => {
    if (activeSubTab && ['dashboard', 'menu', 'orders', 'recommendations'].includes(activeSubTab)) {
      setTab(activeSubTab as any);
    }
  }, [activeSubTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuRes, ordersRes, analyticsRes, crowdRes, ttRes, recRes] = await Promise.all([
        api.getMenu(),
        api.getOrders(user?.id, 'student'),
        api.getDashboardAnalytics(),
        api.getCrowdPredictions(),
        api.getTimetable(),
        api.getStudentRecommendation(user?.studentId, user?.department),
      ]);
      setMenu(menuRes);
      setOrders(ordersRes);
      setAnalytics(analyticsRes);
      setPredictionData(crowdRes);
      setTimetable(ttRes);
      setStudentRecommendation(recRes);
    } catch (e) {
      console.error('Error fetching student data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.cancelOrder(orderId);
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Error cancelling order');
    }
  };

  const categories = ['All', 'Snacks', 'Quick Meals', 'Beverages'];

  const filteredMenu = menu.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeOrders = orders.filter((o) => o.status !== 'Picked Up' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Picked Up' || o.status === 'Cancelled');

  const slotsList = (predictionData?.slots_json || []).map((s) => ({
    time_slot: s.time_slot,
    crowd_percentage: s.crowd_percentage,
    crowd_level: s.crowd_level,
    estimated_wait_minutes: s.estimated_wait_minutes,
    recommended_pickup: s.recommended_pickup,
    max_capacity: 30,
    booked_orders: 12,
    remaining_capacity: 18,
    confidence: 0.92,
    free_students_estimate: 800,
    is_break: s.time_slot.includes('10:30') || s.time_slot.includes('12:30') || s.time_slot.includes('02:30'),
    break_name: s.time_slot.includes('12:30') ? 'Lunch Break' : s.time_slot.includes('10:30') ? 'Chai Break' : undefined,
    item_demand: s.item_demand,
  }));

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner (Mandated by Section 46) */}
      <CrowdStatusBanner analytics={analytics} onOpenReport={onOpenReport} />

      {/* Student Nav Bar Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Live Crowd & Slots
          </button>

          <button
            onClick={() => setTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'menu'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Pre-Order Menu
          </button>

          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
              tab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Digital Passes & Orders
            {activeOrders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'recommendations'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Smart Timetable Slot
          </button>
        </div>

        {/* Student Profile Quick Capsule */}
        <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
          <span>Student: <strong className="text-slate-800">{user?.name}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            {user?.department} ({user?.year})
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DASHBOARD & SLOTS FORECAST */}
      {/* ========================================================================= */}
      {tab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Smart Recommendation Banner for student */}
          {studentRecommendation && (
            <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-indigo-50 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Personalized AI Pickup Recommendation
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900">
                  {studentRecommendation.studentRecommendationText}
                </div>
                <p className="text-xs text-slate-600 max-w-2xl">
                  {studentRecommendation.reason} ({studentRecommendation.classContext})
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedPickupSlot(studentRecommendation.recommendedSlot);
                  setTab('menu');
                }}
                className="shrink-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                Pre-Order For This Slot
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 1-Hour Slot Grid Cards */}
          <SlotForecastGrid
            slots={slotsList}
            selectedSlot={selectedPickupSlot}
            onSelectSlot={(slot) => {
              setSelectedPickupSlot(slot);
              setTab('menu');
            }}
            showSelectButton={true}
          />

          {/* Active Orders Quick Peek */}
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                  Your Active Pickup Token ({activeOrders.length})
                </h3>
                <button
                  onClick={() => setTab('orders')}
                  className="text-xs text-indigo-600 hover:underline font-bold"
                >
                  View All Orders →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((ord) => (
                  <QrTokenCard key={ord.id} order={ord} onCancel={handleCancelOrder} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MENU & PRE-ORDER */}
      {/* ========================================================================= */}
      {tab === 'menu' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Slot Selected Banner */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                  Target Pickup Window
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {selectedPickupSlot || '02:00 PM - 02:15 PM'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setTab('dashboard')}
              className="text-xs text-indigo-600 hover:underline font-bold self-start sm:self-auto"
            >
              Change Pickup Slot
            </button>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Samosa, Chai, Maggi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Food Items Grid (Section 8 Menu Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenu.map((item) => {
              const inCart = cart.find((c) => c.item.id === item.id);
              const qty = inCart?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                    item.available ? 'border-slate-200 hover:shadow-md' : 'border-slate-200 opacity-60'
                  }`}
                >
                  {/* Item Image with Badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-emerald-800 shadow-xs border border-emerald-200">
                        ● {item.dietary}
                      </span>
                      {item.isPopular && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          🔥 Popular
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.preparationTime} min prep
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between gap-1">
                        <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
                          {item.name}
                        </h4>
                        <span className="text-base font-black text-slate-900">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Stock / Availability Status */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500">
                        {item.available ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {item.stock} ready in stock
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">Out of stock</span>
                        )}
                      </span>

                      {/* Add Button or Quantity Selector */}
                      {item.available ? (
                        qty === 0 ? (
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, qty - 1)}
                              className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-slate-900">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, qty + 1)}
                              className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      ) : (
                        <button disabled className="px-3 py-1.5 bg-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed">
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Cart Pill if Cart has items */}
          {cart.length > 0 && (
            <div className="fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-3 font-bold text-sm transition transform hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-5 h-5 text-indigo-200" />
                  <span>View Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                </div>
                <span className="w-px h-4 bg-indigo-400" />
                <span className="text-amber-300 font-black">
                  ₹{cart.reduce((s, i) => s + i.item.price * i.quantity, 0)}
                </span>
                <ChevronRight className="w-4 h-4 text-indigo-200" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ORDERS & DIGITAL PASSES */}
      {/* ========================================================================= */}
      {tab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              Your Active Pickup Passes
            </h3>
            <p className="text-xs text-slate-500">
              Display this digital token at Express Counter 2 when status switches to "Ready"
            </p>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <span className="text-4xl">🎫</span>
              <h4 className="text-base font-bold text-slate-900">No active pickup passes</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pre-order from the menu to secure an AI-scheduled low-crowd pickup slot.
              </p>
              <button
                onClick={() => setTab('menu')}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.map((ord) => (
                <QrTokenCard key={ord.id} order={ord} onCancel={handleCancelOrder} />
              ))}
            </div>
          )}

          {/* Past Orders History */}
          {pastOrders.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-700">Past Order History</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastOrders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{ord.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Pickup: {ord.pickupSlot}
                    </div>
                    <div className="text-slate-700">
                      {ord.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')}
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                      <span>Total</span>
                      <span>₹{ord.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SMART TIMETABLE ADVICE */}
      {/* ========================================================================= */}
      {tab === 'recommendations' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Main AI Student Recommendation Box (Required Format) */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Official Student Recommendation Output
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              “{studentRecommendation?.studentRecommendationText}”
            </div>
            <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
              <strong>Context Analysis:</strong> {studentRecommendation?.reason} ({studentRecommendation?.classContext}). Alternate low-crowd backup slot: <strong>{studentRecommendation?.alternateSlot}</strong>.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedPickupSlot(studentRecommendation?.recommendedSlot);
                  setTab('menu');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow"
              >
                Reserve {studentRecommendation?.recommendedSlot}
              </button>
            </div>
          </div>

          {/* Student's Timetable vs Canteen Crowds */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your Class Timetable vs Canteen Stampede Windows
              </h3>
              <p className="text-xs text-slate-500">
                Department: {user?.department} • Year: {user?.year}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {timetable.map((tt) => {
                const isBreak = tt.isBreak;
                return (
                  <div key={tt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-600 w-36 shrink-0">
                        {tt.timeLabel}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          {tt.subject}
                          {isBreak && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {tt.breakType || 'FREE BREAK'}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {tt.department} • Section {tt.section}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs">
                      {isBreak ? (
                        tt.timeLabel.includes('12:30') ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                            ⚠️ Heavy 92% Stampede!
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            ⭐ Recommended Pickup Window
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 italic">In Lecture / Lab</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
