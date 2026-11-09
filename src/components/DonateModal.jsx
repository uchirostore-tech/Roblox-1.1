import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, ExternalLink, RefreshCw, CheckCircle2, ShieldCheck, Sparkles, Send, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function DonateModal({ isOpen, onClose, lang = 'km', initialAmount = null }) {
  const [step, setStep] = useState(1); // 1: Select amount, 2: Show QR & Poll, 3: Success Celebration
  const [selectedAmount, setSelectedAmount] = useState('1.00');
  const [customAmount, setCustomAmount] = useState('1.00');
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [countdown, setCountdown] = useState(180);
  const [pollStatus, setPollStatus] = useState('waiting');
  const [copiedLink, setCopiedLink] = useState(false);
  
  const canvasRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const amountPresets = ['0.50', '1.00', '2.00', '5.00', '10.00'];

  // Handle initialAmount if passed from URL redirect
  useEffect(() => {
    if (initialAmount) {
      setSelectedAmount(initialAmount);
      setCustomAmount(initialAmount);
      setStep(3);
      triggerConfetti();
    }
  }, [initialAmount]);

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      cleanupTimers();
      if (step !== 3) {
        setStep(1);
      }
    }
  }, [isOpen]);

  const cleanupTimers = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  // Render QR code to canvas when qrData is set and step is 2
  useEffect(() => {
    if (step === 2 && qrData?.qr_string && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrData.qr_string, {
        width: 210,
        margin: 1,
        color: {
          dark: '#0A0B0E',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error('Failed to render QR Code:', err);
      });
    }
  }, [step, qrData]);

  // Polling logic when step is 2
  useEffect(() => {
    if (step === 2 && qrData?.transaction_id) {
      const txnId = qrData.transaction_id;
      
      // Countdown timer (180s)
      setCountdown(qrData.expires_in || 180);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            cleanupTimers();
            setPollStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Skip live polling for offline mock/direct payload
      if (!txnId.startsWith('txn_direct_') && !txnId.startsWith('txn_offline_')) {
        pollIntervalRef.current = setInterval(async () => {
          try {
            const res = await fetch(`/api/donate-check?id=${encodeURIComponent(txnId)}`);
            if (res.ok) {
              const resData = await res.json();
              const payment = resData?.data;
              if (payment && (payment.paid === true || payment.status === 'paid' || payment.action === 'approved')) {
                cleanupTimers();
                setStep(3);
                triggerConfetti();
              }
            }
          } catch (e) {
            // Non-critical network poll retry
          }
        }, 3000);
      }
    }

    return () => cleanupTimers();
  }, [step, qrData]);

  // Fallback direct KHQR generator
  const calculateKHQR_CRC16 = (str) => {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= (str.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  };

  const getDirectKHQR = (amt) => {
    const amtStr = parseFloat(amt).toFixed(2);
    const tag54 = `54${String(amtStr.length).padStart(2, '0')}${amtStr}`;
    const basePayload = "00020101021230510016abaakhppxxx@abaa01151260328140807200208ABA Bank520453995303840" +
      tag54 +
      "5802KH5920KHIN SOVANNOREAKYOUT6003BMC62220118PAYWAY@ABA-UCHIRO6304";
    const crc = calculateKHQR_CRC16(basePayload);
    return {
      transaction_id: `txn_direct_${Date.now()}`,
      qr_string: basePayload + crc,
      expires_in: 300,
      payment_url: "https://t.me/uchirostore"
    };
  };

  const handleGenerateQR = async () => {
    const val = parseFloat(customAmount);
    if (isNaN(val) || val < 0.10) {
      alert(lang === 'km' ? 'សូមបញ្ចូលចំនួនយ៉ាងតិច $0.10 USD' : 'Please enter an amount of at least $0.10 USD');
      return;
    }

    setIsLoading(true);
    setPollStatus('waiting');

    try {
      const currentUrl = window.location.href.split('?')[0];
      const res = await fetch('/api/donate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: val.toFixed(2),
          currency: 'USD',
          note: 'Donation to @uchirostore by @noreakyout',
          success_url: `${currentUrl}?payment=paid&amount=${val.toFixed(2)}`,
          cancel_url: currentUrl
        })
      });

      const json = await res.json();
      if (json && json.success && json.data) {
        setQrData(json.data);
      } else {
        // Fallback
        setQrData(getDirectKHQR(val));
      }
      setStep(2);
    } catch (e) {
      console.warn('API error, using direct Bakong KHQR payload:', e);
      setQrData(getDirectKHQR(val));
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (qrData?.payment_url) {
      navigator.clipboard.writeText(qrData.payment_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#0F1117] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[92vh] overflow-y-auto"
        style={{
          boxShadow: '0 0 50px -10px rgba(225, 29, 72, 0.2), 0 20px 40px -15px rgba(0,0,0,0.8)'
        }}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 shadow-lg shadow-rose-500/30 mb-3">
            <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
            <span>{lang === 'km' ? 'ឧបត្ថម្ភអ្នកបង្កើត' : 'Support Developer'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Donate
            </span>
          </h2>

          {/* Attribution links */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Make by</span>
            <a 
              href="https://t.me/noreakyout" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-roblox-accent hover:underline font-mono font-bold"
            >
              @noreakyout
            </a>
            <span>•</span>
            <a 
              href="https://t.me/uchirostore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-mono font-bold"
            >
              <Send className="w-3 h-3" />
              @uchirostore
            </a>
          </div>
        </div>

        {/* STEP 1: Select Amount */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {lang === 'km' ? 'ជ្រើសរើសចំនួនទឹកប្រាក់ (USD)' : 'Select Amount (USD)'}
              </label>
              
              {/* Preset Chips */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {amountPresets.map((amt) => {
                  const isSelected = selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount(amt);
                      }}
                      className={`py-2 px-1 text-xs font-extrabold rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-lg shadow-rose-500/25 scale-[1.03]'
                          : 'bg-[#141721] text-slate-300 border-white/10 hover:border-white/25 hover:bg-[#1A1E2C]'
                      }`}
                    >
                      ${amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="relative flex items-center bg-[#141721] border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                <span className="text-lg font-bold text-rose-400 mr-2">$</span>
                <input
                  type="number"
                  step="0.10"
                  min="0.10"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(e.target.value);
                  }}
                  placeholder="1.00"
                  className="w-full bg-transparent text-white font-extrabold text-base outline-none"
                />
                <span className="text-xs font-bold text-slate-400 ml-2">USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                {lang === 'km' ? '* ទឹកប្រាក់អប្បបរមាត្រឹមតែ $0.10' : '* Minimum amount is $0.10 USD'}
              </p>
            </div>

            {/* Generate KHQR Button */}
            <button
              onClick={handleGenerateQR}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:via-pink-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'km' ? 'កំពុងបង្កើតកូដ...' : 'Generating Code...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {lang === 'km'
                      ? `⚡ បង្កើតកូដ KHQR ($${parseFloat(customAmount || 1).toFixed(2)})`
                      : `⚡ Generate KHQR ($${parseFloat(customAmount || 1).toFixed(2)})`}
                  </span>
                </>
              )}
            </button>

            {/* Direct Channel Link */}
            <a
              href="https://t.me/uchirostore"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-roblox-accent" />
              <span>{lang === 'km' ? 'ចូលរួម Telegram Channel (@uchirostore)' : 'Join Telegram Channel (@uchirostore)'}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        )}

        {/* STEP 2: Display Live KHQR & Polling */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn text-center">
            
            {/* Cambodian KHQR Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs">
              <span className="text-sm">🇰🇭</span>
              <span>BAKONG / ABA KHQR</span>
            </div>

            {/* Amount display */}
            <div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                ${parseFloat(customAmount || 1).toFixed(2)} USD
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'km' ? 'ស្កេនជាមួយ ABA ឬគ្រប់កម្មវិធីធនាគារក្នុងស្រុក' : 'Scan with ABA or any Cambodian Bank App'}
              </p>
            </div>

            {/* QR Canvas Frame */}
            <div className="relative mx-auto w-56 h-56 p-3 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-slate-900">
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute inset-0 pointer-events-none rounded-3xl border border-black/10" />
            </div>

            {/* Waiting status pill & countdown */}
            <div className="flex items-center justify-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{lang === 'km' ? 'កំពុងរង់ចាំការបង់ប្រាក់...' : 'Waiting for payment...'}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {countdown}s
              </span>
            </div>

            {/* 1-Click Payment Link (Direct Deep-link to ABA Mobile / Gateway) */}
            <div className="space-y-2">
              <a
                href={qrData?.payment_url || 'https://t.me/uchirostore'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>
                  {lang === 'km' ? '🔗 បើក Link បង់ប្រាក់ KHPAY / ABA' : '🔗 Open Payment Link (ABA 1-Click)'}
                </span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? (lang === 'km' ? 'បានចម្លង!' : 'Copied!') : (lang === 'km' ? 'ចម្លង Link' : 'Copy Link')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    cleanupTimers();
                    setStep(1);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold border border-white/10 transition-colors"
                >
                  {lang === 'km' ? '← ប្តូរទឹកប្រាក់' : '← Change Amount'}
                </button>
              </div>
            </div>

            {/* Receiver verification tag */}
            <div className="text-[11px] text-slate-400 border-t border-white/5 pt-2">
              គណនីទទួល៖ <span className="font-semibold text-slate-300">KHIN SOVANNOREAKYOUT (ABA)</span>
            </div>

          </div>
        )}

        {/* STEP 3: Payment Success Celebration */}
        {step === 3 && (
          <div className="space-y-4 text-center py-4 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mb-1 shadow-lg shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-emerald-400">
              {lang === 'km' ? 'ឧបត្ថម្ភជោគជ័យ! 🎉' : 'Donation Successful! 🎉'}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
              {lang === 'km' ? (
                <>
                  សូមអរគុណយ៉ាងជ្រាលជ្រៅចំពោះការឧបត្ថម្ភចំនួន{' '}
                  <span className="font-extrabold text-amber-400">
                    ${parseFloat(customAmount || 1).toFixed(2)} USD
                  </span>{' '}
                  ដល់អ្នកបង្កើត! កម្លាំងចិត្តរបស់អ្នកជួយឱ្យប្រព័ន្ធនេះបន្តអភិវឌ្ឍទៅមុខ! ❤️
                </>
              ) : (
                <>
                  Thank you so much for your generous donation of{' '}
                  <span className="font-extrabold text-amber-400">
                    ${parseFloat(customAmount || 1).toFixed(2)} USD
                  </span>{' '}
                  to support our development! ❤️
                </>
              )}
            </p>

            {/* Creator Links */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
              <div className="text-slate-400 font-semibold">
                {lang === 'km' ? 'តាមដានការអាប់ដេតថ្មីៗតាមរយៈ៖' : 'Stay connected via:'}
              </div>
              <div className="flex items-center justify-center gap-3">
                <a 
                  href="https://t.me/noreakyout" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-roblox-accent hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  @noreakyout
                </a>
                <span className="text-slate-600">•</span>
                <a 
                  href="https://t.me/uchirostore" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  @uchirostore
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                cleanupTimers();
                setStep(1);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
            >
              {lang === 'km' ? 'រួចរាល់ (Done)' : 'Done'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
