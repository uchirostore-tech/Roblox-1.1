import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Gamepad2, Coins } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { translations } from '../translations';

export default function ShareModal({ isOpen, onClose, data, lang = 'km' }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const t = translations[lang] || translations.km;

  if (!isOpen || !data) return null;

  const user = data.user || {};
  const metrics = data.metrics || {};
  const topGame = data.topGames?.[0] || { name: 'Roblox Experience', robuxSpent: 0 };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    triggerCelebration();

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `Roblox-Pulse-${user.username || 'Stats'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current) return;
    triggerCelebration();

    try {
      const blob = await htmlToImage.toBlob(cardRef.current);
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0E1015] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{t.shareTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.shareSubtitle}
          </p>
        </div>

        {/* The Graphic Card Container */}
        <div
          ref={cardRef}
          className="w-full rounded-2xl p-6 bg-gradient-to-br from-[#12141D] via-[#161B2B] to-[#0D101A] border-2 border-roblox-accent/40 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-roblox-accent/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-roblox-accent flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                </svg>
              </div>
              <span className="text-xs font-black tracking-wider text-white">ROBLOX PULSE V1.1</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              VERIFIED REPORT
            </span>
          </div>

          {/* User Spotlight */}
          <div className="mt-5 flex items-center gap-4 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <img
                src={user.userId ? `/api/avatar-icon/${user.userId}` : (user.avatarUrl || user.headshotUrl)}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-roblox-accent uppercase tracking-wider block">
                ROBLOXIAN ACCOUNT
              </span>
              <h4 className="text-xl font-black text-white truncate">{user.displayName || user.username}</h4>
              <p className="text-xs text-slate-400">@{user.username} • ID: {user.userId}</p>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[11px] font-bold text-blue-300">
                <span>{user.ageYears || '0.0'} {t.yearsLabel}</span>
                <span>({user.ageDays?.toLocaleString() || 0} {t.daysLabel})</span>
              </div>
            </div>
          </div>

          {/* Big Stat Display */}
          <div className="mt-5 grid grid-cols-2 gap-3 relative z-10">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.statRealMoney}</span>
              <strong className="text-xl font-black text-emerald-400 font-mono">
                ${(metrics.realMoneySpentUSD || 0).toFixed(2)}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t.statRobuxSpent}</span>
              <strong className="text-xl font-black text-roblox-accent font-mono">
                {(metrics.robuxSpent || 0).toLocaleString()} R$
              </strong>
            </div>
          </div>

          {/* Top Game Highlight */}
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <Gamepad2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Top Experience</span>
                <strong className="text-xs font-bold text-white truncate block">{topGame.name}</strong>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-400 font-mono flex-shrink-0 pl-2">
              {(topGame.robuxSpent || 0).toLocaleString()} R$
            </span>
          </div>

          {/* Card Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400 relative z-10">
            <span>🔒 Verified Real Transaction Data</span>
            <span className="font-mono text-slate-400">roblox-pulse-v1.local</span>
          </div>
        </div>

        {/* Action Buttons below card */}
        <div className="mt-5 w-full flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-roblox-accent hover:bg-roblox-accentHover text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Rendering...' : t.btnDownload}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t.copiedToast}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.btnCopyImage}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
