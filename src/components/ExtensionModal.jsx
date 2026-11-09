import React, { useState } from 'react';
import { X, Puzzle, ExternalLink, Check, Copy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function ExtensionModal({ isOpen, onClose, isExtensionInstalled, onAutoConnect }) {
  const [copied, setCopied] = useState(false);
  const extensionPath = "C:\\Users\\NTC COMPUTER\\.gemini\\antigravity\\scratch\\roblox-checker-rewind\\extension";

  if (!isOpen) return null;

  const copyPath = () => {
    navigator.clipboard.writeText(extensionPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0E1015] border border-white/10 rounded-3xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-roblox-accent border border-roblox-accent/30">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Roblox Rewind Auto-Connector Extension
              </h3>
              <p className="text-xs text-slate-400">
                Auto-detect your active Roblox login without manually copying cookies
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
        <div className="mt-4 p-3 rounded-xl flex items-center justify-between border bg-black/40">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isExtensionInstalled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-200">Extension Status:</span>
            <strong className={isExtensionInstalled ? 'text-emerald-400' : 'text-amber-400'}>
              {isExtensionInstalled ? 'Installed & Ready' : 'Not Loaded in Browser Yet'}
            </strong>
          </div>

          {isExtensionInstalled && (
            <button
              onClick={() => { onClose(); onAutoConnect(); }}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Connect Now</span>
            </button>
          )}
        </div>

        {/* 3 Step Installation Instructions */}
        {!isExtensionInstalled ? (
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <p className="text-slate-400">
              Web browsers prevent normal websites from reading cookies from other tabs (Same-Origin Policy).
              Just like the official <code>chrome-extension://...</code> tool, loading this local helper extension allows 1-click auto connection:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-roblox-accent/20 text-roblox-accent font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Open Extensions in Chrome or Edge</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Navigate to <code className="text-roblox-accent bg-black/40 px-1.5 py-0.5 rounded font-mono">chrome://extensions</code> in a new tab and enable <strong className="text-slate-200">Developer mode</strong> (toggle at the top-right).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-roblox-accent/20 text-roblox-accent font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">Click "Load unpacked"</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Click the <strong>Load unpacked</strong> button at the top-left and select this extension folder:
                  </p>
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300">
                    <span className="truncate flex-1">{extensionPath}</span>
                    <button
                      onClick={copyPath}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                      title="Copy folder path"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-roblox-accent/20 text-roblox-accent font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white">Done!</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Refresh this page and click <strong>"Auto-Connect Active Roblox Session"</strong>. It will immediately analyze your logged-in Roblox account in 1 click!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Extension Active & Connected!</span>
            </div>
            <p className="text-slate-300">
              The Roblox Rewind extension bridge is active. Whenever you click Auto-Connect, it securely reads your active browser session from roblox.com and fetches all real transactions locally.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            🔒 100% Client-Side • No credentials leave your machine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
