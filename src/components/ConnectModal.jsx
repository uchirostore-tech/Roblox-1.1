import React, { useState } from 'react';
import { X, Smartphone, Laptop, Check, Copy, ExternalLink, Zap, ShieldCheck, Sparkles, HelpCircle, UserCheck } from 'lucide-react';

export default function ConnectModal({ isOpen, onClose, onSelectTab, lang = 'km', isExtensionInstalled, onAutoConnect }) {
  const [deviceTab, setDeviceTab] = useState('iphone'); // 'iphone' | 'android' | 'pc'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';

  // Universal 1-Tap Bookmarklet Code
  const bookmarkletCode = `javascript:(async function(){try{const b=document.createElement('div');b.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999999;background:#0d1117;border:2px solid #00F2FE;color:#fff;padding:14px 22px;border-radius:18px;font-family:sans-serif;font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,0.85);text-align:center;display:flex;align-items:center;gap:10px;font-weight:bold;';b.innerHTML='<span>⚡</span><span>Roblox Pulse: កំពុងទាញយកទិន្នន័យចំណាយ...</span>';document.body.appendChild(b);const uRes=await fetch('https://users.roblox.com/v1/users/authenticated',{credentials:'include'});if(!uRes.ok){alert('⚠️ សូម Log in ក្នុង roblox.com ជាមុនសិន!\\nPlease log into roblox.com first!');b.remove();return;}const u=await uRes.json();let allTx=[];let c='';for(let i=0;i<5;i++){const r=await fetch('https://economy.roblox.com/v2/users/'+u.id+'/transactions?transactionType=Purchase&limit=100'+(c?'&cursor='+c:''),{credentials:'include'});if(!r.ok)break;const d=await r.json();if(d.data)allTx.push(...d.data);if(!d.nextPageCursor)break;c=d.nextPageCursor;}let curTx=[];try{const cr=await fetch('https://economy.roblox.com/v2/users/'+u.id+'/transactions?transactionType=CurrencyPurchase&limit=100',{credentials:'include'});if(cr.ok){const cd=await cr.json();if(cd.data)curTx=cd.data;}}catch(e){}let stTx=[];try{const sr=await fetch('https://economy.roblox.com/v2/users/'+u.id+'/transactions?transactionType=PremiumStipends&limit=100',{credentials:'include'});if(sr.ok){const sd=await sr.json();if(sd.data)stTx=sd.data;}}catch(e){}let bal=0;try{const br=await fetch('https://economy.roblox.com/v1/users/'+u.id+'/currency',{credentials:'include'});if(br.ok){const bd=await br.json();bal=bd.robux||0;}}catch(e){}const payload={user:{userId:u.id,username:u.name,displayName:u.displayName,created:u.created,robuxBalance:bal},purchases:allTx,currencyPurchases:curTx,stipends:stTx};const host='${currentHost}';b.innerHTML='<span>✅</span><span>ទាញទិន្នន័យរួចរាល់! កំពុងបើក Dashboard...</span>';const res=await fetch(host+'/api/rewind/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const resJson=await res.json();b.remove();if(resJson&&resJson.sessionId){window.open(host+'/?session='+resJson.sessionId,'_blank');}else{window.open(host,'_blank');}}catch(e){alert('កំហុសក្នុងការតភ្ជាប់: '+e.message);}})();`;

  const copyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyConsoleCode = () => {
    navigator.clipboard.writeText(bookmarkletCode.replace(/^javascript:/, ''));
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0E1015] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 mb-2">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            {lang === 'km' ? 'វិធីតភ្ជាប់ងាយស្រួលគ្រប់ឧបករណ៍' : 'Universal Easy Connect Guide'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km' 
              ? 'ជ្រើសរើសប្រភេទឧបករណ៍របស់អ្នក (iPhone, Android, ឬ PC) ដើម្បីភ្ជាប់ដោយងាយបំផុត!' 
              : 'Works seamlessly across iPhone, Android, and PC with zero technical hassle!'}
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10 my-4">
          <button
            onClick={() => setDeviceTab('iphone')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              deviceTab === 'iphone'
                ? 'bg-gradient-to-r from-roblox-accent to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setDeviceTab('android')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              deviceTab === 'android'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setDeviceTab('pc')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              deviceTab === 'pc'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>PC & Mac</span>
          </button>
        </div>

        {/* TAB 1: IPHONE & IPAD */}
        {deviceTab === 'iphone' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-roblox-accent/30">
              <h4 className="font-extrabold text-sm text-roblox-accent flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'km' ? 'វិធីទី ១ ៖ ប្រើ "1-Tap Bookmarklet" (មិនបាច់ដំឡើង App)' : 'Method 1: 1-Tap Bookmarklet (Zero Apps Needed)'}</span>
              </h4>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                {lang === 'km'
                  ? 'ដំណើរការបាន ១០០% លើ Safari និង Chrome លើ iPhone/iPad ដោយមិនបាច់ដំឡើង Extension អ្វីទាំងអស់!'
                  : 'Works on iOS Safari & Chrome without needing to install any extension or app!'}
              </p>

              {/* 1-Click Copy Code Button */}
              <button
                onClick={copyBookmarklet}
                className="mt-3 w-full py-2.5 px-3 rounded-xl bg-roblox-accent hover:bg-roblox-accentHover text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? (lang === 'km' ? 'បានចម្លងកូដរហ័ស!' : 'Code Copied!') : (lang === 'km' ? '📋 ចម្លងកូដ 1-Tap Bookmarklet' : '📋 Copy 1-Tap Bookmarklet Code')}</span>
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-2 text-slate-300 pl-1">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                <div>
                  <strong>ចុចប៊ូតុង "ចម្លងកូដ" ខាងលើ</strong> រួចបើក Safari ឬ Chrome ចូលទៅកាន់ <code className="text-roblox-accent">roblox.com</code> (ហើយប្រាកដថាបាន Log in)។
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                <div>
                  ចុចប៊ូតុង <strong>Share (ចែករំលែក) ➔ Add Bookmark</strong> ដាក់ឈ្មោះថា <code className="text-emerald-400">⚡ Roblox Pulse</code> រួចចុច Save។
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                <div>
                  បើកបញ្ជី Bookmarks ឡើងវិញ ចុច <strong>Edit</strong> លើ Bookmark នោះ រួច <strong>Paste កូដដែលបានចម្លង</strong> ចូលក្នុងប្រឡោះ URL។
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                <div className="text-emerald-300 font-semibold">
                  រួចរាល់! ពេលកំពុងមើល roblox.com គ្រាន់តែចុចលើ Bookmark នោះ វានឹងបើកទិន្នន័យចំណាយរបស់អ្នកភ្លាមៗ!
                </div>
              </div>
            </div>

            {/* Alternative: Orion Browser */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">ជម្រើសផ្សេង៖ ប្រើ Orion Browser</span>
                <span className="text-[11px] text-slate-400">Browser ឥតគិតថ្លៃលើ iOS ដែលអាច Add Extension ដូចលើ PC!</span>
              </div>
              <a
                href="https://apps.apple.com/us/app/orion-browser-by-kagi/id1484498200"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1"
              >
                <span>App Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: ANDROID */}
        {deviceTab === 'android' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30">
              <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'km' ? 'វិធីទី ១ ៖ ប្រើ "1-Tap Bookmarklet" លើ Chrome / Samsung Internet' : 'Method 1: 1-Tap Bookmarklet (Chrome / Samsung Internet)'}</span>
              </h4>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                {lang === 'km'
                  ? 'មិនបាច់ដំឡើង App អ្វីទាំងអស់! ដំណើរការលើ Chrome, Samsung Internet, និងគ្រប់ Browser លើ Android។'
                  : 'Zero app installation required! Works on any Android browser.'}
              </p>

              <button
                onClick={copyBookmarklet}
                className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {copiedCode ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? (lang === 'km' ? 'បានចម្លងកូដ!' : 'Copied!') : (lang === 'km' ? '📋 ចម្លងកូដ 1-Tap Bookmarklet' : '📋 Copy 1-Tap Bookmarklet Code')}</span>
              </button>
            </div>

            {/* Alternative: Kiwi Browser with 1-Click Extension */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">ជម្រើសទី ២ ៖ ប្រើ Kiwi Browser (Play Store)</span>
                <span className="text-[11px] text-slate-400">គាំទ្រការដំឡើង Chrome Extension បានដូចកុំព្យូទ័រ PC 100%!</span>
              </div>
              <a
                href="https://play.google.com/store/apps/details?id=com.kiwibrowser.browser"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1"
              >
                <span>Play Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: PC & MAC */}
        {deviceTab === 'pc' && (
          <div className="space-y-4 animate-fadeIn text-xs">
            {/* Status if extension loaded */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${isExtensionInstalled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-slate-300">Extension Status:</span>
                <strong className={isExtensionInstalled ? 'text-emerald-400' : 'text-amber-400'}>
                  {isExtensionInstalled ? '🟢 Installed & Active' : 'Not Loaded in Chrome Yet'}
                </strong>
              </div>

              {isExtensionInstalled && (
                <button
                  onClick={() => { onClose(); onAutoConnect && onAutoConnect(); }}
                  className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20"
                >
                  ⚡ Auto-Connect
                </button>
              )}
            </div>

            {/* Option A: 1-Click Chrome Extension */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-roblox-accent/20 text-roblox-accent font-bold flex items-center justify-center text-[10px]">1</span>
                <span>ដំឡើង Chrome / Brave / Edge Extension</span>
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ចូល <code className="text-roblox-accent bg-black/40 px-1 py-0.5 rounded">chrome://extensions</code> ➔ បើក Developer Mode ➔ ចុច <strong>Load unpacked</strong> ➔ ជ្រើសរើស Folder <code className="text-white">extension</code> ក្នុងគម្រោង។
              </p>
            </div>

            {/* Option B: F12 Console One-Liner */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px]">2</span>
                <span>ប្រើ Console Script 1 បន្ទាត់ (មិនបាច់ដំឡើង Extension)</span>
              </h4>
              <p className="text-slate-400 text-[11px]">
                ចូល <code className="text-roblox-accent">roblox.com</code> ចុច <kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/10 font-mono">F12</kbd> (Console) រួច Paste កូដខាងក្រោម៖
              </p>
              <button
                onClick={copyConsoleCode}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copiedConsole ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedConsole ? 'បានចម្លងកូដ Console!' : '📋 ចម្លងកូដ Console'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Banner: Public Profile Check */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            {lang === 'km' ? 'មិនចង់ Login? ពិនិត្យត្រឹម Username ឬ ID:' : 'Want to check with just a Username or ID?'}
          </div>
          <button
            onClick={() => {
              onClose();
              if (onSelectTab) onSelectTab('profile');
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'km' ? 'ពិនិត្យគណនី' : 'Account Checker'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
