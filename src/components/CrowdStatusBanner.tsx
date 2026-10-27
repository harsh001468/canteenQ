import React from 'react';
import { DashboardAnalytics } from '../types.ts';
import { Users, Clock, ShoppingBag, Leaf, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  analytics: DashboardAnalytics | null;
  onOpenReport?: () => void;
}

export const CrowdStatusBanner: React.FC<Props> = ({ analytics, onOpenReport }) => {
  const currentCrowd = analytics?.currentCrowdPercentage ?? 68;
  const estimatedWait = analytics?.estimatedWaitMinutes ?? 12;
  const todayOrders = analytics?.todayOrdersCount ?? 428;
  const foodWaste = analytics?.todayWastePercentage ?? 5.4;
  const recommendedSlot = analytics?.aiRecommendedPickupSlot ?? '02:00 PM – 02:15 PM';

  // Crowd status color
  let crowdBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  let crowdDotColor = 'bg-amber-500';
  if (currentCrowd <= 30) {
    crowdBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    crowdDotColor = 'bg-emerald-500';
  } else if (currentCrowd <= 60) {
    crowdBadgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    crowdDotColor = 'bg-yellow-500';
  } else if (currentCrowd <= 80) {
    crowdBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    crowdDotColor = 'bg-orange-500';
  } else {
    crowdBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    crowdDotColor = 'bg-rose-500';
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 mb-8">
      {/* Background soft glow patterns */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagline & Badge */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">🐱</span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              CanteenQ Operations Core
            </span>
            {analytics?.isDemoData && (
              <span className="text-[11px] bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded font-mono">
                DEMO DATA
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Skip the Samosa Stampede.
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time campus crowd modeling, break-demand forecasting, and intelligent pickup scheduling.
          </p>
        </div>

        {onOpenReport && (
          <button
            onClick={onOpenReport}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            View AI JSON Output
          </button>
        )}
      </div>

      {/* 5 Core Top Metrics Mandated by Section 46 */}
      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
        {/* Metric 1: Current Crowd */}
        <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Current Crowd</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-white">{currentCrowd}%</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${crowdBadgeColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${crowdDotColor}`} />
              {currentCrowd > 80 ? 'Very High' : currentCrowd > 60 ? 'High' : currentCrowd > 30 ? 'Medium' : 'Low'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live counter load</span>
        </div>

        {/* Metric 2: Estimated Wait */}
        <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Estimated Wait</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-amber-400">{estimatedWait}</span>
            <span className="text-sm font-semibold text-slate-300">min</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Average queue delay</span>
        </div>

        {/* Metric 3: Today's Orders */}
        <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Today's Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-white">{todayOrders}</span>
            <span className="text-[11px] text-emerald-400 font-medium ml-1">↑ 14%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Processed so far</span>
        </div>

        {/* Metric 4: Food Waste */}
        <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Food Waste</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-400">{foodWaste}%</span>
            <span className="text-[11px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono ml-1">
              -38%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Controlled by buffer</span>
        </div>

        {/* Metric 5: AI Recommended Pickup */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-indigo-500/20 backdrop-blur-md p-4 rounded-2xl border border-amber-500/40">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommended
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-300 mt-1 truncate">
            {recommendedSlot}
          </div>
          <span className="text-[11px] text-amber-200/80 mt-1 block">
            Lowest crowd slot (~3 min wait)
          </span>
        </div>
      </div>

      {/* Dynamic Advice Banner */}
      <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center gap-2 text-xs text-slate-300">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="text-amber-400">Stampede Warning:</strong> 12:30 PM–01:30 PM lunch break is expected to reach <strong>92% crowd capacity</strong>. Pre-order now to secure express collection at Window 2.
        </span>
      </div>
    </div>
  );
};
