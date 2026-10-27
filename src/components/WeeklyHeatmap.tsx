import React, { useState } from 'react';
import { Calendar, Info } from 'lucide-react';

interface Props {
  activeDay?: string;
  onSelectSlot?: (day: string, hour: string) => void;
}

export const WeeklyHeatmap: React.FC<Props> = ({ activeDay = 'Tuesday', onSelectSlot }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];

  // Realistic matrix data based on college routine
  // 10 AM (morning tea) & 12 PM/1 PM (lunch stampede) are recurring red peaks
  const heatmapData: Record<string, Record<string, { crowd: number; note: string }>> = {
    Monday: {
      '9 AM': { crowd: 35, note: 'Morning arrival rush' },
      '10 AM': { crowd: 78, note: '1st & 2nd Year Chai break' },
      '11 AM': { crowd: 40, note: 'Lecture hour' },
      '12 PM': { crowd: 91, note: 'Campus-wide Grand Lunch stampede' },
      '1 PM': { crowd: 85, note: 'Post-lunch coffee rush' },
      '2 PM': { crowd: 32, note: 'Afternoon practicals' },
      '3 PM': { crowd: 58, note: 'Evening tea break' },
      '4 PM': { crowd: 28, note: 'Dispersal' },
    },
    Tuesday: {
      '9 AM': { crowd: 30, note: 'Early lab arrivals' },
      '10 AM': { crowd: 76, note: 'Chai break' },
      '11 AM': { crowd: 34, note: 'DBMS lecture' },
      '12 PM': { crowd: 92, note: 'Lunch stampede peak' },
      '1 PM': { crowd: 74, note: 'Extended lunch' },
      '2 PM': { crowd: 24, note: 'AI recommended quiet window' },
      '3 PM': { crowd: 62, note: 'Afternoon tea' },
      '4 PM': { crowd: 35, note: 'Club meetings' },
    },
    Wednesday: {
      '9 AM': { crowd: 28, note: 'Regular start' },
      '10 AM': { crowd: 72, note: 'Short break' },
      '11 AM': { crowd: 38, note: 'Class hour' },
      '12 PM': { crowd: 88, note: 'Lunch break' },
      '1 PM': { crowd: 79, note: 'Cafeteria rush' },
      '2 PM': { crowd: 26, note: 'Library slots' },
      '3 PM': { crowd: 54, note: 'Tea and patties' },
      '4 PM': { crowd: 22, note: 'Labs end' },
    },
    Thursday: {
      '9 AM': { crowd: 32, note: 'Morning lectures' },
      '10 AM': { crowd: 82, note: 'Samosa batch 1 rush' },
      '11 AM': { crowd: 45, note: 'Mid-morning classes' },
      '12 PM': { crowd: 94, note: 'Peak campus lunch stampede' },
      '1 PM': { crowd: 82, note: 'Maggi & sandwich queue' },
      '2 PM': { crowd: 29, note: 'Quiet period' },
      '3 PM': { crowd: 60, note: 'Snack break' },
      '4 PM': { crowd: 30, note: 'Evening dispersal' },
    },
    Friday: {
      '9 AM': { crowd: 40, note: 'High attendance' },
      '10 AM': { crowd: 86, note: 'Friday morning rush' },
      '11 AM': { crowd: 50, note: 'Pre-weekend excitement' },
      '12 PM': { crowd: 96, note: 'Friday Biryani & Samosa Stampede' },
      '1 PM': { crowd: 88, note: 'Heavy lunch overflow' },
      '2 PM': { crowd: 42, note: 'Project submissions' },
      '3 PM': { crowd: 68, note: 'Weekend prep chai' },
      '4 PM': { crowd: 48, note: 'Student societies' },
    },
    Saturday: {
      '9 AM': { crowd: 18, note: 'Half-day start' },
      '10 AM': { crowd: 45, note: 'Light attendance' },
      '11 AM': { crowd: 30, note: 'Optional tutorials' },
      '12 PM': { crowd: 62, note: 'Early lunch dispersal' },
      '1 PM': { crowd: 40, note: 'Hostellers' },
      '2 PM': { crowd: 15, note: 'Canteen closing' },
      '3 PM': { crowd: 10, note: 'Maintenance' },
      '4 PM': { crowd: 8, note: 'Off' },
    },
  };

  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: string; crowd: number; note: string } | null>(null);

  const getHeatmapColor = (crowd: number) => {
    if (crowd <= 25) return 'bg-emerald-100 text-emerald-800 hover:ring-2 hover:ring-emerald-400';
    if (crowd <= 45) return 'bg-emerald-300 text-emerald-950 hover:ring-2 hover:ring-emerald-500';
    if (crowd <= 65) return 'bg-amber-300 text-amber-950 hover:ring-2 hover:ring-amber-500';
    if (crowd <= 80) return 'bg-orange-400 text-white hover:ring-2 hover:ring-orange-500';
    return 'bg-rose-600 text-white font-bold hover:ring-2 hover:ring-rose-400';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Weekly Peak-Hour Crowd Heatmap
          </h3>
          <p className="text-xs text-slate-500">
            Day-of-week vs hour crowd density matrix based on 30-day historical timetable patterns
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <span className="font-semibold">Intensity:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Quiet</span>
          <span className="px-2 py-0.5 rounded bg-amber-300 text-amber-950 text-[10px]">Moderate</span>
          <span className="px-2 py-0.5 rounded bg-orange-400 text-white text-[10px]">Heavy</span>
          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">Stampede (&gt;80%)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 text-left bg-slate-50 rounded-l-lg">
                Day \ Hour
              </th>
              {hours.map((hour) => (
                <th key={hour} className="py-2.5 px-2 text-xs font-semibold text-slate-600 bg-slate-50">
                  {hour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {days.map((day) => {
              const isToday = day === activeDay;
              return (
                <tr key={day} className={isToday ? 'bg-indigo-50/40' : ''}>
                  <td className="py-3 px-3 text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
                    {day}
                    {isToday && (
                      <span className="text-[10px] font-mono bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                        TODAY
                      </span>
                    )}
                  </td>
                  {hours.map((hour) => {
                    const cell = heatmapData[day]?.[hour] || { crowd: 30, note: '' };
                    return (
                      <td key={hour} className="p-1">
                        <div
                          onMouseEnter={() => setHoveredCell({ day, hour, crowd: cell.crowd, note: cell.note })}
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() => onSelectSlot && onSelectSlot(day, hour)}
                          className={`w-full py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${getHeatmapColor(
                            cell.crowd
                          )}`}
                        >
                          {cell.crowd}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tooltip / Explanation strip */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700">
        {hoveredCell ? (
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>{hoveredCell.day} at {hoveredCell.hour}:</strong> Predicted crowd is{' '}
              <span className="font-bold text-indigo-700">{hoveredCell.crowd}%</span>. {hoveredCell.note}.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4" />
            <span>Hover over any cell to see root causes (lecture breaks, lunch rush, or lab dismissals).</span>
          </div>
        )}
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Matrix size: 6 × 8
        </span>
      </div>
    </div>
  );
};
