import React from 'react';
import { SlotCrowdPrediction } from '../types.ts';
import { Clock, Users, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  slots: SlotCrowdPrediction[];
  selectedSlot?: string;
  onSelectSlot?: (slot: string) => void;
  showSelectButton?: boolean;
}

export const SlotForecastGrid: React.FC<Props> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  showSelectButton = false,
}) => {
  // Filter for key standard slots or show all
  const displaySlots = slots.length > 0 ? slots : [];

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'Low':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          bar: 'bg-emerald-500',
          border: 'border-emerald-300',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50/70 border-amber-200 text-amber-950',
          badge: 'bg-amber-500 text-white',
          bar: 'bg-amber-400',
          border: 'border-amber-300',
        };
      case 'High':
        return {
          bg: 'bg-orange-50/80 border-orange-200 text-orange-950',
          badge: 'bg-orange-600 text-white',
          bar: 'bg-orange-500',
          border: 'border-orange-300',
        };
      case 'Very High':
      default:
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-950',
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-600',
          border: 'border-rose-400',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Upcoming 1-Hour Slot Forecast
          </h2>
          <p className="text-xs text-slate-500">
            AI-predicted rush curves, break overlaps, and waiting delays
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (0–30%)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Med (31–60%)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (61–80%)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Very High (&gt;80%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displaySlots.map((slot) => {
          const styles = getLevelStyles(slot.crowd_level);
          const isSelected = selectedSlot === slot.time_slot;
          const isFull = slot.remaining_capacity <= 0;

          return (
            <div
              key={slot.time_slot}
              onClick={() => onSelectSlot && !isFull && onSelectSlot(slot.time_slot)}
              className={`relative rounded-2xl p-5 border transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-indigo-600 shadow-md bg-white border-indigo-400'
                  : `${styles.bg} hover:shadow-md`
              } ${onSelectSlot && !isFull ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
            >
              {/* Recommended Badge */}
              {slot.recommended_pickup && (
                <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  ⭐ AI RECOMMENDED
                </div>
              )}

              {/* Break tag */}
              {slot.is_break && (
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-100/80 inline-block px-2 py-0.5 rounded-md mb-2">
                  {slot.break_name || 'Lecture Break'}
                </div>
              )}

              {/* Time slot header */}
              <div className="flex items-baseline justify-between">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  {slot.time_slot}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${styles.badge}`}
                >
                  {slot.crowd_level}
                </span>
              </div>

              {/* Progress bar of crowd % */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Predicted Crowd</span>
                  <span className="text-slate-900 font-bold">{slot.crowd_percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                    style={{ width: `${Math.min(100, slot.crowd_percentage)}%` }}
                  />
                </div>
              </div>

              {/* Waiting time & capacity */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Est. Wait Time</span>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {slot.estimated_wait_minutes} min
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Slot Capacity</span>
                  <span
                    className={`font-bold text-sm block mt-0.5 ${
                      isFull ? 'text-rose-600' : 'text-slate-800'
                    }`}
                  >
                    {isFull ? (
                      '❌ Slot Full'
                    ) : (
                      `${slot.remaining_capacity} open (${slot.booked_orders}/${slot.max_capacity})`
                    )}
                  </span>
                </div>
              </div>

              {/* Bottom selection button if requested */}
              {showSelectButton && onSelectSlot && (
                <div className="mt-4 pt-3">
                  <button
                    disabled={isFull}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isFull) onSelectSlot(slot.time_slot);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        Selected Pickup Slot
                      </>
                    ) : isFull ? (
                      'Capacity Reached'
                    ) : (
                      'Select This Slot'
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
