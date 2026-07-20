import { app, BrowserWindow, shell } from 'electron'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const devServerUrl = process.env.VITE_DEV_SERVER_URL

// Next.js static export emits root-relative asset paths (/_next/...).
// Loading the HTML directly via file:// resolves those against the
// filesystem root and produces a white screen, so the packaged app
// serves the exported "out" folder over a local HTTP server instead.
let staticServer = null

function startStaticServer(outDir) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) =>
      handler(req, res, { public: outDir, cleanUrls: true }),
    )
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      staticServer = server
      resolve(server.address().port)
    })
  })
}

async function createWindow() {
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

  if (devServerUrl) {
    win.loadURL(devServerUrl)
  } else {
    const outDir = path.join(__dirname, '../out')
    const port = await startStaticServer(outDir)
    win.loadURL(`http://127.0.0.1:${port}`)
  }
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
  if (staticServer) staticServer.close()
  if (process.platform !== 'darwin') app.quit()
})
