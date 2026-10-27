import React from 'react';
import { Order } from '../types.ts';
import { CheckCircle2, Clock, QrCode, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

interface Props {
  order: Order;
  onCancel?: (orderId: string) => void;
}

export const QrTokenCard: React.FC<Props> = ({ order, onCancel }) => {
  const steps = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Picked Up'];
  const currentIndex = steps.indexOf(order.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Picked Up':
        return 'bg-emerald-600 text-white';
      case 'Ready':
        return 'bg-amber-500 text-slate-950 font-black animate-pulse';
      case 'Preparing':
        return 'bg-indigo-600 text-white';
      case 'Accepted':
        return 'bg-blue-600 text-white';
      case 'Cancelled':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all">
      {/* Header with Token */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold block">
            Digital Pickup Pass
          </span>
          <div className="text-xl font-extrabold flex items-center gap-2 mt-0.5">
            <span>{order.orderNumber}</span>
            <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded border border-slate-700">
              Token: {order.pickupToken}
            </span>
          </div>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Main Card Body */}
      <div className="p-5 space-y-4">
        {/* Status Stepper */}
        {order.status !== 'Cancelled' ? (
          <div className="relative pt-2 pb-2">
            <div className="flex items-center justify-between relative z-10">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-semibold truncate max-w-[60px] text-center ${
                        isCurrent ? 'text-amber-600 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Connecting progress line */}
            <div className="absolute top-[18px] left-4 right-4 h-1 bg-slate-100 z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>This order was cancelled. No charges incurred.</span>
          </div>
        )}

        {/* QR Code and Pickup Details */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
          {/* Simulated QR Code */}
          <div className="p-2.5 bg-white border border-slate-300 rounded-xl shadow-sm shrink-0 flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-slate-900 fill-current">
              {/* Geometric QR lookalike pattern */}
              <rect x="0" y="0" width="30" height="30" rx="3" fill="#0f172a" />
              <rect x="5" y="5" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="70" y="0" width="30" height="30" rx="3" fill="#0f172a" />
              <rect x="75" y="5" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="0" y="70" width="30" height="30" rx="3" fill="#0f172a" />
              <rect x="5" y="75" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

              <rect x="40" y="10" width="10" height="10" fill="#0f172a" />
              <rect x="55" y="10" width="8" height="8" fill="#0f172a" />
              <rect x="40" y="30" width="20" height="10" fill="#0f172a" />
              <rect x="45" y="50" width="12" height="12" fill="#0f172a" />
              <rect x="65" y="45" width="10" height="20" fill="#0f172a" />
              <rect x="40" y="70" width="15" height="15" fill="#0f172a" />
              <rect x="65" y="75" width="20" height="10" fill="#0f172a" />
            </svg>
            <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">
              SCAN TO VERIFY
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 flex-1 text-xs text-slate-700 text-center sm:text-left">
            <div>
              <span className="text-slate-500 text-[11px] block">Assigned Pickup Slot</span>
              <span className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {order.pickupSlot}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Collection Counter</span>
              <span className="font-semibold text-slate-800">
                Counter 2 (Express Token Line)
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Payment</span>
              <span className="font-semibold text-emerald-700">
                {order.paymentMethod} • {order.paymentStatus} (₹{order.totalAmount})
              </span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="border-t border-slate-100 pt-3 text-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Order Items ({order.items.length})
          </span>
          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-slate-700">
              <span>{it.quantity} × {it.name}</span>
              <span className="font-medium text-slate-900">₹{it.price * it.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-100">
            <span>Total Paid</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Action: Cancel Order if Placed/Accepted */}
        {onCancel && (order.status === 'Placed' || order.status === 'Accepted') && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onCancel(order.id)}
              className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
