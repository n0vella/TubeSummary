import { storage } from '../utils'
import defaultSettings from '../default-settings.json'
import { useEffect, useState } from 'preact/hooks'
import { Settings } from '..'

export default function useSettings(): [Settings, (new_settings: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    storage.get('settings').then((loaded_settings) => {
      if (loaded_settings) {
        setSettings(loaded_settings.settings as Settings)
      }
    })
  }, [])

  const save = (new_settings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...new_settings }
    setSettings(updatedSettings)
    storage.set({ settings: updatedSettings })
  }

  return [settings, save] as const
}
