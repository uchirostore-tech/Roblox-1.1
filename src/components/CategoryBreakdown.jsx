import React, { useState } from 'react';
import { PieChart, Tag } from 'lucide-react';
import { translations } from '../translations';

export default function CategoryBreakdown({ categories = [], lang = 'km' }) {
  const t = translations[lang] || translations.km;
  const [selectedCatName, setSelectedCatName] = useState('Game Passes');

  const hasAnySpending = categories && categories.some(c => (c.robux || 0) > 0);

  if (!categories || categories.length === 0 || !hasAnySpending) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B] text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
          <PieChart className="w-5 h-5 text-roblox-accent" />
        </div>
        <h3 className="text-sm font-bold text-white">
          {lang === 'km' ? 'មិនទាន់មានការចំណាយតាមប្រភេទ' : 'No Category Spending'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {lang === 'km' 
            ? 'គណនីរបស់អ្នកមិនទាន់បានចំណាយ Robux លើប្រភេទណាមួយនៅឡើយទេ (Game Passes, Developer Products, Accessories, Bundles)។' 
            : 'Your account has zero recorded spending across Game Passes, Accessories, Bundles, or Private Servers.'}
        </p>
      </div>
    );
  }

  const activeCategory = categories.find(c => c.name === selectedCatName) || categories[0];

  const getTranslatedCatName = (name) => {
    if (name.includes('Game Pass')) return t.catGamePasses;
    if (name.includes('Developer Product')) return t.catDevProducts;
    if (name.includes('Asset') || name.includes('Accessory')) return t.catAssets;
    if (name.includes('Bundle') || name.includes('Animation')) return t.catBundles;
    if (name.includes('Private Server')) return t.catPrivateServers;
    return name;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B]">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-white/10">
        <PieChart className="w-5 h-5 text-roblox-accent" />
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">{t.categoriesTitle}</h2>
          <p className="text-xs text-slate-400">{t.categoriesSubtitle}</p>
        </div>
      </div>

      {/* Multi-segment visual bar */}
      <div className="mt-5">
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCatName(cat.name)}
              className="h-full cursor-pointer hover:brightness-125 transition-all relative group"
              style={{
                width: `${Math.max(2, cat.percent)}%`,
                backgroundColor: cat.color
              }}
              title={`${cat.name}: ${cat.percent}% (${cat.robux.toLocaleString()} R$)`}
            ></div>
          ))}
        </div>

        {/* Legend Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat, idx) => {
            const isSelected = cat.name === activeCategory.name;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCatName(cat.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-white/10 border-white/30 text-white shadow-sm'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                <span>{getTranslatedCatName(cat.name)}</span>
                <span className="font-mono text-slate-300 font-bold">{cat.percent}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Deep Dive Card */}
      {activeCategory && (
        <div className="mt-6 p-5 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeCategory.color }}></span>
                <h3 className="text-base font-bold text-white">{getTranslatedCatName(activeCategory.name)}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                <strong className="text-white">{activeCategory.percent}%</strong> ({activeCategory.robux.toLocaleString()} R$)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Robux</span>
                <strong className="text-base text-roblox-accent font-bold">
                  {activeCategory.robux.toLocaleString()} R$
                </strong>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Est. USD</span>
                <strong className="text-base text-emerald-400 font-bold">
                  ${activeCategory.estUsd?.toFixed(2) || (activeCategory.robux * 0.0125).toFixed(2)}
                </strong>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">{t.purchasesCountLabel}</span>
                <strong className="text-base text-white font-bold">
                  {activeCategory.purchases}
                </strong>
              </div>
            </div>
          </div>

          {/* Top Items within Category */}
          {activeCategory.items && activeCategory.items.length > 0 && (
            <div className="mt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {t.topItemsInCategory}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeCategory.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-200 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 font-mono text-xs">
                      <span className="text-[11px] text-slate-400">x{item.qty}</span>
                      <span className="font-bold text-roblox-accent">
                        {item.robux.toLocaleString()} R$
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
