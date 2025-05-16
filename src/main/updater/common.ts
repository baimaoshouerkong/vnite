import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { ConfigDBManager } from '~/database'
import log from 'electron-log/main.js'

export async function setupAutoUpdater(mainWindow: BrowserWindow): Promise<void> {
  // Development Environment Configuration
  if (process.env.NODE_ENV === 'development') {
    autoUpdater.forceDevUpdateConfig = true
  }

  const allowPrerelease = await ConfigDBManager.getConfigValue('updater.allowPrerelease')
  log.info('Allow pre-release:', allowPrerelease)

  autoUpdater.allowPrerelease = allowPrerelease

  autoUpdater.autoDownload = false

  // Add error handling
  autoUpdater.on('error', (error) => {
    log.error('update error:', error)
    mainWindow?.webContents.send('update-error', error.message)
  })

  // Add processing to check for the start of an update
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...')
    mainWindow?.webContents.send('checking-for-update')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Discover the new version:', info.version)
    const updateInfo = {
      version: info.version,
      releaseNotes: Array.isArray(info.releaseNotes)
        ? info.releaseNotes.map((note) => note.note).join('\n')
        : info.releaseNotes || ''
    }
    mainWindow?.webContents.send('update-available', updateInfo)
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('Currently in the latest version:', info.version)
    mainWindow?.webContents.send('update-not-available')
  })

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow?.webContents.send('update-progress', progressObj)
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('The update has finished downloading')
    mainWindow?.webContents.send('update-downloaded')
  })

  ipcMain.handle('start-update', async () => {
    try {
      return await autoUpdater.downloadUpdate()
    } catch (error) {
      log.error('Failed to download update:', error)
      throw error
    }
  })

  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall(false, true)
  })

  // Add a processor for manually checking for updates
  ipcMain.handle('check-for-updates', async () => {
    try {
      return await autoUpdater.checkForUpdates()
    } catch (error) {
      log.error('Failed to check for updates:', error)
      throw error
    }
  })

  // Add handler for updating auto-updater configuration
  ipcMain.handle('update-updater-config', async () => {
    try {
      await updateUpdater()
      return { success: true }
    } catch (error) {
      log.error('Failed to update auto-updater configuration:', error)
      throw error
    }
  })

  // Delay checking for updates to make sure the window is fully loaded
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((error) => {
      log.error('Failure to automatically check for updates:', error)
    })
  }, 3000)
}

/**
 * Update auto-updater configuration
 * Re-read settings from the configuration database and apply them to autoUpdater
 */
export async function updateUpdater(): Promise<void> {
  const allowPrerelease = await ConfigDBManager.getConfigValue('updater.allowPrerelease')

  autoUpdater.allowPrerelease = allowPrerelease

  log.info('Updated auto-updater settings:', { allowPrerelease })
}

// const DBVersion = {
//   pathJson: 2
// }

// export async function upgradeDBVersion(): Promise<void> {
//   const pathJsonVersion = await getDBValue('version.json', ['pathJson'], 1)
//   if (pathJsonVersion == 1) {
//     try {
//       await upgradeAllGamesPathJson1to2()
//       await setDBValue('version.json', ['pathJson'], DBVersion.pathJson)
//       log.info(`path.json Version Upgrade Successful：${pathJsonVersion} -> ${DBVersion.pathJson}`)
//     } catch (error) {
//       log.error(`path.json Version Upgrade Failure：${pathJsonVersion} -> ${DBVersion.pathJson}`, error)
//     }
//   }
// }
