import { readSettings, storage } from '../utils'
import { SettingsForm } from '.'
import { Settings } from '..'
import defaultSettings from '../default-settings.json'

const form = document.querySelector<SettingsForm>('#settings-form')
const button = document.querySelector<HTMLButtonElement>('#save-button')
const resetDefaultPromptButton = document.querySelector<HTMLSpanElement>('#reset-default-prompt')

let settings: Settings
// let models: Model

async function loadSettings() {
  settings = await readSettings()

  form.prompt.value = settings.prompt
  form.endpoint.value = settings.endpoint
  form.model.value = settings.model
  form.apiKey.value = settings.apiKey
}

async function loadAvailableModels() {
  const datalist = document.getElementById('models')
  const endpoint = document.querySelector<HTMLInputElement>('input[name="endpoint"]').value
  const apiKey = document.querySelector<HTMLInputElement>('input[name="apiKey"]').value

  datalist.innerHTML = ''

  const models = await chrome.runtime.sendMessage({
    action: 'listModels',
    endpoint,
    apiKey,
  })

  for (const model of models) {
    const option = document.createElement('option')
    option.value = model.id
    datalist.appendChild(option)
  }
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
  if (!settings) {
    button.disabled = true
    return
  }

  button.disabled = form.prompt.value === settings.prompt && form.endpoint.value === settings.endpoint && form.model.value === settings.model && form.apiKey.value === settings.apiKey
}

function resetDefaultPrompt() {
  form.prompt.value = defaultSettings.prompt
}

document.addEventListener('DOMContentLoaded', async () => {
  form.oninput = onInput
  form.onsubmit = onSubmit
  button.disabled = true
  resetDefaultPromptButton.onclick = (e) => {
    resetDefaultPrompt()
    onInput()
  }

  await loadSettings()

  const modelsInput = document.querySelector<HTMLInputElement>('input[name="model"]')

  modelsInput.addEventListener('focus', loadAvailableModels)
})
