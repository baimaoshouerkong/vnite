import { defaultPreset, mutsumiPreset, moonlightPreset } from './preset'
import log from 'electron-log/main.js'

export async function themePreset(presetName: string): Promise<string> {
  try {
    if (presetName === 'default') {
      return await defaultPreset()
    } else if (presetName === 'mutsumi') {
      return await mutsumiPreset()
    } else if (presetName === 'moonlight') {
      return await moonlightPreset()
    } else {
      throw new Error(`Unknown theme preset ${presetName}`)
    }
  } catch (error) {
    log.error(`Failed to set theme preset`, error)
    throw error
  }
}
