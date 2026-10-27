import React from 'react';
import { SlotCrowdPrediction, WasteRecord } from '../types.ts';

// 1. Crowd Curve Area Chart
export const CrowdCurveChart: React.FC<{ slots: SlotCrowdPrediction[] }> = ({ slots }) => {
  if (!slots || !slots.length) return null;

  const width = 650;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const points = slots.map((s, idx) => {
    const x = paddingX + (idx / (slots.length - 1)) * innerW;
    const y = height - paddingY - (s.crowd_percentage / 100) * innerH;
    return { x, y, crowd: s.crowd_percentage, slot: s.time_slot.split(' - ')[0] };
  });

  const lineD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${lineD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
        <defs>
          <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = height - paddingY - (val / 100) * innerH;
          return (
            <g key={val}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x={paddingX - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                {val}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#crowdGrad)" />

        {/* Line stroke */}
        <path d={lineD} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Stampede Peak highlight */}
        {points.map((p, i) => {
          const isPeak = p.crowd > 80;
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isPeak ? 5 : 3.5}
                fill={isPeak ? '#e11d48' : '#6366f1'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className={`text-[10px] font-bold ${isPeak ? 'fill-rose-600' : 'fill-slate-700'}`}
              >
                {p.crowd}%
              </text>
              <text
                x={p.x}
                y={height - paddingY + 16}
                textAnchor="middle"
                className="text-[9px] fill-slate-500 font-medium"
              >
                {p.slot}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 2. Demand Forecast Bar Chart
export const DemandForecastBarChart: React.FC<{
  topItems: { name: string; quantity: number }[];
}> = ({ topItems }) => {
  if (!topItems || !topItems.length) return null;
  const maxQty = Math.max(...topItems.map((i) => i.quantity), 100);

  return (
    <div className="space-y-3">
      {topItems.map((item, idx) => {
        const pct = Math.round((item.quantity / maxQty) * 100);
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-800 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {item.name}
              </span>
              <span className="text-indigo-600 font-bold">{item.quantity} units</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 3. Food Waste Trend Chart
export const WasteTrendChart: React.FC<{ records: WasteRecord[] }> = ({ records }) => {
  if (!records || !records.length) return null;
  const maxWaste = 12;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
        <span>Date & Item</span>
        <div className="flex items-center gap-4">
          <span>Prepared vs Sold</span>
          <span className="font-bold">Waste %</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {records.map((rec) => {
          const isHigh = rec.wastePercentage > 7;
          return (
            <div key={rec.id} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition border border-slate-200/60">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{rec.item}</span>
                  <span className="text-slate-400 font-mono ml-2 text-[11px]">{rec.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 text-[11px]">
                    {rec.soldQuantity} / {rec.preparedQuantity} sold
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs ${
                      isHigh ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {rec.wastePercentage}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isHigh ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (rec.wastePercentage / maxWaste) * 100)}%` }}
                />
              </div>
              {rec.reason && (
                <div className="text-[10px] text-slate-500 mt-1 italic">
                  Note: {rec.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Forecast vs Actual Comparison Table & Metrics
export const ForecastVsActualChart: React.FC<{
  comparison: { item: string; predicted: number; actual: number; error: number }[];
  mape: number;
  mae: number;
  rmse: number;
}> = ({ comparison, mape, mae, rmse }) => {
  return (
    <div className="space-y-4">
      {/* Accuracy KPI row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
          <div className="text-[11px] text-indigo-700 font-medium">MAPE (Error %)</div>
          <div className="text-xl font-extrabold text-indigo-900 mt-0.5">{mape}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">High Precision (&lt;6%)</div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <div className="text-[11px] text-emerald-700 font-medium">MAE (Mean Error)</div>
          <div className="text-xl font-extrabold text-emerald-900 mt-0.5">±{mae}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Items / batch</div>
        </div>

        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
          <div className="text-[11px] text-slate-600 font-medium">RMSE Metric</div>
          <div className="text-xl font-extrabold text-slate-800 mt-0.5">{rmse}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Variance Bound</div>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
            <tr>
              <th className="py-2.5 px-3">Item</th>
              <th className="py-2.5 px-3 text-right">Predicted</th>
              <th className="py-2.5 px-3 text-right">Actual</th>
              <th className="py-2.5 px-3 text-right">Error %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparison.map((row) => (
              <tr key={row.item} className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-medium text-slate-800">{row.item}</td>
                <td className="py-2 px-3 text-right text-indigo-600 font-semibold">{row.predicted}</td>
                <td className="py-2 px-3 text-right text-slate-900 font-semibold">{row.actual}</td>
                <td className="py-2 px-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                    {row.error}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
