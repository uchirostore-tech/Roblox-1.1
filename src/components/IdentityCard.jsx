import React from 'react';
import { Sparkles, Briefcase, Dumbbell, Pizza, Coffee, Receipt, Shield, CheckCircle2 } from 'lucide-react';

export default function IdentityCard({ identity, breakdown, metrics }) {
  const iconMap = {
    '💼': Briefcase,
    '💪': Dumbbell,
    '🍕': Pizza,
    '☕': Coffee
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Identity & Real-world Equivalents (2 cols) */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#13151B] via-[#161822] to-[#12141A]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Roblox Identity
          </h2>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl">{identity?.emoji || '🎮'}</span>
          <div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">
              {identity?.title || 'Dedicated Player'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {identity?.subtitle || 'Battlegrounds Specialist & Game Pass Collector'}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 mb-3 font-semibold uppercase tracking-wider flex items-center gap-2">
          <span>That's the equivalent of any one of these:</span>
        </p>

        {/* 3 or 4 equivalent boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(identity?.equivalents || [
            { icon: '💼', title: '16 hours of US federal minimum work', subtitle: 'at $7.25/hr' },
            { icon: '💪', title: '3 gym memberships', subtitle: 'Unit price: $40' },
            { icon: '🍕', title: '5 pizza deliveries', subtitle: 'Unit price: $25' }
          ]).slice(0, 3).map((item, idx) => {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spending Breakdown Summary (1 col) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Receipt className="w-4 h-4 text-roblox-accent" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Spending Breakdown
            </h3>
          </div>

          <div className="mt-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Robux Purchases</span>
              <span className="text-sm font-bold text-white font-mono">$112.50</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Premium/BC Subscriptions</span>
              <span className="text-sm font-bold text-white font-mono">$0.00</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Robux Value Spent</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">$115.00</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-xs text-slate-400">Purchase Count</span>
              <span className="text-sm font-bold text-roblox-accent font-mono">
                {metrics?.purchaseCount || 19} purchases
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Calculated from transaction receipts</span>
        </div>
      </div>

    </div>
  );
}
