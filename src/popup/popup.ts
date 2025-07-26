import { storage } from '../utils'
import { SettingsForm } from '.'
import { Settings } from '..'
import defaultSettings from '../default-settings.json'

const form = document.querySelector<SettingsForm>('#settings-form')

async function loadSettings() {
  const settings: Settings = (await storage.get('settings')).settigns ?? defaultSettings
  form.prompt.defaultValue = settings.prompt
  form.endpoint.defaultValue = settings.endpoint
  form.model.defaultValue = settings.model
  form.apiKey.defaultValue = settings.apiKey
}

async function onSubmit(e: SubmitEvent) {
  e.preventDefault()

  storage.set({
    settings: {
      prompt: form.prompt.value,
      endpoint: form.endpoint.value,
      model: form.model.value,
      apiKey: form.apiKey.value,
    },
  })
}

form.onsubmit = onSubmit

loadSettings()
