import React, { useState } from 'react';
import { Search, UserCheck, Shield, ExternalLink, Calendar, Copy, Check, Sparkles, Gem, Award, Users, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import { translations } from '../translations';

export default function AccountChecker({ lang = 'km' }) {
  const t = translations[lang] || translations.km;

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [avatarView, setAvatarView] = useState('full'); // 'full' | 'bust' | 'headshot'
  const [activeSubTab, setActiveSubTab] = useState('collectibles'); // 'collectibles' | 'badges' | 'groups'
  const [copied, setCopied] = useState(false);

  const handleSearch = async (searchTerm) => {
    const target = searchTerm || query;
    if (!target.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user/lookup?query=${encodeURIComponent(target.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'User not found on Roblox');
      }

      setProfile(data.profile);
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#13151B] via-[#151822] to-[#111319]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <UserCheck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  {t.searchTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.searchSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-5 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-black/50 text-white placeholder-slate-500 text-xs pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-roblox-accent font-medium transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>{t.btnInspect}</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold">Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Output */}
      {profile && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main User Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Avatar Column with Render Switcher (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="relative w-52 h-52 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-black/60 border border-white/10">
                  <img
                    src={
                      avatarView === 'full'
                        ? profile.avatarUrl
                        : avatarView === 'bust'
                        ? (profile.bustUrl || profile.avatarUrl)
                        : (profile.headshotUrl || profile.avatarUrl)
                    }
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300"
                  />

                  {/* Presence Badge on Avatar */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold">
                    <span className={`w-2 h-2 rounded-full ${
                      profile.presence.type === 2 ? 'bg-emerald-400 animate-pulse' :
                      profile.presence.type === 1 ? 'bg-blue-400' :
                      profile.presence.type === 3 ? 'bg-amber-400' : 'bg-slate-500'
                    }`}></span>
                    <span className="text-white">
                      {profile.presence.type === 1 ? t.statusOnline :
                       profile.presence.type === 2 ? t.statusInGame :
                       profile.presence.type === 3 ? t.statusStudio : t.statusOffline}
                    </span>
                  </div>
                </div>

                {/* Avatar Perspective Switcher */}
                <div className="mt-3 flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setAvatarView('full')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      avatarView === 'full' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Full Body
                  </button>
                  <button
                    onClick={() => setAvatarView('bust')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      avatarView === 'bust' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bust
                  </button>
                  <button
                    onClick={() => setAvatarView('headshot')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      avatarView === 'headshot' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Headshot
                  </button>
                </div>
              </div>

              {/* Profile Details (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Name & Badges Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-white tracking-tight">
                        {profile.displayName}
                      </h3>
                      {profile.hasVerifiedBadge && (
                        <span className="p-0.5 rounded-full bg-blue-500 text-white" title={t.verifiedLabel}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                      {profile.isBanned && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                          {t.bannedLabel}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="text-slate-300 font-medium">@{profile.name}</span>
                      <span>•</span>
                      <button
                        onClick={() => copyId(profile.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors font-mono"
                        title="Click to copy User ID"
                      >
                        <span>ID: {profile.id}</span>
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* External Profile Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={profile.robloxProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                    >
                      <span>Roblox Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                    <a
                      href={profile.rolimonsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-xs font-semibold text-purple-300 border border-purple-500/30 transition-colors"
                    >
                      <span>Rolimons RAP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Account Age Banner */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-roblox-accent" />
                    <span>
                      {t.accountAgeLabel}: <strong className="text-white">{profile.ageYears} {t.yearsLabel}</strong> ({profile.ageDays.toLocaleString()} {t.daysLabel})
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {t.createdDateLabel}: {new Date(profile.created).toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Bio / Description */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-300 line-clamp-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">About</span>
                  {profile.description}
                </div>

                {/* 6 Key Stat Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.rapLabel}</span>
                    <strong className="text-xs font-bold text-amber-400 font-mono">
                      {profile.counts.totalRap > 1000000 
                        ? `${(profile.counts.totalRap / 1000000).toFixed(1)}M R$` 
                        : `${profile.counts.totalRap.toLocaleString()} R$`}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Limiteds</span>
                    <strong className="text-xs font-bold text-white font-mono">{profile.counts.collectibles}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.friendsLabel}</span>
                    <strong className="text-xs font-bold text-white font-mono">{profile.counts.friends}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.followersLabel}</span>
                    <strong className="text-xs font-bold text-white font-mono">{profile.counts.followers.toLocaleString()}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Groups</span>
                    <strong className="text-xs font-bold text-white font-mono">{profile.counts.groups}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Badges</span>
                    <strong className="text-xs font-bold text-white font-mono">{profile.counts.badges}</strong>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Subtabs: Collectibles / Badges / Groups */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#13151B]">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <button
                onClick={() => setActiveSubTab('collectibles')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'collectibles'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.tabCollectibles} ({profile.collectibles.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('badges')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'badges'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>{t.tabBadges} ({profile.badges.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('groups')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === 'groups'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.tabGroups} ({profile.groups.length})</span>
              </button>
            </div>

            {/* Subtab Contents */}
            <div className="mt-4">
              {activeSubTab === 'collectibles' && (
                profile.collectibles.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No public limited or collectible assets found in inventory.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.collectibles.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between hover:border-white/20 transition-all"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            {item.serialNumber ? `#${item.serialNumber}` : 'Standard Edition'}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono text-xs font-extrabold text-amber-400 block">
                            {item.rap.toLocaleString()} R$
                          </span>
                          <span className="text-[9px] text-slate-500">RAP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeSubTab === 'badges' && (
                profile.badges.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No public badges visible.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3 hover:border-white/20 transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-amber-400">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{badge.description || 'Awarded in-game'}</p>
                          <span className="text-[9px] text-slate-500 block mt-1">
                            {badge.awardedDate ? new Date(badge.awardedDate).toLocaleDateString() : 'Awarded'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeSubTab === 'groups' && (
                profile.groups.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No public groups joined.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.groups.map((group, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between hover:border-white/20 transition-all"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-white truncate">{group.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            Role: <strong className="text-slate-300">{group.role}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                          {group.memberCount.toLocaleString()} members
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
