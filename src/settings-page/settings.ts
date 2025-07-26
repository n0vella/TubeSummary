import { readSettings, storage } from '../utils'
import { SettingsForm } from '.'
import { Settings } from '..'

const form = document.querySelector<SettingsForm>('#settings-form')
const button = document.querySelector<HTMLButtonElement>('#save-button')

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

function onInput(e: Event) {
  button.disabled = form.prompt.value === settings.prompt && form.endpoint.value === settings.endpoint && form.model.value === settings.model && form.apiKey.value === settings.apiKey
}

document.addEventListener('DOMContentLoaded', () => {
  form.oninput = onInput
  form.onsubmit = onSubmit
  button.disabled = true

  loadSettings()
})
