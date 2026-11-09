import React from 'react';
import { DollarSign, Coins, ShoppingBag, Wallet, Calendar, Check, ArrowUpRight, Calculator, Sparkles, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

export default function HeroStats({ metrics, user, currency = 'USD', lang = 'km', onOpenCalculator }) {
  const t = translations[lang] || translations.km;

  const currencyRates = {
    USD: { symbol: '$', rate: 1 },
    KHR: { symbol: '៛', rate: 4050 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    CAD: { symbol: 'C$', rate: 1.36 }
  };

  const currentRate = currencyRates[currency] || currencyRates.USD;
  const formatMoney = (usdVal) => {
    const val = Number(usdVal ?? 0);
    const converted = val * currentRate.rate;
    if (currency === 'KHR') {
      return `${Math.round(converted).toLocaleString()} ${currentRate.symbol}`;
    }
    return `${currentRate.symbol}${converted.toFixed(2)}`;
  };

  const realMoneyVal = Number(metrics?.realMoneySpentUSD ?? 0);
  const robuxPurchasedVal = Number(metrics?.robuxPurchased ?? 0);
  const robuxSpentVal = Number(metrics?.robuxSpent ?? 0);
  const premiumMonthsVal = Number(metrics?.premiumMonths ?? 0);
  const currentBalanceVal = Number(user?.robuxBalance ?? 0);

  // Detect zero spending / zero Robux accounts
  const isZeroAccount = robuxSpentVal === 0 && robuxPurchasedVal === 0 && realMoneyVal === 0;

  return (
    <div className="space-y-4">
      
      {/* Account Identity Banner */}
      {user && (
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#111318] shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
            
            {/* User Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={user.userId ? `/api/avatar-icon/${user.userId}` : (user.avatarUrl || "https://tr.rbxcdn.com/30DAY-Avatar-02387742CD56E433FE1D4B21CC0A79AA-Png/420/420/Avatar/Png/noFilter")}
                  alt={user.displayName || user.username}
                  referrerPolicy="no-referrer"
                  className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl object-cover bg-black/50 border border-white/10 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-[#111318]" title="Active"></span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className="font-black text-white text-base sm:text-2xl tracking-tight truncate">
                    {user.displayName || user.username || 'Robloxian'}
                  </h2>
                  {user.hasVerifiedBadge && (
                    <span className="p-0.5 rounded-full bg-blue-500 text-white flex-shrink-0" title={t.verifiedLabel}>
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 font-mono">
                  <span className="text-roblox-accent font-bold">@{user.username || 'user'}</span>
                  <span>•</span>
                  <span className="text-slate-300">ID: {user.userId || user.id || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Account Age, Join Date & Balance (Optimized 2-col on mobile, flex on desktop) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <div className="p-2.5 sm:p-3 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2 sm:gap-2.5 col-span-2 sm:col-span-1">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-roblox-accent flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">{t.accountAgeLabel}</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-white truncate block">
                    {user.ageYears || '0.0'} {t.yearsLabel} <span className="text-slate-400 font-normal text-[11px]">({user.ageDays?.toLocaleString() || '0'} {t.daysLabel})</span>
                  </strong>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">{t.createdDateLabel}</span>
                <strong className="text-xs sm:text-xs font-bold text-slate-200 block truncate">
                  {user.created ? new Date(user.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </strong>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-xl border ${
                currentBalanceVal > 0 
                  ? 'bg-emerald-500/10 border-emerald-500/20' 
                  : 'bg-slate-800/40 border-white/10'
              }`}>
                <span className={`text-[9px] sm:text-[10px] uppercase font-bold block ${currentBalanceVal > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {t.statCurrentBalance}
                </span>
                <strong className={`text-xs sm:text-sm font-black font-mono block truncate ${currentBalanceVal > 0 ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {currentBalanceVal.toLocaleString()} R$
                </strong>
              </div>

              {user.userId && (
                <a
                  href={user.profileUrl || `https://www.roblox.com/users/${user.userId}/profile`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 sm:col-span-1 px-3 py-2 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Roblox Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Prominent F2P Zero Spending Notification Banner */}
      {isZeroAccount && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#10192A] to-blue-950/40 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-fadeIn">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-xl sm:text-2xl shadow-lg shadow-emerald-500/20">
            🎮
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-base font-extrabold text-white">
                {lang === 'km' 
                  ? 'គណនីរបស់អ្នកមិនទាន់មានប្រវត្តិទិញ ឬចំណាយ Robux នៅឡើយទេ (Free-to-Play)' 
                  : "Your account doesn't have any Robux purchases or spending history yet (Free-to-Play)"}
              </h3>
              <span className="text-[9px] sm:text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% F2P ACCOUNT
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
              {lang === 'km'
                ? 'មិនមានកំណត់ត្រានៃការទិញ Robux ដោយប្រាក់ពិត សមាជិកភាព Premium ឬការចំណាយលើ Gamepass / Items ឡើយ។ គណនីរបស់អ្នកជាគណនីឥតគិតថ្លៃសុទ្ធសាធ!'
                : 'No direct Robux package purchases, Premium subscriptions, or in-game item transactions detected for this account.'}
            </p>
          </div>
        </div>
      )}

      {/* 4 Cards Row: 2x2 Grid on Mobile, 4-in-a-row on PC */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Card 1: REAL MONEY SPENT */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0E1015] border border-white/10 hover:border-roblox-accent/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {lang === 'km' ? 'ទឹកប្រាក់ពិត' : 'REAL MONEY SPENT'}
              </span>
              {onOpenCalculator && (
                <button
                  onClick={onOpenCalculator}
                  className="p-1 rounded-lg hover:bg-white/5 text-roblox-accent hover:text-white transition-colors text-[9px] sm:text-[10px] flex items-center gap-0.5 sm:gap-1"
                  title="View Calculator Breakdown"
                >
                  <Calculator className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Calc</span>
                </button>
              )}
            </div>
            <div className="mt-1.5 sm:mt-2">
              <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-roblox-accent font-mono tracking-tight block">
                {formatMoney(realMoneyVal)}
              </span>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400 font-medium">
            {lang === 'km' ? 'ការទិញ Robux + សមាជិកភាព' : 'Robux purchases + subscriptions'}
          </p>
        </div>

        {/* Card 2: ROBUX PURCHASED */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0E1015] border border-white/10 hover:border-roblox-accent/40 transition-all flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              {lang === 'km' ? 'ROBUX ដែលបានទិញ' : 'ROBUX PURCHASED'}
            </span>
            <div className="mt-1.5 sm:mt-2">
              <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-roblox-accent font-mono tracking-tight block">
                {robuxPurchasedVal.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400 font-medium">
            {lang === 'km' ? 'ទិញដោយប្រាក់ពិត' : 'Bought with real money'}
          </p>
        </div>

        {/* Card 3: ROBUX SPENT */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0E1015] border border-white/10 hover:border-roblox-accent/40 transition-all flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              {lang === 'km' ? 'ROBUX ដែលបានចំណាយ' : 'ROBUX SPENT'}
            </span>
            <div className="mt-1.5 sm:mt-2">
              <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-roblox-accent font-mono tracking-tight block">
                {robuxSpentVal.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400 font-medium">
            {lang === 'km' ? 'លើ Items & Gamepasses' : 'On items & gamepasses'}
          </p>
        </div>

        {/* Card 4: PREMIUM MONTHS */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0E1015] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              {lang === 'km' ? 'ខែសមាជិកភាព PREMIUM' : 'PREMIUM MONTHS'}
            </span>
            <div className="mt-1.5 sm:mt-2">
              <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-roblox-accent font-mono tracking-tight block">
                {premiumMonthsVal}
              </span>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400 font-medium">
            {lang === 'km' ? 'បានរកឃើញ Premium/BC' : 'Premium/BC detected'}
          </p>
        </div>

      </div>

    </div>
  );
}
