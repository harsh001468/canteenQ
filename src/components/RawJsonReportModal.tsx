import React, { useState } from 'react';
import { CrowdPredictionResponse } from '../types.ts';
import { X, Copy, Check, FileJson, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  predictionData: CrowdPredictionResponse | null;
}

export const RawJsonReportModal: React.FC<Props> = ({ isOpen, onClose, predictionData }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !predictionData) return null;

  const jsonString = JSON.stringify(predictionData.slots_json, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                CanteenQ Primary AI Output
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
                  JSON Specification
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                1-Hour slot crowd predictions, wait times, and item demand forecasting payload
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Tabs / Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* 1. Raw JSON Code Block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                1. Structured Prediction Array (JSON)
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {predictionData.slots_json.length} operational slots
              </span>
            </div>
            <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-72 border border-slate-800 shadow-inner leading-relaxed">
              {jsonString}
            </pre>
          </div>

          {/* 2. Seven PRD Summary Items */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              2. Operational Analysis & Required Summary Items
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">1. Best Low-Crowd Pickup Slot</span>
                <span className="text-base font-bold text-emerald-600">
                  {predictionData.best_low_crowd_pickup_slot}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">2. Peak Crowd Slot</span>
                <span className="text-base font-bold text-rose-600">
                  {predictionData.peak_crowd_slot}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">3. Expected Average Waiting Time</span>
                <span className="text-base font-bold text-slate-900">
                  {predictionData.expected_average_waiting_time} minutes
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">6. Estimated Food Waste Reduction</span>
                <span className="text-base font-bold text-indigo-600">
                  {predictionData.estimated_food_waste_reduction} lower waste
                </span>
              </div>
            </div>

            {/* 4. Top 5 Items */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block font-medium mb-2">4. Top 5 Items by Predicted Demand</span>
              <div className="flex flex-wrap gap-2">
                {predictionData.top_5_items_by_predicted_demand.map((item, idx) => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold"
                  >
                    <span className="w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {item.name}: <strong>{item.quantity} units</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Recommended Preparation Quantity (Formula) */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">
                  5. Recommended Preparation Quantity (Formula: Demand + {predictionData.safety_buffer_percent}% Buffer − Inventory)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {Object.entries(predictionData.recommended_preparation_quantity_for_each_item || {}).slice(0, 6).map(([name, prep]) => (
                  <div key={name} className="p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="font-semibold text-slate-800 truncate">{name}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Pred: {prep.predicted} | Buf: +{prep.buffer}
                    </div>
                    <div className="text-emerald-600 font-bold mt-1 text-sm">
                      Prep: {prep.recommended} pcs
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Short Explanation */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block font-medium mb-1">7. Short Explanation of Why Predictions Were Made</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {predictionData.short_explanation}
              </p>
            </div>

            {/* Student Recommendation Format */}
            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-lg">
              <span className="text-xs text-amber-800 block font-bold mb-1">
                Student Recommendation Format Example:
              </span>
              <p className="text-xs font-medium text-amber-900 italic">
                “{predictionData.student_recommendation_format}”
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div>
            Data Source: {predictionData.is_demo_data ? 'Simulated Demo Benchmark Logs' : 'Uploaded Campus Logs'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
