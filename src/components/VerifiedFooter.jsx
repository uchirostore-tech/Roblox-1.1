import React from 'react';
import { CheckCircle2, Radio, FileText, Lock, Clock, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

export default function VerifiedFooter({ verifiedData = {}, lang = 'km' }) {
  const t = translations[lang] || translations.km;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B]">
      
      {/* Main Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{t.verifiedTitle}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Real Live Check
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.verifiedSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Auto-purge in 60m</span>
        </div>
      </div>

      {/* 4 Trust Highlights Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2.5">
          <Radio className="w-4 h-4 text-roblox-accent flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold">{t.auditSources}</strong>
            <span className="text-slate-400 text-[11px]">Purchases, dev products, stipends, passes</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold">Scanned {verifiedData.pagesScanned || 1} Pages</strong>
            <span className="text-slate-400 text-[11px]">Chronological analysis of raw transactions</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold">{t.auditLocal}</strong>
            <span className="text-slate-400 text-[11px]">Zero remote telemetry, strictly memory-based</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold">{t.auditPurge}</strong>
            <span className="text-slate-400 text-[11px]">Automatic background garbage collection</span>
          </div>
        </div>
      </div>

      {/* Bottom version note */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>Roblox Pulse V1 (រ៉ូប្លក ភល្ស V1) • Professional Spending & Account Intelligence</span>
        <span className="font-mono text-emerald-400 font-bold">● Active Ephemeral Session</span>
      </div>

    </div>
  );
}
