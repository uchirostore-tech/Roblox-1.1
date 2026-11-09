import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RewindDashboard from './components/RewindDashboard';
import AccountChecker from './components/AccountChecker';
import ShareModal from './components/ShareModal';
import PrivacyModal from './components/PrivacyModal';
import ExtensionModal from './components/ExtensionModal';
import CalculatorModal from './components/CalculatorModal';
import DonateModal from './components/DonateModal';
import { translations } from './translations';

export default function App() {
  const [lang, setLang] = useState('km'); // Default is Khmer as requested
  const [activeTab, setActiveTab] = useState('profile'); // Default is 'profile' (Method 1: Super Detail & Add Friend QR)
  const [rewindData, setRewindData] = useState(null); // Starts clean with zero mock/example data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');

  // 1-Hour Ephemeral Timer (3600 seconds)
  const [purgeTimerSeconds, setPurgeTimerSeconds] = useState(3600);

  // Extension state
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [paidReturnAmount, setPaidReturnAmount] = useState(null);

  const t = translations[lang] || translations.km;

  // Auto-Detect Payment Return (?payment=paid&amount=X) or Direct Session (?session=ses_X)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'paid') {
        const amt = urlParams.get('amount') || '1.00';
        setPaidReturnAmount(amt);
        setIsDonateOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const sessionId = urlParams.get('session');
      if (sessionId) {
        setIsLoading(true);
        fetch(`/api/rewind/session/${encodeURIComponent(sessionId)}`)
          .then(r => r.json())
          .then(res => {
            if (res.success && res.data) {
              setRewindData(res.data);
              setPurgeTimerSeconds(3600);
              setError(null);
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch(e => console.warn('Session load error:', e))
          .finally(() => setIsLoading(false));
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }
  }, []);

  // 1-Hour Auto-Purge Countdown Timer
  useEffect(() => {
    let interval = null;
    if (rewindData) {
      interval = setInterval(() => {
        setPurgeTimerSeconds((prev) => {
          if (prev <= 1) {
            handleClearSession();
            return 3600;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPurgeTimerSeconds(3600);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rewindData]);

  // Extension communication listener
  useEffect(() => {
    window.postMessage({ type: 'CHECK_EXTENSION_INSTALLED' }, '*');

    const handleWindowMessage = (event) => {
      if (event.data?.type === 'ROBLOX_REWIND_EXTENSION_STATUS') {
        setIsExtensionInstalled(true);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auto') === 'true') {
          handleAutoConnect();
        }
      }

      if (event.data?.type === 'AUTO_ROBLOX_SESSION_RESULT') {
        const payload = event.data.payload;
        if (payload?.success && payload?.cookie) {
          handleAnalyzeCookie(payload.cookie);
        } else {
          setIsLoading(false);
          setError(payload?.error || 'Failed to detect active Roblox session in browser.');
        }
      }

      if (event.data?.type === 'BROWSER_DIRECT_SCAN_RESULT') {
        const payload = event.data.payload;
        if (payload?.success && payload?.data) {
          setRewindData(payload.data);
          setPurgeTimerSeconds(3600);
          setError(null);
        } else {
          setError(payload?.error || 'Browser direct analysis failed.');
        }
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [isExtensionInstalled]);

  // 1-Click Auto Connect Trigger
  const handleAutoConnect = () => {
    if (!isExtensionInstalled) {
      setIsExtensionModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    window.postMessage({ type: 'REQUEST_AUTO_ROBLOX_SESSION' }, '*');
  };

  // Analyze real cookie (Server First, Browser Direct Fallback for cloud hosts)
  const handleAnalyzeCookie = async (cookie) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/rewind/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie })
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        // If server failed (e.g. cloud host IP blocked by Roblox) and extension is available:
        if (isExtensionInstalled) {
          console.warn('Backend rejected request, attempting browser direct scan via extension...');
          window.postMessage({ type: 'REQUEST_BROWSER_DIRECT_SCAN', cookie }, '*');
          return; // Browser direct scan will handle state
        }
        throw new Error(result.error || 'Failed to analyze Roblox session. Please ensure you are logged into roblox.com.');
      }

      setRewindData(result.data);
      setPurgeTimerSeconds(3600); // Reset 1-hour countdown on new load
      setIsLoading(false);
    } catch (err) {
      if (isExtensionInstalled) {
        console.warn('Network error, attempting browser direct scan via extension...', err);
        window.postMessage({ type: 'REQUEST_BROWSER_DIRECT_SCAN', cookie }, '*');
        return;
      }
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Clear Session & Memory Immediately
  const handleClearSession = async () => {
    try {
      await fetch('/api/rewind/clear', { method: 'POST' });
    } catch (e) {
      // Ignored
    }
    setRewindData(null);
    setPurgeTimerSeconds(3600);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col selection:bg-roblox-accent selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        onClearSession={handleClearSession}
        purgeTimeRemaining={purgeTimerSeconds}
        hasActiveData={!!rewindData}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenHelp={() => setIsPrivacyOpen(true)}
      />

      {/* Main Container - 100% Fluid & Clean on both PC and Mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {activeTab === 'rewind' ? (
          <RewindDashboard
            data={rewindData}
            isLoading={isLoading}
            error={error}
            onAnalyze={handleAnalyzeCookie}
            currency={currency}
            lang={lang}
            isExtensionInstalled={isExtensionInstalled}
            onAutoConnect={handleAutoConnect}
            onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        ) : (
          <AccountChecker lang={lang} currency={currency} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 px-4 bg-[#0A0B0E]/80 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-slate-200">Roblox Pulse V1.1 (រ៉ូប្លក ភល្ស V1.1)</span>
            <span>•</span>
            <span className="text-slate-400">
              Make by{' '}
              <a 
                href="https://t.me/noreakyout" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-roblox-accent hover:underline font-mono font-bold"
              >
                @noreakyout
              </a>
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Channel:{' '}
              <a 
                href="https://t.me/uchirostore" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-400 hover:underline font-mono font-bold"
              >
                @uchirostore
              </a>
            </span>
            <span>•</span>
            <span className="text-slate-400">{t.secureBadge}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsDonateOpen(true)} 
              className="text-rose-400 hover:text-rose-300 font-bold transition-colors flex items-center gap-1"
            >
              💖 {lang === 'km' ? 'ឧបត្ថម្ភអ្នកបង្កើត' : 'Donate'}
            </button>
            <button onClick={() => setIsCalculatorOpen(true)} className="hover:text-emerald-400 transition-colors">
              🧮 {lang === 'km' ? 'ម៉ាស៊ីនគិតលេខ' : 'Calculator'}
            </button>
            <button onClick={() => setIsExtensionModalOpen(true)} className="hover:text-roblox-accent transition-colors">
              📱 {lang === 'km' ? 'វិធីភ្ជាប់លើ iPhone, Android & PC' : 'Universal Connect Guide'}
            </button>
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-slate-300 transition-colors">
              Security & Privacy
            </button>
            {rewindData && (
              <button onClick={() => setIsShareOpen(true)} className="hover:text-slate-300 transition-colors">
                {t.shareImageBtn}
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => {
          setIsDonateOpen(false);
          setPaidReturnAmount(null);
        }}
        lang={lang}
        initialAmount={paidReturnAmount}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        data={rewindData}
        lang={lang}
        currency={currency}
      />

      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        isExtensionInstalled={isExtensionInstalled}
        onAutoConnect={handleAutoConnect}
        lang={lang}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={rewindData}
        lang={lang}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        lang={lang}
      />

    </div>
  );
}
