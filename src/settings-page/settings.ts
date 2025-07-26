import { readSettings, storage } from '../utils'
import { SettingsForm } from '.'
import { Settings } from '..'
import defaultSettings from '../default-settings.json'

const form = document.querySelector<SettingsForm>('#settings-form')
const button = document.querySelector<HTMLButtonElement>('#save-button')
const resetDefaultPromptButton = document.querySelector<HTMLSpanElement>('#reset-default-prompt')

let settings: Settings

async function loadSettings() {
  settings = await readSettings()

  form.prompt.value = settings.prompt
  form.endpoint.value = settings.endpoint
  form.model.value = settings.model
  form.apiKey.value = settings.apiKey
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

  settings = await readSettings()
  button.disabled = true
}

function onInput() {
  button.disabled = form.prompt.value === settings.prompt && form.endpoint.value === settings.endpoint && form.model.value === settings.model && form.apiKey.value === settings.apiKey
}

function resetDefaultPrompt() {
  form.prompt.value = defaultSettings.prompt
}

document.addEventListener('DOMContentLoaded', () => {
  form.oninput = onInput
  form.onsubmit = onSubmit
  button.disabled = true
  resetDefaultPromptButton.onclick = (e) => {
    resetDefaultPrompt()
    onInput()
  }

  loadSettings()
})
