import React, { useState, useEffect } from 'react';
import { 
  Search, UserCheck, Shield, ExternalLink, Calendar, Copy, Check, Sparkles, 
  Gem, Award, Users, RefreshCw, AlertCircle, Eye, UserPlus, QrCode, 
  Gamepad2, Download, Send, Globe, Flame, Clock, HeartHandshake, ShieldCheck
} from 'lucide-react';
import AddFriendQrModal from './AddFriendQrModal';
import { translations } from '../translations';

export default function AccountChecker({ lang = 'km', currency = 'USD' }) {
  const t = translations[lang] || translations.km;

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [avatarView, setAvatarView] = useState('full'); // 'full' | 'bust' | 'headshot'
  const [activeSubTab, setActiveSubTab] = useState('collectibles'); // 'collectibles' | 'games' | 'badges' | 'groups' | 'qr'
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Quick Preset Accounts for 1-Tap Testing
  const quickPresets = [
    { name: 'Builderman', label: 'Builderman' },
    { name: 'eli_uth', label: 'NOX (@eli_uth)' },
    { name: 'Roblox', label: 'Roblox' },
    { name: 'KreekCraft', label: 'KreekCraft' }
  ];

  // Auto-search on mount if URL has ?user= or ?u=
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('user') || params.get('u');
      if (userParam) {
        setQuery(userParam);
        handleSearch(userParam);
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }
  }, []);

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
      // Auto-set default active subtab based on data available
      if (data.profile.counts.collectibles > 0) {
        setActiveSubTab('collectibles');
      } else if (data.profile.counts.games > 0) {
        setActiveSubTab('games');
      } else if (data.profile.counts.badges > 0) {
        setActiveSubTab('badges');
      } else {
        setActiveSubTab('qr');
      }
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyProfileLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const downloadAvatar = (imgUrl, name) => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `roblox-avatar-${name}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Search Header Bar */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#121624] via-[#141828] to-[#0E1017] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-roblox-accent to-purple-600 text-white shadow-lg shadow-blue-500/20">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  {t.searchTitle}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-roblox-accent/20 text-roblox-accent border border-roblox-accent/30">
                  Super Detail V1.1
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                {t.searchSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-4 flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-black/60 text-white placeholder-slate-500 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-roblox-accent font-medium transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-roblox-accent via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex-shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'km' ? 'កំពុងស្វែងរក...' : 'Inspecting...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.btnInspect}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Test Preset Chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[11px] text-slate-400 font-medium">
            {t.quickTryLabel}
          </span>
          {quickPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setQuery(preset.name);
                handleSearch(preset.name);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              @{preset.label}
            </button>
          ))}
        </div>

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
          
          {/* Main User Card (Super Detailed Hero) */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121624] via-[#10131E] to-[#0A0B0E] shadow-2xl overflow-hidden relative">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Avatar Column with Render Switcher (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-black/70 border border-white/10 shadow-2xl">
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
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-all duration-300"
                  />

                  {/* Presence Badge on Avatar */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold shadow-lg">
                    <span className={`w-2 h-2 rounded-full ${
                      profile.presence.type === 2 ? 'bg-emerald-400 animate-pulse' :
                      profile.presence.type === 1 ? 'bg-blue-400' :
                      profile.presence.type === 3 ? 'bg-amber-400' : 'bg-slate-500'
                    }`}></span>
                    <span className="text-white">
                      {profile.presence.type === 1 ? t.statusOnline :
                       profile.presence.type === 2 ? (profile.presence.gameTitle ? `Playing: ${profile.presence.gameTitle}` : t.statusInGame) :
                       profile.presence.type === 3 ? t.statusStudio : t.statusOffline}
                    </span>
                  </div>
                </div>

                {/* Avatar Perspective Switcher */}
                <div className="mt-3 flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setAvatarView('full')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      avatarView === 'full' ? 'bg-roblox-accent text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Full Body
                  </button>
                  <button
                    onClick={() => setAvatarView('bust')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      avatarView === 'bust' ? 'bg-roblox-accent text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bust
                  </button>
                  <button
                    onClick={() => setAvatarView('headshot')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      avatarView === 'headshot' ? 'bg-roblox-accent text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Headshot
                  </button>
                </div>

                {/* Download PFP Button */}
                <button
                  onClick={() => downloadAvatar(profile.avatarUrl || profile.headshotUrl, profile.name)}
                  className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>{t.downloadPfp}</span>
                </button>
              </div>

              {/* Profile Details (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Name & Badges Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {profile.displayName}
                      </h3>
                      {profile.hasVerifiedBadge && (
                        <span className="p-1 rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/30" title={t.verifiedLabel}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                        {profile.accountTier}
                      </span>
                      {profile.isBanned && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                          {t.bannedLabel}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="text-slate-300 font-mono font-bold">@{profile.name}</span>
                      <span>•</span>
                      <button
                        onClick={() => copyId(profile.id)}
                        className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-mono"
                        title="Click to copy User ID"
                      >
                        <span>ID: {profile.id}</span>
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  {/* External Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={profile.robloxProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-roblox-accent" />
                      <span>Roblox</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href={profile.rolimonsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-xs font-semibold text-purple-300 border border-purple-500/30 transition-colors"
                    >
                      <Gem className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rolimons RAP</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Account Age Banner */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-roblox-accent" />
                    <span>
                      {t.accountAgeLabel}: <strong className="text-white font-mono">{profile.ageYears} {t.yearsLabel}</strong> ({profile.ageDays.toLocaleString()} {t.daysLabel})
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {t.createdDateLabel}: <strong className="text-slate-200 font-mono">{new Date(profile.created).toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</strong>
                  </span>
                </div>

                {/* Bio / Description */}
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">About / Bio</span>
                  <p className="line-clamp-2 leading-relaxed">{profile.description}</p>
                </div>

                {/* ✨ HERO ACTION: ADD FRIEND & QR CODE BUTTONS (USER REQUESTED) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black/50 border border-roblox-accent/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-roblox-accent to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        {lang === 'km' ? 'តើអ្នកចង់រាប់អាន ឬ Add Friend ទេ?' : 'Connect & Add Friend'}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {lang === 'km' ? 'ចុច Add ផ្ទាល់ក្នុង Roblox App ឬស្កេន QR Code' : 'Add directly in Roblox app or scan QR Code'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Deep-link / Web Add Friend */}
                    <a
                      href={profile.robloxAddFriendDeepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-roblox-accent to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t.btnAddFriend}</span>
                    </a>

                    {/* QR Code Trigger Button */}
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-xs transition-all shadow-md"
                    >
                      <QrCode className="w-3.5 h-3.5 text-purple-400" />
                      <span>{t.btnShowQr}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* 4 Big Valuation & Economy Cards (2x2 on Mobile, 4 in row on PC) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Card 1: Estimated Account Worth */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1A1813] to-[#111116] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                <span>{t.accountWorthLabel}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-300 font-mono tracking-tight mt-1">
                {profile.valuation?.estimatedRobux?.toLocaleString()} R$
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {currency === 'KHR' 
                  ? `≈ ${(profile.valuation?.estimatedRobux * 0.0035 * 4100).toLocaleString()} KHR` 
                  : `≈ $${profile.valuation?.estimatedUsdDevex} USD`}
              </div>
            </div>

            {/* Card 2: Rolimons Total RAP */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#171322] to-[#111116] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-1">
                <span>{t.rapLabel}</span>
                <Gem className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-purple-300 font-mono tracking-tight mt-1">
                {profile.counts.totalRap > 1000000 
                  ? `${(profile.counts.totalRap / 1000000).toFixed(2)}M R$` 
                  : `${profile.counts.totalRap.toLocaleString()} R$`}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {profile.counts.collectibles} Limited Items
              </div>
            </div>

            {/* Card 3: Total Game Visits */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#111D17] to-[#111116] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                <span>{t.totalVisitsLabel}</span>
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-emerald-300 font-mono tracking-tight mt-1">
                {profile.counts.totalGameVisits?.toLocaleString() || '0'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {profile.counts.games} {lang === 'km' ? 'ហ្គេមបានបង្កើត' : 'Created Places'}
              </div>
            </div>

            {/* Card 4: Badges & Achievements */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#121927] to-[#111116] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1">
                <span>{lang === 'km' ? 'មេដាយកិត្តិយស' : 'Badges Earned'}</span>
                <Award className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-blue-300 font-mono tracking-tight mt-1">
                {profile.counts.badges?.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {profile.counts.friends} / 200 {t.friendsLabel}
              </div>
            </div>

          </div>

          {/* 6 Quick Stat Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.friendsLabel}</span>
              <strong className="text-xs font-bold text-white font-mono">{profile.counts.friends}/200</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.followersLabel}</span>
              <strong className="text-xs font-bold text-white font-mono">{profile.counts.followers.toLocaleString()}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.followingLabel}</span>
              <strong className="text-xs font-bold text-white font-mono">{profile.counts.following.toLocaleString()}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{lang === 'km' ? 'ក្រុម (Groups)' : 'Groups'}</span>
              <strong className="text-xs font-bold text-white font-mono">{profile.counts.groups}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.gamesCountLabel}</span>
              <strong className="text-xs font-bold text-white font-mono">{profile.counts.games}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Limiteds</span>
              <strong className="text-xs font-bold text-amber-400 font-mono">{profile.counts.collectibles}</strong>
            </div>
          </div>

          {/* 5 Rich Detail Showcase Tabs */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 bg-[#121520] shadow-xl">
            
            {/* Tab Buttons Navigation */}
            <div className="flex items-center gap-2 pb-4 border-b border-white/10 overflow-x-auto scrollbar-none">
              
              <button
                onClick={() => setActiveSubTab('collectibles')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSubTab === 'collectibles'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gem className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.tabCollectibles} ({profile.collectibles.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('games')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSubTab === 'games'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.tabGames} ({profile.games?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('badges')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSubTab === 'badges'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.tabBadges} ({profile.badges.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('groups')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSubTab === 'groups'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.tabGroups} ({profile.groups.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('qr')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSubTab === 'qr'
                    ? 'bg-roblox-accent text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-roblox-accent" />
                <span>{t.tabQrFriend}</span>
              </button>

            </div>

            {/* Tab 1 Content: Collectibles & Limiteds */}
            {activeSubTab === 'collectibles' && (
              <div className="pt-4">
                {profile.collectibles.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Gem className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span>{lang === 'km' ? 'គណនីនេះមិនទាន់មាន Limited Items ក្នុង Inventory នៅឡើយទេ' : 'No public limited collectibles found in inventory'}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.collectibles.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-all flex items-center gap-3"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Gem className="w-6 h-6 text-purple-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate" title={item.name}>
                            {item.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-extrabold text-amber-400 font-mono">
                              {item.rap?.toLocaleString()} R$
                            </span>
                            {item.serialNumber && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{item.serialNumber}
                              </span>
                            )}
                          </div>
                          {item.originalPrice && (
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {t.originalPriceLabel} {item.originalPrice} R$
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2 Content: Created Games */}
            {activeSubTab === 'games' && (
              <div className="pt-4">
                {!profile.games || profile.games.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Gamepad2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span>{lang === 'km' ? 'គណនីនេះមិនទាន់មានហ្គេមជាសាធារណៈនៅឡើយទេ' : 'No public created experiences found'}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {profile.games.map((game, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {game.thumbnail ? (
                              <img src={game.thumbnail} alt={game.name} className="w-full h-full object-cover" />
                            ) : (
                              <Gamepad2 className="w-6 h-6 text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate" title={game.name}>
                              {game.name}
                            </h5>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {game.description || (lang === 'km' ? 'ហ្គេម Roblox បង្កើតដោយ ' + profile.displayName : 'Roblox experience')}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-400 font-mono font-bold">
                              <span>🎮 {game.visits?.toLocaleString() || 0} {lang === 'km' ? 'ចូលលេង' : 'visits'}</span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={game.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-colors"
                        >
                          <span>{t.playOnRoblox}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3 Content: Badges Showcase */}
            {activeSubTab === 'badges' && (
              <div className="pt-4">
                {profile.badges.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span>{lang === 'km' ? 'គណនីនេះមិនទាន់មាន Badge បង្ហាញនៅឡើយទេ' : 'No badges found for this user'}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {badge.iconUrl ? (
                            <img src={badge.iconUrl} alt={badge.name} className="w-full h-full object-cover" />
                          ) : (
                            <Award className="w-6 h-6 text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate" title={badge.name}>
                            {badge.name}
                          </h5>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {badge.description}
                          </p>
                          {badge.awardedDate && (
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                              {new Date(badge.awardedDate).toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4 Content: Joined Groups */}
            {activeSubTab === 'groups' && (
              <div className="pt-4">
                {profile.groups.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span>{lang === 'km' ? 'មិនមានព័ត៌មានក្រុមនៅឡើយទេ' : 'No public groups joined'}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {profile.groups.map((group, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {group.iconUrl ? (
                            <img src={group.iconUrl} alt={group.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-bold text-white truncate" title={group.name}>
                              {group.name}
                            </h5>
                            {group.isPrimary && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">
                            {t.roleLabel} {group.role}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {group.memberCount?.toLocaleString() || '0'} {t.membersLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5 Content: Add Friend & QR Code Studio */}
            {activeSubTab === 'qr' && (
              <div className="pt-4 flex flex-col items-center">
                <div className="max-w-md w-full p-6 rounded-3xl bg-black/50 border border-white/10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-roblox-accent to-purple-600 flex items-center justify-center text-white shadow-lg mb-3">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">
                    {t.qrModalTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {t.qrModalSubtitle}
                  </p>

                  {/* Open QR Modal Button */}
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="mt-4 flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-roblox-accent to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02]"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{t.btnShowQr}</span>
                  </button>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => copyProfileLink(profile.robloxProfileUrl)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? t.linkCopiedToast : t.btnCopyLink}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Add Friend QR Modal */}
          <AddFriendQrModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            profile={profile}
            lang={lang}
          />

        </div>
      )}

    </div>
  );
}
