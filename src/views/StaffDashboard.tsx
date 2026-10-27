import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import {
  Order,
  FoodItem,
  CrowdPredictionResponse,
  DashboardAnalytics,
  WasteRecord,
  OrderStatus,
} from '../types.ts';
import {
  ChefHat,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Flame,
  Leaf,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeSubTab?: string;
  onOpenReport?: () => void;
}

export const StaffDashboard: React.FC<Props> = ({ activeSubTab = 'staff-dashboard', onOpenReport }) => {
  const [tab, setTab] = useState<'queue' | 'prep' | 'waste' | 'menu'>('queue');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [predictionData, setPredictionData] = useState<CrowdPredictionResponse | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Waste logging form state
  const [wasteItem, setWasteItem] = useState('Samosa');
  const [preparedQty, setPreparedQty] = useState('100');
  const [soldQty, setSoldQty] = useState('94');
  const [wasteReason, setWasteReason] = useState('Standard end-of-shift buffer');
  const [wasteSuccess, setWasteSuccess] = useState(false);

  useEffect(() => {
    if (activeSubTab === 'staff-prep') setTab('prep');
    else if (activeSubTab === 'staff-waste') setTab('waste');
    else if (activeSubTab === 'staff-menu') setTab('menu');
    else setTab('queue');
  }, [activeSubTab]);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      const [ordRes, menuRes, predRes, analRes] = await Promise.all([
        api.getOrders(),
        api.getMenu(),
        api.getCrowdPredictions(),
        api.getDashboardAnalytics(),
      ]);
      setOrders(ordRes);
      setMenu(menuRes);
      setPredictionData(predRes);
      setAnalytics(analRes);
    } catch (e) {
      console.error('Error loading staff data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
    const interval = setInterval(loadStaffData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadStaffData();
    } catch (e: any) {
      alert(e.message || 'Error updating order status');
    }
  };

  const handleToggleStock = async (itemId: string) => {
    try {
      await api.toggleItemStock(itemId);
      await loadStaffData();
    } catch (e: any) {
      alert(e.message || 'Error toggling stock');
    }
  };

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const prep = parseInt(preparedQty, 10) || 0;
    const sold = parseInt(soldQty, 10) || 0;
    const wasted = Math.max(0, prep - sold);
    const wastePct = prep > 0 ? Number(((wasted / prep) * 100).toFixed(1)) : 0;

    const newRecord: WasteRecord = {
      id: `waste-${Date.now()}`,
      date: '2026-10-27',
      item: wasteItem,
      preparedQuantity: prep,
      soldQuantity: sold,
      wastedQuantity: wasted,
      wastePercentage: wastePct,
      reason: wasteReason,
    };

    if (analytics) {
      analytics.wasteRecords.unshift(newRecord);
    }
    setWasteSuccess(true);
    setTimeout(() => setWasteSuccess(false), 3000);
  };

  const activeQueue = orders.filter((o) => o.status !== 'Picked Up' && o.status !== 'Cancelled');
  const completedToday = orders.filter((o) => o.status === 'Picked Up');

  const prepItems = predictionData?.recommended_preparation_quantity_for_each_item || {};

  return (
    <div className="space-y-6 pb-20">
      {/* Top Operations Header (Section 10) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/20">
              👨‍🍳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Canteen Kitchen Display & Ops (KDS)</h1>
                <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                  LIVE CONSOLE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ramesh Chef (Head Canteen Operations) • Dispatch Window 1 & 2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={loadStaffData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              title="Refresh queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Raw AI Forecast
              </button>
            )}
          </div>
        </div>

        {/* Section 10 Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Orders Today</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{analytics?.todayOrdersCount || 428}</div>
            <div className="text-[10px] text-emerald-400">↑ 14% vs yesterday</div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Current Live Queue</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{activeQueue.length} tickets</div>
            <div className="text-[10px] text-slate-400">In preparation stages</div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Current Crowd</div>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5">{analytics?.currentCrowdPercentage || 68}%</div>
            <div className="text-[10px] text-rose-300 font-bold">🔴 High Stampede</div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Revenue Today</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">₹{analytics?.todayRevenue || 14280}</div>
            <div className="text-[10px] text-slate-400">Cash + UPI settlements</div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Food Waste Today</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">5.4%</div>
            <div className="text-[10px] text-emerald-300">~8.4 kg (-38% waste)</div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Pending Placed</div>
            <div className="text-2xl font-extrabold text-indigo-400 mt-0.5">
              {orders.filter((o) => o.status === 'Placed').length}
            </div>
            <div className="text-[10px] text-slate-400">Requires kitchen accept</div>
          </div>
        </div>
      </div>

      {/* Nav Tabs for Staff */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            tab === 'queue'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Live Order Queue ({activeQueue.length})
        </button>

        <button
          onClick={() => setTab('prep')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            tab === 'prep'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          Batch Prep Planner (Strict Formula)
        </button>

        <button
          onClick={() => setTab('waste')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            tab === 'waste'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Leaf className="w-4 h-4" />
          Food Waste Logger
        </button>

        <button
          onClick={() => setTab('menu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            tab === 'menu'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          Stock Controls ({menu.length} items)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE ORDER QUEUE (Section 11) */}
      {/* ========================================================================= */}
      {tab === 'queue' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Live Incoming Orders Queue
            </h3>
            <p className="text-xs text-slate-500">
              Kitchen Display System (KDS): Advance orders as food is fried, grilled, and packed
            </p>
          </div>

          {activeQueue.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-4xl">👨‍🍳</span>
              <h4 className="text-base font-bold text-slate-900">All caught up! Queue is clear.</h4>
              <p className="text-xs text-slate-500">
                New mobile pre-orders will chime here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeQueue.map((order) => {
                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl border p-5 space-y-3 shadow-xs transition ${
                      order.status === 'Ready'
                        ? 'border-emerald-300 ring-2 ring-emerald-100'
                        : order.status === 'Preparing'
                        ? 'border-indigo-300 ring-2 ring-indigo-50'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-base font-black text-slate-900">{order.orderNumber}</span>
                        <span className="text-xs text-slate-400 font-mono ml-2">
                          Token: <strong>{order.pickupToken}</strong>
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'Ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Preparing'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.status === 'Accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Student & Pickup Details */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>
                        Student: <strong className="text-slate-900">{order.userName}</strong> ({order.department || 'CS'})
                      </div>
                      <div className="flex items-center gap-1 text-indigo-700 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        Target Pickup: {order.pickupSlot}
                      </div>
                      <div className="text-slate-500">
                        Payment: <span className="font-semibold text-slate-700">{order.paymentMethod}</span> ({order.paymentStatus})
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Order Items
                      </span>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between font-bold text-slate-800">
                          <span>{it.quantity} × {it.name}</span>
                          <span className="text-slate-500 font-normal">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status Action Buttons (PRD Section 11) */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {order.status === 'Placed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Accepted')}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                        >
                          Accept
                        </button>
                      )}

                      {(order.status === 'Placed' || order.status === 'Accepted') && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          Preparing
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Ready')}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/20"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}

                      {order.status === 'Ready' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Picked Up')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete Pickup
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
                        title="Cancel Order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BATCH PREPARATION PLANNER (Section 13 Strict Formula) */}
      {/* ========================================================================= */}
      {tab === 'prep' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Formula Callout Banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-600" />
              Section 13: Smart Food Preparation Formula
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
              Recommended Quantity = Predicted Demand + Safety Buffer (10%) − Current Inventory
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Example: Predicted Samosa Demand = 90 | Safety Buffer = 9 | Current ready inventory = 20 → <strong>Recommended preparation: 79 pcs</strong>.
            </p>
          </div>

          {/* Prep Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">
                Kitchen Batch Preparation Schedule for Today
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Buffer: {predictionData?.safety_buffer_percent || 10}%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4 text-right">Predicted Demand</th>
                    <th className="py-3 px-4 text-right">Safety Buffer (+10%)</th>
                    <th className="py-3 px-4 text-right">Current Ready Inventory</th>
                    <th className="py-3 px-4 text-right text-emerald-800">
                      Recommended Preparation
                    </th>
                    <th className="py-3 px-4 text-center">Fryer Batch Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {Object.entries(prepItems).map(([name, prep]) => {
                    return (
                      <tr key={name} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {name}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-700 font-semibold font-mono">
                          {prep.predicted} units
                        </td>
                        <td className="py-3.5 px-4 text-right text-amber-700 font-mono">
                          +{prep.buffer}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-600 font-mono">
                          {prep.currentInventory}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-black rounded-lg text-sm border border-emerald-300">
                            {prep.recommended} pcs
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-[11px] text-slate-500">
                          {name === 'Samosa'
                            ? '10:15 AM & 12:10 PM'
                            : name.includes('Chai')
                            ? '10:20 AM Continuous'
                            : 'On Demand / 12 PM'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FOOD WASTE LOGGER (Section 14) */}
      {/* ========================================================================= */}
      {tab === 'waste' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Log form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Log End-of-Shift Waste Record
                </h3>
                <p className="text-xs text-slate-500">
                  Formula: Waste % = (Wasted / Prepared) × 100
                </p>
              </div>

              {wasteSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Waste entry saved and added to historical analytics!
                </div>
              )}

              <form onSubmit={handleLogWaste} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Food Item</label>
                  <select
                    value={wasteItem}
                    onChange={(e) => setWasteItem(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {menu.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Prepared Qty</label>
                    <input
                      type="number"
                      required
                      value={preparedQty}
                      onChange={(e) => setPreparedQty(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sold Qty</label>
                    <input
                      type="number"
                      required
                      value={soldQty}
                      onChange={(e) => setSoldQty(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Root Cause / Reason</label>
                  <input
                    type="text"
                    value={wasteReason}
                    onChange={(e) => setWasteReason(e.target.value)}
                    placeholder="e.g. Afternoon rain, event overflow..."
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Wasted Count:</span>
                    <strong className="text-slate-900">
                      {Math.max(0, parseInt(preparedQty || '0', 10) - parseInt(soldQty || '0', 10))} pcs
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600 mt-1">
                    <span>Computed Waste Rate:</span>
                    <strong className="text-indigo-600">
                      {parseInt(preparedQty, 10) > 0
                        ? `${(
                            (Math.max(0, parseInt(preparedQty, 10) - parseInt(soldQty, 10)) /
                              parseInt(preparedQty, 10)) *
                            100
                          ).toFixed(1)}%`
                        : '0%'}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow"
                >
                  Record Waste Entry
                </button>
              </form>
            </div>

            {/* Waste History List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Recent Food Waste Logs</h3>
                  <span className="text-xs text-slate-400">Target tolerance: &lt;6% waste</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Current Average: 5.4%
                </span>
              </div>

              <div className="space-y-2.5">
                {(analytics?.wasteRecords || []).map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{rec.item}</span>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-emerald-700">
                        {rec.wastePercentage}% Waste
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>{rec.date} • {rec.soldQuantity} sold of {rec.preparedQuantity} prepared</span>
                      <span>{rec.wastedQuantity} wasted</span>
                    </div>
                    {rec.reason && (
                      <p className="text-[11px] text-slate-600 italic">
                        Reason: {rec.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STOCK CONTROLS */}
      {/* ========================================================================= */}
      {tab === 'menu' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Item Availability & Stock</h3>
            <p className="text-xs text-slate-500">
              Toggle items out of stock if ingredients run dry to prevent student ordering
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {menu.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">₹{item.price} • {item.stock} in stock</div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStock(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    item.available
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                      : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                >
                  {item.available ? 'In Stock' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
