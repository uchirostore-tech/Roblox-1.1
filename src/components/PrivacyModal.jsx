import React from 'react';
import { X, ShieldCheck, Lock, Database, Cpu, EyeOff, CheckCircle2 } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0E1015] border border-white/10 rounded-3xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">How Does This Work & Privacy</h3>
              <p className="text-xs text-slate-400">Your privacy and security guarantees</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>How does Roblox Rewind work?</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Roblox provides an official Economy Transactions API (`economy.roblox.com/v2/users/{'{userId}'}/transactions`) that stores records of your Robux purchases, game pass acquisitions, and catalog transactions.
              When you run this tool, it connects to that endpoint using your session to aggregate and calculate lifetime statistics, top experiences, and spending categories.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <EyeOff className="w-4 h-4 text-roblox-accent" />
              <span>What about my data & cookie security?</span>
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero Remote Tracking:</strong> This tool runs completely on your own machine. Your cookie is never transmitted to any 3rd party or external server.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Ephemeral In-Memory Handling:</strong> The cookie is held only in memory during analysis and is discarded when the page is closed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Passwords or 2FA Access:</strong> A session cookie cannot change your account password, email, or remove 2FA.</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>How are USD values calculated?</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Robux values are calculated using era-appropriate retail tier conversions (standard ~$0.0125 per Robux retail purchase rate, adjusting for legacy Builders Club stipends and bulk tier bonuses).
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
