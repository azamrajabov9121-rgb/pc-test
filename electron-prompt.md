# PROMPT: Vite + React loyihani avtomatik yangilanadigan Windows dasturiga aylantir

> Bu promptni React loyihangning ildizida Claude Code'ga to'liq nusxalab tashla.

---

Mening Vite + React loyihamni Windows uchun mustaqil desktop dasturiga aylantir.
Dastur brauzerda emas, o'z oynasida ochilsin; ish stolida yorlig'i bo'lsin; men yangi
versiya chiqarganimda o'rnatilgan nusxalar GitHub orqali o'zi yangilansin.

Quyidagi konfiguratsiya amalda ishlab, to'liq tekshirilgan — undan chetlashma.
Har bir "TUZOQ" bandi real topilgan xato: har biri dasturni **jimgina**, xatosiz
ishlamaydigan qilib qo'yadi. Ularni oldindan hisobga ol, keyin tuzatma.

## 1. O'rnatish

```
npm install -D electron electron-builder
npm install electron-updater
```

**TUZOQ 1:** `electron-updater` aynan `dependencies` da bo'lsin, `devDependencies` da emas —
aks holda asar ichiga kirmaydi va paketlangan dastur ishga tushmaydi.

## 2. vite.config.js

`base: './'` qo'sh.

**TUZOQ 2:** Busiz `file://` orqali ochilganda CSS/JS yuklanmay, **oq ekran** chiqadi.
Development'da hammasi joyida ko'rinadi, faqat paketlangandan keyin bilinadi.

## 3. electron/main.js (ESM)

```js
import { app, BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const devServerUrl = process.env.VITE_DEV_SERVER_URL

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  })

  win.once('ready-to-show', () => win.show())

  // Tashqi havolalar dastur oynasida emas, brauzerda ochilsin.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (devServerUrl) win.loadURL(devServerUrl)
  else win.loadFile(path.join(__dirname, '../dist/index.html'))
}

function setupAutoUpdater() {
  // Internet yo'q bo'lsa dastur baribir ishlayversin — eski versiyada.
  // checkForUpdates() 'error' event ham chiqaradi, promise'ni ham reject qiladi.
  autoUpdater.on('error', (err) => {
    console.error('Update check failed:', err?.message ?? err)
  })
  autoUpdater.checkForUpdates().catch(() => {})
}

app.whenReady().then(() => {
  createWindow()
  if (app.isPackaged) setupAutoUpdater()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

**TUZOQ 3:** `electron-updater` — CJS paket. ESM loyihada `import { autoUpdater } from 'electron-updater'`
ishlamaydi; yuqoridagidek default import orqali ol.

**TUZOQ 4:** `.catch(() => {})` shart. Faqat `on('error')` yozsang, "unhandled promise rejection"
bo'lib, dastur tasodifan yopilib qoladi — sababi hech qayerda ko'rinmaydi.

**TUZOQ 5:** Updater `app.isPackaged` ichida bo'lsin, aks holda development'da xalaqit beradi.

**Eslatma:** yuqoridagi kod **jimgina avtomatik yangilanadi** (yuklab oladi, keyingi ochilishda
o'rnatiladi) — bu variant amalda tekshirilgan. Agar foydalanuvchidan `dialog.showMessageBox`
bilan so'ramoqchi bo'lsang, dialog **haqiqatan ekranda chiqishini** alohida tekshir: menda
`autoDownload = false` + dialog varianti kodda to'g'ri bo'lsa ham, dialog chiqmay, dastur
jimgina yangilanib ketdi.

## 4. package.json

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "vite build && electron .",
    "electron:build": "vite build && electron-builder"
  },
  "build": {
    "appId": "com.example.app",
    "productName": "MyApp",
    "files": ["dist/**/*", "electron/**/*", "package.json"],
    "directories": { "output": "release" },
    "publish": [
      { "provider": "github", "owner": "<GITHUB_USERNAME>", "repo": "<REPO_NAME>" }
    ],
    "win": { "target": "nsis" },
    "nsis": {
      "artifactName": "${productName}-Setup-${version}.${ext}",
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

**TUZOQ 6:** `artifactName` ni **probelsiz** qil. Default nomda probel bor
(`My App Setup 1.0.0.exe`). `latest.yml` ichiga nom **chiziqcha** bilan yoziladi
(`My-App-Setup-1.0.0.exe`), `gh release create` esa faylni **nuqta** bilan yuklaydi
(`My.App.Setup.1.0.0.exe`). Updater mavjud bo'lmagan nomni so'rab, **404** oladi.

**TUZOQ 7:** `publish` bo'limini olib tashlama — undan `app-update.yml` generatsiya qilinadi,
updater qayerdan qidirishni faqat shundan biladi.

`perMachine: false` — administrator paroli so'ralmaydi.

## 5. .github/workflows/release.yml

```yaml
name: Release

on:
  push:
    tags: ['v*']

permissions:
  contents: write

jobs:
  release:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Build installer
        run: npx electron-builder --win --publish never
      - name: Create GitHub Release
        shell: pwsh
        run: |
          $assets = Get-ChildItem release\*.exe, release\*.exe.blockmap, release\latest.yml | ForEach-Object { $_.FullName }
          gh release create $env:GITHUB_REF_NAME --title $env:GITHUB_REF_NAME --generate-notes @assets
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**TUZOQ 8 (eng yomoni):** `electron-builder --publish always` **ishlatma**. U fayllarni parallel
yuklaydi va har bir yuklash release yaratishga urinib, **bitta teg ostida bir nechta release**
hosil qiladi. Keyin teg `.exe` si yo'q release'ga bog'lanib, `releases/download/<tag>/<fayl>.exe`
havolasi **404** qaytaradi. Build "success" bo'ladi, release ko'rinadi, hech qanday xato
chiqmaydi — lekin hech kim yangilanish olmaydi. Build va release'ni yuqoridagidek ajrat.

**TUZOQ 9:** electron-builder'ning publish defaulti — `draft`. Draft release'ni updater umuman
ko'rmaydi. `gh release create` buni ham hal qiladi (u darhol ochiq release yaratadi).

## 6. .gitignore

`release` qo'sh.

## 7. Tekshirish — MAJBURIY

"Tayyor" deyishdan oldin har birini haqiqatan bajar, taxmin qilma:

1. `npm run electron:build` — installer yaratilganini fayl hajmi bilan tasdiqla.
2. Paketlangan `.exe` ni ishga tushir, **10+ soniya** kut, protsess tirikligini va oyna
   sarlavhasini tekshir.
3. **Oynani skrinshot qilib**, sayt haqiqatan render bo'lganini ko'r — oq ekran emasligini.
4. 2-3 marta ketma-ket ishga tushirib, barqarorligini tekshir. stderr'da
   "UnhandledPromiseRejection" bo'lmasin.
5. Release chiqargandan keyin GitHub API bilan tasdiqla:
   - o'sha teg uchun release soni **aynan 1** ta;
   - `draft: false`;
   - `latest.yml`, `.exe`, `.exe.blockmap` — uchalasi ham bor;
   - **`latest.yml` ichidagi `path:` qiymati GitHub'dagi asset nomi bilan aynan mos**;
   - `releases/download/<tag>/<asset>.exe` havolasi **200** qaytaradi (404 emas).
6. Eng ishonchli test: eski versiyani ishga tushirib, stdout'da "Found version X" →
   "New version X has been downloaded" ketma-ketligini ko'r.

## 8. Testda chalg'itadigan narsalar

**TUZOQ 10:** Muhitda `ELECTRON_RUN_AS_NODE=1` bo'lsa (VS Code terminalida shunday),
paketlangan `.exe` oddiy Node kabi ishlab, oynasiz darhol yopiladi va **exit code 0** qaytaradi.
Dastur buzuq emas — test muhiti aybdor. Sinashdan oldin bu env o'zgaruvchini o'chir.
PowerShell'da protsess holatini tekshirishdan oldin `$p.Refresh()` chaqir, aks holda
`HasExited` noto'g'ri javob beradi.

**TUZOQ 11:** Build paytida `EPERM: rename ... win-unpacked.tmp` chiqishi mumkin (antivirus/
indekslash papkani vaqtincha bloklaydi). Papkani o'chirib qayta urin yoki output'ni boshqa
joyga chiqar: `-c.directories.output="<boshqa yo'l>"`.

**TUZOQ 12:** GitHub'dan Electron binarysi yuklanmasa (`ECONNRESET`), mirror ishlat:
```
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
```

## 9. Yakunda menga tushuntir

- Yangi versiya chiqarish uchun aynan qaysi buyruqlarni terishim kerak.
- Nega oddiy `git push` yetarli emasligini: workflow faqat **teg** kelganda ishlaydi.
- Updater kodisiz build qilingan eski o'rnatmalar **hech qachon** yangilanmasligini —
  ularga yangi installerni bir marta qo'lda o'rnatish kerakligini.

## 10. Release jarayoni

```
npm version patch        # versiyani oshiradi, commit va teg yaratadi
git push --follow-tags   # kod + teg -> Actions build qiladi -> Release chiqadi
```

---

## 11. Amalda qo'llanganda topilgan qo'shimcha holatlar

Bu bo'lim — yuqoridagi rejani **shu loyihada** (Vite emas, Next.js 16, App Router) ishga
tushirishda haqiqatan duch kelingan farqlar va tuzoqlar. 1-10 bandlar o'zgarmadi, faqat
quyidagilar ular ustiga qo'shildi.

### 11.1 Loyiha Vite emas, Next.js edi

`vite.config.js` umuman yo'q edi — bu Next.js loyihasi (`next.config.mjs`, `app/` router).
`base: './'` qo'yadigan joy yo'q, `vite build` degan skript ham yo'q.

**TUZOQ 13:** Next.js static export (`output: "export"`) **root-relative** yo'llar bilan
HTML chiqaradi (`/_next/...`). Buni `file://` orqali ochsa, TUZOQ 2 dagi bilan bir xil
oq ekran chiqadi — lekin Vite'dagi `base: './'` yechimi Next.js'da yo'q (rasman
qo'llab-quvvatlanmaydi). Yechim: `electron/main.js` ichida `serve-handler` orqali
`out/` papkasini `127.0.0.1` da lokal HTTP serverga ko'tarib, `loadURL('http://127.0.0.1:<port>')`
bilan ochish — `loadFile` emas. Port `0` bilan tasodifiy bo'sh portga bog'lanadi, shuning
uchun portlar to'qnashuvi bo'lmaydi.

`serve-handler` ham xuddi `electron-updater` kabi **`dependencies`** da bo'lishi shart
(TUZOQ 1 bilan bir xil sabab).

`next.config.mjs` ga `images.unoptimized: true` ham qo'shildi — static export'da Next.js
Image Optimization API ishlamaydi, `next/image` ishlatilgan sahifalar (`/products`,
`/recipes`) shusiz build paytida xato beradi.

`package.json` skriptlari: `"electron:dev": "next build && electron ."`,
`"electron:build": "next build && electron-builder"` — `vite build` o'rniga `next build`.
`build.files` da `dist/**/*` emas, `out/**/*`.

### 11.2 TUZOQ 10 aynan shu muhitda ushlandi

Test paytida `ELECTRON_RUN_AS_NODE=1` haqiqatan ham xalaqit berdi — va bitta muhim nuans
qo'shimcha topildi: **har bir yangi terminal chaqiruvida bu o'zgaruvchi qayta paydo bo'ladi**
(shell holati chaqiruvlar orasida saqlanmaydi). `Remove-Item Env:ELECTRON_RUN_AS_NODE` bilan
`.exe`ni ishga tushirish **bitta komandada** bo'lishi kerak — aks holda keyingi chaqiruvda
o'zgaruvchi yana `1` bo'lib, dastur yana sababsiz jimgina yopiladi.

### 11.3 GitHub Actions birinchi push'da ishga tushmadi

Teg push qilingandan keyin ham (`git push --follow-tags`), workflow **umuman** ishga
tushmadi — "There are no workflow runs yet" — garchi `release.yml` "active" deb ro'yxatda
tursa ham. Sabab: repo sozlamalarida Actions ruxsati o'chirilgan edi
(Settings → Actions → General → "Allow all actions and reusable workflows"). Buni yoqqandan
keyin ham eski teg avtomatik qayta ishga tushmaydi — tegni o'chirib qayta push qilish kerak
bo'ldi:

```
git push origin :refs/tags/vX.Y.Z   # tegni remote'dan o'chirish
git push origin refs/tags/vX.Y.Z    # qayta push — workflow shu safar ishga tushadi
```

### 11.4 `"type": "module"` package.json ga qo'shildi

`electron/main.js` ESM (`import`) sintaksisda, lekin `package.json`da `"type": "module"`
yo'q edi — Node har safar faylni qayta parslab, `MODULE_TYPELESS_PACKAGE_JSON` ogohlantirishi
chiqarardi (funksional xato emas, lekin ishga tushish sekinlashadi). Loyihada hech qanday
`require()` yo'qligi tekshirilgach, `"type": "module"` qo'shildi va ogohlantirish yo'qoldi.

### 11.5 Tasdiqlangan release'lar

- **v0.1.1** — dastlabki Electron+auto-updater sozlamasi. Release muvaffaqiyatli,
  `draft:false`, 3 ta asset (`latest.yml`, `.exe`, `.exe.blockmap`) — barchasi tekshirildi.
- **v0.1.2** — "Foydalanuvchilar" yorlig'i "USERS" ga o'zgartirildi (menu, sahifa sarlavhasi,
  statistika label'i, izohlar tavsifi). Release muvaffaqiyatli, `draft:false`, 3 ta asset ham
  mavjud (asset havolalarini shu ish muhitining tarmoq cheklovi tufayli to'g'ridan-to'g'ri
  yuklab bo'lmadi — `release-assets.githubusercontent.com` shu sandbox'da bloklangan;
  GitHub API orqali metadata darajasida tasdiqlangan).
