import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Send, Copy, Check, ExternalLink, X, UserPlus, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { translations } from '../translations';

export default function AddFriendQrModal({ isOpen, onClose, profile, lang = 'km' }) {
  const t = translations[lang] || translations.km;
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef(null);

  const profileUrl = profile ? `https://www.roblox.com/users/${profile.id}/profile` : '';
  const appDeepLink = profile ? `roblox://navigation/user_profile?userId=${profile.id}` : '';

  useEffect(() => {
    if (!profile) return;

    // Generate high-resolution QR Code
    QRCode.toDataURL(profileUrl, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#08090C',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR Code:', err));
  }, [profile, profileUrl]);

  if (!isOpen || !profile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `roblox-add-friend-${profile.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareTelegram = () => {
    const text = `Add ${profile.displayName} (@${profile.name}) on Roblox! 🎮\nProfile: ${profileUrl}\n\nChecked with Roblox Pulse V1.1 by @noreakyout (https://t.me/uchirostore)`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#141824] via-[#10131C] to-[#0A0B0E] border border-white/10 p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-gradient-to-br from-roblox-accent/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-roblox-accent to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{t.qrModalTitle}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-[11px] text-slate-400">
                @{profile.name} • ID: {profile.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="mt-4 flex flex-col items-center" ref={cardRef}>
          <div className="relative p-4 rounded-3xl bg-white shadow-2xl shadow-blue-500/15 border-4 border-white/90">
            {qrDataUrl ? (
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                <img 
                  src={qrDataUrl} 
                  alt={`Add Friend QR - ${profile.name}`} 
                  className="w-full h-full object-contain rounded-xl"
                />
                
                {/* Centered Avatar Badge in QR */}
                <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0A0B0E] p-1 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={profile.headshotUrl || profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ) : (
              <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center bg-slate-100 rounded-xl">
                <span className="text-xs text-slate-500 font-semibold">Generating QR Code...</span>
              </div>
            )}
          </div>

          {/* User Micro-Badge */}
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <span className="font-bold text-white">{profile.displayName}</span>
            <span className="text-slate-500">(@{profile.name})</span>
            {profile.hasVerifiedBadge && (
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
            )}
          </div>

          {/* Instruction Pill */}
          <div className="mt-2 text-center text-xs text-slate-300 max-w-xs flex items-center justify-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-roblox-accent flex-shrink-0" />
            <span>{t.scanInstruction}</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="mt-5 space-y-2.5">
          {/* 1-Click Open in App / Add Friend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={appDeepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-roblox-accent to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.btnAddFriend}</span>
            </a>

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4 text-slate-300" />
              <span>{t.btnOpenProfile}</span>
            </a>
          </div>

          {/* Download & Share Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleDownloadQr}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
              title="Download QR Image"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">{lang === 'km' ? 'ទាញយក QR' : 'Save QR'}</span>
            </button>

            <button
              onClick={handleShareTelegram}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-xs font-semibold text-[#229ED9] border border-[#229ED9]/30 transition-colors"
              title="Share to Telegram"
            >
              <Send className="w-4 h-4" />
              <span className="text-[11px]">Telegram</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
              title="Copy Profile URL"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span className="text-[11px]">{isCopied ? t.copiedToast : (lang === 'km' ? 'Copy Link' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center text-[10px] text-slate-400">
          Make by <a href="https://t.me/noreakyout" target="_blank" rel="noopener noreferrer" className="text-roblox-accent font-mono font-bold hover:underline">@noreakyout</a> • Channel <a href="https://t.me/uchirostore" target="_blank" rel="noopener noreferrer" className="text-roblox-accent font-mono font-bold hover:underline">@uchirostore</a>
        </div>

      </div>
    </div>
  );
}
