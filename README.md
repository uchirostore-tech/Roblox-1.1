# Roblox Pulse V1.1 | រ៉ូប្លក ភល្ស V1.1 🚀
### Bank-Grade Roblox Spending Intelligence & KHQR Payment Engine
**Make by [@noreakyout](https://t.me/noreakyout) • Official Telegram Channel: [@uchirostore](https://t.me/uchirostore)**

---

## 🇰🇭 មុខងារពិសេសៗ (Key Features)

### 1. ⚡ វិភាគការចំណាយប្រាក់ពិត 100% (100% Real Live Check)
- **គ្មានទិន្នន័យក្លែងក្លាយ (Zero Mock Data)**: ដំណើរការជាមួយទិន្នន័យពិតនៃគណនីរបស់អ្នក។
- **ភ្ជាប់ស្វ័យប្រវត្តិតាម Browser Extension**: ប្រសិនបើ Browser របស់អ្នកបាន Log in ក្នុង roblox.com រួចហើយ Extension នឹងចាប់ Session ដោយស្វ័យប្រវត្តិ។
- **សុវត្ថិភាពខ្ពស់ & លុបទិន្នន័យស្វ័យប្រវត្តិ 1 ម៉ោង (Auto-Purge Every 1 Hour)**: គ្រប់ Session និង Memory ទាំងអស់ត្រូវលុបស្អាតចេញពី RAM រៀងរាល់ 60 នាទី។
- **ប៊ូតុងលុបទិន្នន័យភ្លាមៗ (Instant Zero-Trace Wipe)**: អាចចុចលុបទិន្នន័យភ្លាមៗគ្រប់ពេលវេលា។

### 2. 💖 ប្រព័ន្ធឧបត្ថម្ភ Real KHQR / Bakong / ABA PayWay (Donation Engine)
- **បង្កើតកូដ KHQR ស្វ័យប្រវត្តិ**: តាមរយៈ KHPAY Gateway ជាមួយ Bakong CRC16 Offline Fallback។
- **ស្កេនបានគ្រប់ធនាគារក្នុងស្រុក**: ABA Mobile, Bakong, ACLEDA, Wing, Canadia, Sathapana, etc.
- **1-Click Mobile Checkout Link**: ចុចលើ "Link បង់ប្រាក់ KHPAY" ដើម្បីលោតចូល ABA Mobile App ភ្លាមៗនៅលើទូរស័ព្ទ។
- **ពិនិត្យស្ថានភាពបង់ប្រាក់ស្វ័យប្រវត្តិ (Auto-Polling 3s)**: រង់ចាំការផ្ទៀងផ្ទាត់ និងបង្ហាញផ្ទាំងអបអរសាទរ (Confetti & Fanfare) ភ្លាមៗពេលបង់ប្រាក់រួចរាល់។
- **គណនីទទួលផ្លូវការ**: `KHIN SOVANNOREAKYOUT` (`PAYWAY@ABA-UCHIRO`).

### 3. 📊 សង្ខេបចំណុចសំខាន់ៗ & ម៉ាស៊ីនគិតលេខពិត (Focused Summary & Calculator)
- **ទឹកប្រាក់ពិតប្រាកដដែលបានចំណាយ (Real Money Spent)**: គិតតាមអត្រាប្តូរប្រាក់ផ្លូវការ (USD / KHR / EUR / GBP / CAD)។
- **Robux ដែលបានទិញ & បានចំណាយ**: ទិន្នន័យទិញ Robux ដោយប្រាក់ពិត និងការចំណាយលើ Items, Passes & Private Servers។
- **ខែសមាជិកភាព Premium/BC**: គណនាខែដែលបានទិញ Premium/BC ពី Transaction Stipends ចាស់ៗទាំងអស់។
- **ព័ត៌មានលម្អិតគណនី**: User ID, អាយុកាលគណនី (ឆ្នាំ & ថ្ងៃ), កាលបរិច្ឆេទបង្កើត, និង 3D Avatar Icons។
- **Top Games Invested**: ហ្គេមដែលបានចំណាយច្រើនជាងគេ ភ្ជាប់ជាមួយរូប Icon ដើមរបស់ហ្គេម និង Link ចូលលេង។

### 4. 🌐 ភាសាខ្មែរជាចម្បង (Khmer First)
- ភាសាខ្មែរ (Khmer) ជាភាសាលំនាំដើម (Default) ជាមួយប៊ូតុងប្តូរទៅកាន់អង់គ្លេស (English) ដោយចុច 1-Click។

---

## ☁️ របៀបដាក់ Host លើ Vercel (Vercel Deployment)

គម្រោងនេះត្រូវបានរៀបចំរួចជាស្រេចសម្រាប់ដំណើរការលើ **Vercel** ជាមួយ `vercel.json`, Serverless API (`api/`), និង Vite Frontend!

### វិធីទី ១៖ ដាក់ Host តាម Vercel CLI (លឿនបំផុត)
1. បើក Terminal ក្នុង Folder គម្រោង:
```bash
cd "C:\Users\NTC COMPUTER\.gemini\antigravity\scratch\roblox-checker-rewind"
```
2. ដំណើរការ Deploy ទៅ Vercel:
```bash
npx vercel
```
*(អនុវត្តតាមការណែនាំលើអេក្រង់ដើម្បី Login Vercel និងជ្រើសរើសឈ្មោះគម្រោង)*

3. Deploy Production:
```bash
npx vercel --prod
```

### វិធីទី ២៖ ដាក់ Host តាម GitHub (Recommended)
1. បង្កើត Git repository និង Push គម្រោងឡើង GitHub:
```bash
git init
git add .
git commit -m "feat: Roblox Pulse V1.1 with KHQR Donation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/roblox-pulse.git
git push -u origin main
```
2. ចូលទៅកាន់ [https://vercel.com/new](https://vercel.com/new)
3. ជ្រើសរើស Repository របស់អ្នក -> ចុច **Deploy** (Vercel នឹងចាប់យក `vercel.json` និង `npm run build` ដោយស្វ័យប្រវត្តិ)។
4. (ជម្រើស) បន្ថែម Environment Variable លើ Vercel Dashboard (Settings -> Environment Variables):
   - `KHPAY_API_KEY`: `ak_af41446eb45fd448fae8ed7555c785830246ab2edbac45b8`

---

## 🔌 របៀបដំឡើង Chrome Extension (Auto Session Connector)

1. បើក Google Chrome ឬ Brave Browser រួចចូលទៅកាន់: `chrome://extensions/`
2. បើកកុងតាក់ **Developer mode** នៅជ្រុងខាងស្តាំខាងលើ។
3. ចុចលើប៊ូតុង **Load unpacked** នៅជ្រុងខាងឆ្វេងខាងលើ។
4. ជ្រើសរើស Folder `extension` នៅក្នុងគម្រោង:
   `C:\Users\NTC COMPUTER\.gemini\antigravity\scratch\roblox-checker-rewind\extension`
5. រួចរាល់! Extension នឹងចាប់ផ្ដើមដំណើរការ និងភ្ជាប់ជាមួយ Roblox Session របស់អ្នកភ្លាមៗ។

---

## 💻 ដំណើរការលើ Local Machine (Testing)

បើក Browser របស់អ្នកចូលទៅកាន់:
👉 **[http://localhost:3001](http://localhost:3001)**

ឬដំណើរការតាម Terminal:
```bash
npm run start
```

---

## 👨‍💻 ព័ត៌មានអ្នកបង្កើត (Author Attribution)
- **Creator**: [@noreakyout](https://t.me/noreakyout)
- **Store & Channel**: [https://t.me/uchirostore](https://t.me/uchirostore)
- **Account**: `KHIN SOVANNOREAKYOUT` (ABA Bank)
