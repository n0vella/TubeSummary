import { readSettings, storage } from '../utils'
import { SettingsForm } from '.'
import { Settings } from '..'
import defaultSettings from '../default-settings.json'
import { Model } from 'openai/resources/models'

const form = document.querySelector<SettingsForm>('#settings-form')
const button = document.querySelector<HTMLButtonElement>('#save-button')
const resetDefaultPromptButton = document.querySelector<HTMLSpanElement>('#reset-default-prompt')

let settings: Settings
const modelDetails = {}

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

  const models: (Model & { [key: string]: string })[] = await chrome.runtime.sendMessage({
    action: 'listModels',
    endpoint,
    apiKey,
  })

  for (const model of models) {
    const option = document.createElement('option')
    option.value = model.id
    datalist.appendChild(option)

    modelDetails[model.id] = Object.entries(model).filter(([key]) => key != 'id')
  }
}

function showModelDetails() {
  const model = document.querySelector<HTMLInputElement>('input[name="model"]').value

  const modelDetailsSection = document.getElementById('model-details-section')
  modelDetailsSection.hidden = !modelDetails[model]

  const modelDetailsDiv = document.getElementById('model-details')
  modelDetailsDiv.innerHTML = modelDetails[model].map(([key, value]) => `<span><b>${key}</b>: <i>${value}</i><span>`).join('<br>')
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
  modelsInput.addEventListener('blur', showModelDetails)

  await loadAvailableModels()
  showModelDetails()
})
