import { storage } from '../utils'
import defaultSettings from '../default-settings.json'
import { useRef } from 'preact/hooks'
import { Settings } from '..'

export default function useSettings() {
  const _settings = useRef<Settings>(defaultSettings)

  return [_settings.current]
}
