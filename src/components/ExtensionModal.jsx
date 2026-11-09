import React, { useState } from 'react';
import { X, Puzzle, Download, Check, Copy, ArrowRight, ShieldCheck, Zap, Chrome, ExternalLink } from 'lucide-react';
import { translations } from '../translations';

export default function ExtensionModal({ isOpen, onClose, isExtensionInstalled, onAutoConnect, lang = 'km' }) {
  const t = translations[lang] || translations.km;
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#141824] via-[#10131C] to-[#0A0B0E] border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-roblox-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-roblox-accent to-purple-600 text-white shadow-lg shadow-blue-500/25">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {t.extensionInstallTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                Roblox Pulse Official Extension V1.1
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mt-4 p-3.5 rounded-2xl flex items-center justify-between border border-white/10 bg-black/40 shadow-inner">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isExtensionInstalled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300">Extension:</span>
            <strong className={isExtensionInstalled ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {isExtensionInstalled ? (lang === 'km' ? '🟢 បានដំឡើងរួចរាល់' : '🟢 Installed & Active') : (lang === 'km' ? '⚪ មិនទាន់ដំឡើង' : '⚪ Not Added Yet')}
            </strong>
          </div>

          {isExtensionInstalled && (
            <button
              onClick={() => { onClose(); onAutoConnect(); }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{lang === 'km' ? 'Scan ឥឡូវនេះ' : 'Auto-Connect Now'}</span>
            </button>
          )}
        </div>

        {/* 1-Click Download Extension Zip */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-purple-950/30 border border-roblox-accent/30 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Download className="w-4 h-4 text-roblox-accent" />
              <span>{t.btnDownloadExtensionZip}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'km' ? 'ទាញយកកញ្ចប់ Extension រួច Load ចូល Browser' : 'Download unpacked package and load into browser'}
            </p>
          </div>

          <a
            href="/roblox-pulse-extension.zip"
            download="roblox-pulse-extension.zip"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-roblox-accent hover:bg-roblox-accentHover text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ទាញយក ZIP' : 'Download'}</span>
          </a>
        </div>

        {/* 3 Simple Steps Guide */}
        <div className="mt-4 space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-roblox-accent/20 text-roblox-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
              1
            </span>
            <div>
              <p className="font-semibold text-white">{t.extStep1}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {lang === 'km' ? 'ពន្លា file ZIP (Extract) ដែលបានទាញយកមកជា folder ធម្មតា។' : 'Extract the downloaded ZIP file into a folder on your computer or phone browser (Kiwi/Orion).'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-roblox-accent/20 text-roblox-accent font-bold flex items-center justify-center flex-shrink-0 text-xs">
              2
            </span>
            <div>
              <p className="font-semibold text-white">{t.extStep2}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {lang === 'km' ? 'បើកផ្ទាំងថ្មីចូលទៅ chrome://extensions រួចបើក Developer mode នៅជ្រុងខាងលើស្តាំ ហើយចុច "Load unpacked" ជ្រើសយក folder នោះ។' : 'Open a new tab at chrome://extensions, toggle Developer mode ON, and click "Load unpacked" to select the folder.'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              3
            </span>
            <div>
              <p className="font-semibold text-white">{t.extStep3}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {lang === 'km' ? 'រួចរាល់ហើយ! ត្រឡប់មកកាន់ទំព័រនេះវិញ វានឹងស្គាល់ និងបង្ហាញទិន្នន័យដោយស្វ័យប្រវត្តិ។' : 'Done! Return to this page and it will automatically connect and load your stats.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Safe • Local Only</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
}
