import React, { useState } from 'react';
import { ExternalLink, Gamepad2 } from 'lucide-react';
import { translations } from '../translations';

export default function TopGames({ games = [], coverage, lang = 'km' }) {
  const t = translations[lang] || translations.km;
  const [sortMode, setSortMode] = useState('robux'); // 'robux' or 'purchases'

  const sortedGames = [...games].sort((a, b) => {
    if (sortMode === 'robux') {
      return (b.robuxSpent || 0) - (a.robuxSpent || 0);
    }
    return (b.purchases || 0) - (a.purchases || 0);
  });

  const covMapped = coverage?.coverageMapped ?? 0;
  const covTotal = coverage?.coverageTotal ?? 0;
  const covPercent = coverage?.coveragePercent ?? 0;

  if (sortedGames.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-[#0E1015] border border-white/10 shadow-xl text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
          <Gamepad2 className="w-6 h-6 text-roblox-accent" />
        </div>
        <h3 className="text-base font-bold text-white">
          {lang === 'km' ? 'មិនទាន់មានទិន្នន័យទិញក្នុងហ្គេមនៅឡើយទេ' : 'No in-game purchases found'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {lang === 'km' 
            ? 'គណនីរបស់អ្នកមិនទាន់មានប្រវត្តិទិញ Game Passes, Developer Products ឬ VIP Servers ក្នុងហ្គេម Roblox ណាមួយនៅឡើយទេ។' 
            : 'Your account has not purchased any Game Passes, Developer Products, or VIP Servers in any Roblox games yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-[#0E1015] border border-white/10 shadow-xl">
      
      {/* Header matching Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Top Games
        </h2>

        {/* Tab Pills: [Top Robux] [Most Purchases] */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setSortMode('robux')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortMode === 'robux'
                ? 'bg-[#181B22] text-white border border-white/20 shadow-sm'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            Top Robux
          </button>
          <button
            onClick={() => setSortMode('purchases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortMode === 'purchases'
                ? 'bg-[#181B22] text-white border border-white/20 shadow-sm'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            Most Purchases
          </button>
        </div>
      </div>

      {/* Explanatory subtext matching Screenshot */}
      <div className="text-xs text-slate-400 space-y-0.5 pt-1">
        <p>Based on purchase transactions that include game metadata.</p>
        <p>Click a row to open the game on Roblox.</p>
        <p className="text-slate-300 font-semibold pt-1">
          Coverage: <strong className="text-white">{covMapped}</strong> of <strong className="text-white">{covTotal}</strong> purchases mapped to a game (<span className="text-roblox-accent font-bold">{covPercent}%</span>)
        </p>
      </div>

      {/* Games List Table */}
      <div className="mt-4 divide-y divide-white/5 border border-white/5 rounded-xl overflow-hidden bg-black/30">
        {sortedGames.map((game, index) => {
          const rank = index + 1;
          return (
            <a
              key={game.id || index}
              href={game.url || `https://www.roblox.com/games/${game.placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Rank Number */}
                <span className="w-5 text-center text-xs font-bold text-slate-400 font-mono flex-shrink-0">
                  {rank}
                </span>

                {/* Real Game Icon Thumbnail */}
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    src={game.placeId ? `/api/place-icon/${game.placeId}` : (game.iconUrl || "https://tr.rbxcdn.com/180DAY-8c9483d381a2da30608e6b1bce490bef/150/150/Image/Png/noFilter")}
                    alt={game.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (game.iconUrl && !e.currentTarget.src.includes('proxy')) {
                        e.currentTarget.src = `/api/image-proxy?url=${encodeURIComponent(game.iconUrl)}`;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                {/* Game Title & Purchase Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white group-hover:text-roblox-accent transition-colors truncate">
                      {game.name}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {game.purchases} {game.purchases === 1 ? 'purchase' : 'purchases'} | Last purchase: {game.lastPurchase}
                  </p>
                </div>
              </div>

              {/* Robux Spent */}
              <div className="flex flex-col items-end flex-shrink-0 pl-3">
                <span className="font-mono font-extrabold text-sm sm:text-base text-roblox-accent group-hover:brightness-125 transition-all">
                  {(game.robuxSpent || 0).toLocaleString()} R$
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ~${((game.robuxSpent || 0) * 0.0125).toFixed(2)} USD
                </span>
              </div>
            </a>
          );
        })}
      </div>

    </div>
  );
}
