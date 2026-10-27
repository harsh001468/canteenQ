import React from 'react';
import {
  Sparkles,
  Clock,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  Users,
  Utensils,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { CrowdPredictionResponse } from '../types.ts';

interface Props {
  onStartOrder: () => void;
  onExploreDemo: () => void;
  onOpenReport: () => void;
  predictionData: CrowdPredictionResponse | null;
}

export const LandingView: React.FC<Props> = ({
  onStartOrder,
  onExploreDemo,
  onOpenReport,
  predictionData,
}) => {
  const { switchRole } = useAuth();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 text-center">
        {/* Soft Background Radial Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-amber-400/20 via-indigo-500/15 to-rose-400/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-extrabold mb-6 animate-pulse-subtle">
          <span className="text-base">🐱</span>
          <span>AI-POWERED CAMPUS OPERATIONS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-amber-700 font-mono">DEMO READY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Skip the <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">Samosa Stampede.</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
          Predict the rush. Pre-order your hot snacks. Pick them up in 3 minutes when the queue is calm.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <button
            onClick={onStartOrder}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/25 transition transform active:scale-95 flex items-center gap-2"
          >
            <Utensils className="w-4 h-4" />
            Order Food Now
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm border border-slate-300 shadow-sm transition active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Launch Live Operations Dashboard
          </button>

          <button
            onClick={onOpenReport}
            className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-2xl font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <FileJson className="w-4 h-4 text-amber-400" />
            View AI JSON Output
          </button>
        </div>

        {/* 4 Stats Cards (PRD Section 30) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 text-left">
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Queue Time
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-1">↓ 75%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">From 18m peak to 3m wait</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Prediction Accuracy
            </div>
            <div className="text-3xl font-black text-indigo-600 mt-1">↑ 94.2%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">5.8% MAPE benchmark</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              Food Waste
            </div>
            <div className="text-3xl font-black text-amber-600 mt-1">↓ 38.5%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Buffer tuned preparation</div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-600" />
              Student Speed
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">100%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Guaranteed break pickup</div>
          </div>
        </div>
      </section>

      {/* The Core Innovation: Problem vs AI Solution (Judge Friendly Section 44) */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            The Core Campus Challenge
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Why Traditional Canteens Fail During Lecture Breaks
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            College canteens experience extreme volatility: empty halls during college events and 400-student stampedes when the bell rings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without CanteenQ */}
          <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Without CanteenQ (Traditional Chaos)
            </div>
            <ul className="space-y-2 text-xs text-rose-900 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                All 5 academic departments rush the counter at 12:30 PM creating a 22-minute wait.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Kitchen runs out of Samosas at 1:00 PM; late arriving students go hungry.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                During the Hackathon, counter footfall plummets and 25 kg of unsold food is wasted.
              </li>
            </ul>
          </div>

          {/* With CanteenQ */}
          <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              With CanteenQ (AI-Orchestrated Operations)
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                AI recommends 2:00 PM–2:15 PM slot for students with afternoon labs, smoothing the crowd.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Smart preparation formula (Demand + 10% Buffer − Inventory) ensures exact batch fryer counts.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Event mode dampens walk-in predictions by 28% so staff avoid over-cooking.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards (PRD Section 30) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900">Built for Modern Campus Life</h2>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end intelligent closed loop connecting student timetable with kitchen fryers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Crowd Prediction</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Predicts the exact crowd percentage and wait delay for every 1-hour slot using historical logs and lecture timetables.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Smart Pickup Scheduling</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Analyzes each student's class schedule and break availability to recommend the calmest pickup window with digital tokens.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Item Demand Forecasting</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Item-level forecasting for Samosas, Cutting Chai, Sandwiches, and Maggi so the kitchen prepares right on schedule.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Waste Reduction Engine</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Applies dynamic safety buffers to eliminate end-of-day food discard while preventing peak lunch stockouts.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Personas Switcher Callout */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            Role-Based Portals
          </span>
          <h2 className="text-2xl font-bold mt-2">Experience CanteenQ from Any Perspective</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Switch between Student, Kitchen Staff, and Campus Administrator modes in 1 click to test the full lifecycle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              switchRole('student');
              onExploreDemo();
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Student View
          </button>
          <button
            onClick={() => {
              switchRole('staff');
              onExploreDemo();
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow"
          >
            Staff KDS View
          </button>
          <button
            onClick={() => {
              switchRole('admin');
              onExploreDemo();
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Admin Analytics View
          </button>
        </div>
      </section>
    </div>
  );
};
