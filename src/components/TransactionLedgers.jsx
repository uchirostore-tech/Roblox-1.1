import React, { useState } from 'react';
import { CreditCard, Users, Store, Shield, Search, ArrowUpCircle, ArrowDownCircle, ArrowUpDown } from 'lucide-react';

export default function TransactionLedgers({
  robuxFromMoney = {},
  creatorPurchases = {},
  robloxPurchases = {},
  membershipHistory = {}
}) {
  const [activeLedgerTab, setActiveLedgerTab] = useState('money'); // 'money' | 'creator' | 'roblox' | 'membership'
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' | 'largest'
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'money', label: 'Robux from Money', icon: CreditCard, count: robuxFromMoney.purchasesCount || 19 },
    { id: 'creator', label: 'Creator Purchases', icon: Users, count: creatorPurchases.purchasesCount || 83 },
    { id: 'roblox', label: 'Roblox Purchases', icon: Store, count: robloxPurchases.purchasesCount || 5 },
    { id: 'membership', label: 'Membership History', icon: Shield, count: membershipHistory.months || 0 }
  ];

  // Pick dataset based on tab
  let currentItems = [];
  let headerMetrics = null;

  if (activeLedgerTab === 'money') {
    currentItems = robuxFromMoney.items || [];
    headerMetrics = {
      title: 'Direct purchases + Premium/BC stipends',
      usd: robuxFromMoney.totalUsd || 112.50,
      robux: robuxFromMoney.totalRobux || 9200,
      count: robuxFromMoney.purchasesCount || 19,
      isPositive: true
    };
  } else if (activeLedgerTab === 'creator') {
    currentItems = creatorPurchases.items || [];
    headerMetrics = {
      title: 'Purchases from users, groups, and developers',
      usd: creatorPurchases.totalUsd || 105.81,
      robux: creatorPurchases.totalRobux || 8465,
      count: creatorPurchases.purchasesCount || 83,
      isPositive: false
    };
  } else if (activeLedgerTab === 'roblox') {
    currentItems = robloxPurchases.items || [];
    headerMetrics = {
      title: 'Game passes and items sold directly by Roblox',
      usd: robloxPurchases.totalUsd || 9.19,
      robux: robloxPurchases.totalRobux || 735,
      count: robloxPurchases.purchasesCount || 5,
      isPositive: false
    };
  }

  // Filter & Sort
  const filteredItems = currentItems
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.date.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const valA = Math.abs(a.robux);
      const valB = Math.abs(b.robux);
      if (sortOrder === 'largest') {
        return valB - valA;
      }
      return 0; // retain chronological recent ordering
    });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B]">
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeLedgerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveLedgerTab(tab.id); setSearchQuery(''); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-roblox-accent text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort & Search Toolbar */}
        {activeLedgerTab !== 'membership' && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items or dates..."
                className="bg-black/40 text-xs text-white pl-8 pr-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-roblox-accent w-40 sm:w-48 placeholder-slate-500"
              />
            </div>

            <button
              onClick={() => setSortOrder(s => s === 'recent' ? 'largest' : 'recent')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/20"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3 h-3 text-roblox-accent" />
              <span className="capitalize">{sortOrder}</span>
            </button>
          </div>
        )}
      </div>

      {/* Membership History Screen */}
      {activeLedgerTab === 'membership' ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-white">Membership History</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Detected from stipend transactions. No Builders Club or Roblox Premium subscription payments were found in the scanned transaction period.
          </p>
          <div className="mt-4 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs text-slate-300">
            0 Premium Months Logged
          </div>
        </div>
      ) : (
        <>
          {/* Header Summary for Current Tab */}
          {headerMetrics && (
            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-slate-400">{headerMetrics.title}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-white font-mono">
                    ${headerMetrics.usd.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">Total USD</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Robux</span>
                  <span className={`text-base font-black font-mono ${headerMetrics.isPositive ? 'text-emerald-400' : 'text-roblox-accent'}`}>
                    {headerMetrics.isPositive ? '+' : ''}{headerMetrics.robux.toLocaleString()} R$
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Purchases</span>
                  <span className="text-base font-black text-white font-mono">
                    {headerMetrics.count}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="mt-4 max-h-[380px] overflow-y-auto divide-y divide-white/5 pr-1">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching transactions found.
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isPositive = item.robux > 0;
                return (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isPositive ? (
                        <ArrowUpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-slate-500 group-hover:text-rose-400 flex-shrink-0 transition-colors" />
                      )}

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 pl-3">
                      <span className={`font-mono text-xs font-extrabold ${
                        isPositive ? 'text-emerald-400' : 'text-slate-300 group-hover:text-rose-300'
                      }`}>
                        {isPositive ? `+${item.robux.toLocaleString()}` : `${item.robux.toLocaleString()}`} R$
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

    </div>
  );
}
