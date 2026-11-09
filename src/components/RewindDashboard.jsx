import React, { useState } from 'react';
import { 
  KeyRound, ShieldAlert, ArrowRight, Info, RefreshCw, CheckCircle, 
  AlertCircle, ShieldCheck, Sparkles, Lock, Clock, Eye, EyeOff, Copy, Check, ChevronDown, ChevronUp
} from 'lucide-react';
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
  onOpenCalculator
}) {
  const t = translations[lang] || translations.km;
  const [cookieInput, setCookieInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCookieGuide, setShowCookieGuide] = useState(true); // Open by default for easy access
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cookieInput.trim()) return;
    onAnalyze(cookieInput);
  };

  const handleTestNox = () => {
    setCookieInput('eli_uth');
    onAnalyze('eli_uth');
  };

  const copyCookieName = () => {
    navigator.clipboard.writeText('.ROBLOSECURITY');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Primary .ROBLOSECURITY Manual Cookie Input Bar */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121624] via-[#10131E] to-[#0A0B0E] shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-roblox-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-roblox-accent to-blue-600 text-white shadow-lg shadow-blue-500/25">
              <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{lang === 'km' ? 'ឬបញ្ចូល .ROBLOSECURITY Cookie ដោយដៃ:' : 'Paste .ROBLOSECURITY Cookie Directly:'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lang === 'km' ? 'សុវត្ថិភាព 100%' : '100% Safe'}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'km' ? 'វិភាគប្រវត្តិការចំណាយ Robux និងទឹកប្រាក់ពិតប្រាកដក្នុងគណនីរបស់អ្នក 100% គ្មានទិន្នន័យក្លែងក្លាយ' : 'Audits your real Roblox transactions, Robux expenditures, and lifetime purchases directly'}
              </p>
            </div>
          </div>

          {/* Toggle Guide Button */}
          <button
            type="button"
            onClick={() => setShowCookieGuide(!showCookieGuide)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-roblox-accent hover:text-white font-semibold transition-colors border border-white/5"
          >
            <Info className="w-3.5 h-3.5 text-roblox-accent" />
            <span>{t.cookieHelpLink}</span>
            {showCookieGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Cookie Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              placeholder={lang === 'km' ? 'បិទភ្ជាប់ (Paste) .ROBLOSECURITY Cookie នៅទីនេះ (ឧ. _|WARNING:-DO-NOT-SHARE-THIS...|_)' : 'Paste your .ROBLOSECURITY cookie here...'}
              className="w-full bg-black/60 text-white placeholder-slate-500 text-xs sm:text-sm pl-4 pr-20 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-roblox-accent font-mono transition-all shadow-inner"
            />
            
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide Cookie' : 'Show Cookie'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 hidden sm:inline">
                {t.localOnlyTag}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !cookieInput.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-roblox-accent via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex-shrink-0"
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

        {/* Quick Test Chip for NOX Account */}
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">
            {lang === 'km' ? 'សាកល្បងមើលគណនីគំរូ:' : 'Quick test verified sample:'}
          </span>
          <button
            type="button"
            onClick={handleTestNox}
            className="px-2.5 py-1 rounded-lg bg-roblox-accent/15 hover:bg-roblox-accent/25 text-roblox-accent text-[11px] font-semibold border border-roblox-accent/30 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>NOX (@eli_uth • 3986166126)</span>
          </button>
        </div>

        {/* Step-by-Step "How to get cookies" Visual Guide */}
        {showCookieGuide && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 text-xs text-slate-300 space-y-3 animate-fadeIn shadow-inner">
            <div className="font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm">
                  {lang === 'km' ? 'របៀបយក Cookie ដោយសុវត្ថិភាពក្នុងរយៈពេល 15 វិនាទី' : 'How to safely copy your cookie in 15 seconds'}
                </span>
              </div>
              <button
                type="button"
                onClick={copyCookieName}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-mono text-amber-300 transition-colors"
                title="Copy .ROBLOSECURITY"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>.ROBLOSECURITY</span>
              </button>
            </div>

            {/* 4 Step Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-5 h-5 rounded-lg bg-roblox-accent/20 text-roblox-accent flex items-center justify-center text-[11px]">1</span>
                  <span>បើក roblox.com</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  បើក <a href="https://www.roblox.com" target="_blank" rel="noopener noreferrer" className="text-roblox-accent underline">roblox.com</a> លើ Browser ហើយប្រាកដថាអ្នកបាន Log in រួចរាល់។
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-5 h-5 rounded-lg bg-roblox-accent/20 text-roblox-accent flex items-center justify-center text-[11px]">2</span>
                  <span>ចុច F12 (Inspect)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ចុច <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10 font-mono">F12</kbd> ឬចុច Right Click រួចជ្រើសយក <strong>Inspect</strong>។
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-5 h-5 rounded-lg bg-roblox-accent/20 text-roblox-accent flex items-center justify-center text-[11px]">3</span>
                  <span>ចូល Application</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ចូលទៅ Tab <strong className="text-slate-200">Application</strong> (ឬ Storage) ➔ <strong className="text-slate-200">Cookies</strong> ➔ <code className="text-slate-200 font-mono">roblox.com</code>។
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px]">4</span>
                  <span>Copy & Paste</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ស្វែងរកឈ្មោះ <code className="text-amber-400 font-mono">.ROBLOSECURITY</code> ចុចពីរដងលើតម្លៃ រួច Copy មកដាក់ក្នុងប្រអប់ខាងលើ!
                </p>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 border-t border-white/5">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>
                {lang === 'km' 
                  ? '🔒 សុវត្ថិភាព ១០០%: Cookie ដំណើរការក្នុង RAM បណ្តោះអាសន្ន និងលុបចោលស្វ័យប្រវត្តរៀងរាល់ 1 ម៉ោង (Auto-Purge 60min) គ្មានការរក្សាទុក Password ឬ Hack ឡើយ!'
                  : '🔒 100% Safe: Cookie is processed strictly in volatile RAM and automatically purged every 1 hour.'}
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
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
        /* Welcome / Empty Clean State */
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
