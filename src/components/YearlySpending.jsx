import React, { useState } from 'react';
import { Calendar, TrendingUp, Award } from 'lucide-react';
import { translations } from '../translations';

export default function YearlySpending({ yearlyData = {}, lang = 'km' }) {
  const t = translations[lang] || translations.km;
  const years = Object.keys(yearlyData).sort();

  if (years.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B] text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
          <Calendar className="w-5 h-5 text-roblox-accent" />
        </div>
        <h3 className="text-sm font-bold text-white">
          {lang === 'km' ? 'មិនទាន់មានប្រវត្តិចំណាយប្រចាំឆ្នាំ' : 'No Yearly Spending History'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {lang === 'km' 
            ? 'មិនមានប្រតិបត្តិការចំណាយ Robux ក្នុងឆ្នាំណាមួយត្រូវបានកត់ត្រាសម្រាប់គណនីនេះឡើយ។' 
            : 'No Robux spending transactions detected in any year for this account.'}
        </p>
      </div>
    );
  }

  const [selectedYear, setSelectedYear] = useState(years[years.length - 1] || '2025');
  const currentData = yearlyData[selectedYear] || yearlyData[years[0]];

  // Find max Robux to scale bars
  const maxRobux = Math.max(...years.map(y => yearlyData[y]?.robux || 0), 100);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B]">
      
      {/* Header & Year Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-roblox-accent" />
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">{t.yearlyTitle}</h2>
            <p className="text-xs text-slate-400">{t.yearlySubtitle}</p>
          </div>
        </div>

        {/* Year Selector Pills */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto overflow-x-auto">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedYear === year
                  ? 'bg-roblox-accent text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Chart + Year Metrics */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Interactive Visual Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-black/30 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-roblox-accent" />
              Robux Spent Over Time
            </span>
            <span className="text-xs text-slate-400">{years[0]} - {years[years.length - 1]}</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {years.map(year => {
              const yData = yearlyData[year] || { robux: 0 };
              const heightPercent = Math.max(8, Math.round((yData.robux / maxRobux) * 100));
              const isSelected = selectedYear === year;

              return (
                <div
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <span className={`text-[10px] font-mono font-bold transition-colors ${
                    isSelected ? 'text-roblox-accent' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {yData.robux > 1000 ? `${(yData.robux / 1000).toFixed(1)}k` : yData.robux}
                  </span>

                  <div className="w-full max-w-[42px] h-32 bg-slate-800/60 rounded-t-lg overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-t from-blue-600 to-roblox-accent shadow-lg shadow-blue-500/30'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>

                  <span className={`text-xs font-bold font-mono transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`}>
                    {year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Year Detail Panel (5 cols) */}
        {currentData && (
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-[#161922] to-[#12141A] border border-roblox-accent/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-2xl font-black text-white font-mono">{selectedYear}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-roblox-accent/20 text-roblox-accent font-semibold border border-roblox-accent/30">
                  {selectedYear}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Robux</span>
                  <p className="text-xl font-black text-white font-mono mt-0.5">
                    {(currentData.robux || 0).toLocaleString()} R$
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. USD</span>
                  <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    ${(currentData.estUsd || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{t.purchasesCountLabel}</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {currentData.transactions || 0}
                </span>
              </div>
            </div>

            {/* Top Purchase for Selected Year */}
            {currentData.topPurchase && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Top Purchase ({selectedYear})
                </span>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                      {currentData.topPurchase?.name || 'Item'}
                    </h4>
                  </div>
                  <span className="text-xs font-extrabold text-roblox-accent font-mono">
                    {(currentData.topPurchase?.robux || 0).toLocaleString()} R$
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
