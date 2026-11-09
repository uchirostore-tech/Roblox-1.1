import React, { useState } from 'react';
import { Sparkles, Trash2, Globe, Clock, ShieldCheck, Flame, UserCheck, HelpCircle, Camera, ChevronDown, Calculator, Zap, Heart, Send, KeyRound } from 'lucide-react';
import { translations } from '../translations';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  lang = 'km', 
  setLang,
  currency, 
  setCurrency,
  onClearSession,
  purgeTimeRemaining,
  hasActiveData,
  onOpenShare,
  onOpenCalculator,
  onOpenDonate,
  onOpenHelp
}) {
  const t = translations[lang] || translations.km;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'KHR', symbol: '៛', rate: 4050 },
    { code: 'EUR', symbol: '€', rate: 0.92 },
    { code: 'GBP', symbol: '£', rate: 0.79 },
    { code: 'CAD', symbol: 'C$', rate: 1.36 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#0A0B0E]/95 backdrop-blur-md">
      
      {/* Top Helper Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/" className="font-bold text-white flex items-center gap-1.5 sm:gap-2 group">
            <img src="/logo.svg" alt="Roblox Pulse" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
            <span className="tracking-tight text-xs sm:text-sm">
              ROBLOX <span className="text-roblox-accent">PULSE</span>
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-roblox-accent/20 text-roblox-accent font-mono text-[9px] sm:text-[10px] border border-roblox-accent/40 font-bold">
              V1.1
            </span>
          </a>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-400">
            {lang === 'km' ? 'ការវិភាគការចំណាយ Roblox របស់អ្នកពេញលេញ' : 'Your complete Roblox spending analysis'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
          {/* Creator Attribution */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 hidden xs:inline">By</span>
            <a 
              href="https://t.me/noreakyout" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-roblox-accent font-mono font-bold transition-colors"
            >
              @noreakyout
            </a>
            <span className="text-slate-600">•</span>
            <a 
              href="https://t.me/uchirostore" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>@uchirostore</span>
            </a>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          <button
            onClick={onOpenHelp}
            className="hover:text-roblox-accent transition-colors hidden sm:flex items-center gap-1"
          >
            <span>How does this work?</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setLang('km')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                lang === 'km' ? 'bg-roblox-accent text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇰🇭 ខ្មែរ
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                lang === 'en' ? 'bg-roblox-accent text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar with Buttons */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:h-16 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
        
        {/* Left: Mode Switcher */}
        <div className="flex items-center bg-[#13151B] p-1 rounded-xl border border-white/10 shadow-inner flex-shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-roblox-accent via-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'km' ? '🔍 ពិនិត្យគណនី & QR' : '🔍 Profile & QR'}</span>
          </button>

          <button
            onClick={() => setActiveTab('rewind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rewind'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'km' ? '🔑 វិភាគចំណាយ (Cookie)' : '🔑 Spending (Cookie)'}</span>
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Donate Button */}
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-400 hover:via-pink-500 hover:to-amber-400 text-white text-xs font-extrabold shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02]"
            title="Donate to Creator (@noreakyout)"
          >
            <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
            <span>{lang === 'km' ? '💖 ឧបត្ថម្ភ' : '💖 Donate'}</span>
          </button>

          {/* Calculator Button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#13151B] hover:bg-[#1A1D26] text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
            title="Open Real Money Calculator"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{lang === 'km' ? 'គិតលេខ' : 'Calculator'}</span>
          </button>

          {/* Share Image Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-roblox-accent hover:bg-roblox-accentHover text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            title="Share Image"
          >
            <Camera className="w-3.5 h-3.5 fill-white" />
            <span className="hidden xs:inline">{lang === 'km' ? 'ចែករំលែក' : 'Share'}</span>
          </button>

          {/* Advanced Features Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#13151B] hover:bg-[#1A1D26] text-slate-200 border border-white/10 text-xs font-bold transition-all"
            >
              <span className="hidden md:inline">Advanced Features</span>
              <span className="md:hidden text-xs">{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showAdvanced && (
              <div className="absolute right-0 mt-2 w-52 p-2 rounded-2xl bg-[#13151B] border border-white/15 shadow-2xl z-50 animate-fadeIn space-y-1">
                <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Currency ({currency})
                </div>
                {currencies.map(c => (
                  <button
                    key={c.code}
                    onClick={() => { setCurrency(c.code); setShowAdvanced(false); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      currency === c.code ? 'bg-roblox-accent text-white' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{c.code} ({c.symbol})</span>
                    {currency === c.code && <span className="text-[10px]">Active</span>}
                  </button>
                ))}

                {hasActiveData && (
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => { onClearSession(); setShowAdvanced(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.clearSessionBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
