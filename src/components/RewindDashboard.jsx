import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowRight, Info, RefreshCw, CheckCircle, AlertCircle, Zap, Puzzle, ShieldCheck, Sparkles, Lock, Clock } from 'lucide-react';
import HeroStats from './HeroStats';
import TopGames from './TopGames';
import YearlySpending from './YearlySpending';
import CategoryBreakdown from './CategoryBreakdown';
import VerifiedFooter from './VerifiedFooter';
import { translations } from '../translations';

export default function RewindDashboard({
  data,
  isLoading,
  error,
  onAnalyze,
  currency,
  lang = 'km',
  isExtensionInstalled,
  onAutoConnect,
  onOpenExtensionModal,
  onOpenCalculator
}) {
  const t = translations[lang] || translations.km;
  const [cookieInput, setCookieInput] = useState('');
  const [showCookieGuide, setShowCookieGuide] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cookieInput.trim()) return;
    onAnalyze(cookieInput);
  };

  return (
    <div className="space-y-6">
      
      {/* 1-Click Auto-Connect Extension Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-[#111726] via-[#141B2E] to-[#121622] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 flex-shrink-0">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">{t.autoConnectTitle}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isExtensionInstalled 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {isExtensionInstalled ? '🟢 Extension Active' : 'Extension Helper'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isExtensionInstalled ? t.autoConnectDescActive : t.autoConnectDescInactive}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {isExtensionInstalled ? (
            <button
              onClick={onAutoConnect}
              disabled={isLoading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{t.scanningLedger}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{t.btnAutoConnect}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenExtensionModal}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-600/20 hover:from-purple-500/30 hover:to-blue-600/30 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-xs transition-all shadow-lg"
            >
              <Puzzle className="w-4 h-4 text-purple-400" />
              <span>{lang === 'km' ? '🔌 ដំឡើង Extension លើ Browser ផ្ទាល់' : '🔌 Install Extension Directly'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Input Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#13151B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-roblox-accent" />
            <span>{t.manualOrLabel}</span>
          </span>

          <button
            type="button"
            onClick={() => setShowCookieGuide(!showCookieGuide)}
            className="text-xs text-roblox-accent hover:text-white flex items-center gap-1 font-semibold transition-colors self-start sm:self-auto"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{t.cookieHelpLink}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="password"
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              placeholder={t.cookiePlaceholder}
              className="w-full bg-black/50 text-white placeholder-slate-500 text-xs px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-roblox-accent font-mono transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {t.localOnlyTag}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !cookieInput.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-roblox-accent hover:bg-roblox-accentHover text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.scanningLedger}</span>
              </>
            ) : (
              <>
                <span>{t.btnAnalyzeCookie}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Step-by-Step Cookie Guide Drawer */}
        {showCookieGuide && (
          <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 space-y-2 animate-fadeIn">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>ការណែនាំយក Cookie ដោយសុវត្ថិភាពក្នុងរយៈពេល 15 វិនាទី</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
              <li>បើកវិបសាយ <a href="https://www.roblox.com" target="_blank" rel="noopener noreferrer" className="text-roblox-accent underline">roblox.com</a> ហើយប្រាកដថាអ្នកបាន Log in រួចរាល់។</li>
              <li>ចុច <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10 font-mono">F12</kbd> (Developer Tools)។</li>
              <li>ចូលទៅកាន់ <strong className="text-slate-200">Application</strong> (ឬ <strong className="text-slate-200">Storage</strong>) → <strong className="text-slate-200">Cookies</strong> → <code className="text-slate-200 font-mono">roblox.com</code>។</li>
              <li>ស្វែងរក Cookie ឈ្មោះ <code className="text-amber-400 font-mono">.ROBLOSECURITY</code> ហើយ Copy តម្លៃរបស់វាទាំងអស់មកដាក់ក្នុងប្រអប់ខាងលើ!</li>
            </ol>
            <p className="text-[11px] text-slate-400 pt-1">
              💡 គន្លឹះ: អ្នកអាចប្រើប្រាស់ Extension ដើម្បីភ្ជាប់ដោយ 1-Click ស្វ័យប្រវត្តិតែម្តងដោយមិនបាច់ Copy ដោយដៃឡើយ!
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold">កំហុសក្នុងការតភ្ជាប់ / Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Sections (If Real Data is Loaded) */}
      {data ? (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Hero Stat Cards */}
          <HeroStats
            metrics={data.metrics}
            user={data.user}
            currency={currency}
            lang={lang}
            onOpenCalculator={onOpenCalculator}
          />

          {/* 2. Top Games Leaderboard */}
          <TopGames
            games={data.topGames}
            coverage={data.metrics}
            lang={lang}
          />

          {/* 3. Spending by Category */}
          <CategoryBreakdown
            categories={data.spendingByCategory}
            lang={lang}
          />

          {/* 4. Yearly Spending Timeline */}
          <YearlySpending
            yearlyData={data.yearlySpending}
            lang={lang}
          />

          {/* 5. Verified Data Audit Footer */}
          <VerifiedFooter
            verifiedData={data.verifiedData}
            lang={lang}
          />
        </div>
      ) : (
        /* Welcome / Empty Clean State (When no data has been loaded yet) */
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 bg-[#13151B]/80 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-roblox-accent/20 to-blue-600/30 border border-roblox-accent/30 flex items-center justify-center text-roblox-accent shadow-lg shadow-blue-500/10">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.welcomeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.welcomeSubtitle}
            </p>
          </div>

          {/* 3 Core Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>{t.feature1Title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>{t.feature2Title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-roblox-accent font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>{t.feature3Title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
