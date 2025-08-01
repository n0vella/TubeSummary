import OpenAI from 'openai'
import { Message, Settings } from '..'
import { readSettings, storage } from '../utils'

async function* call(messages: Message[], settings: Settings) {
  const client = new OpenAI({
    baseURL: settings.endpoint,
    apiKey: settings.apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = await client.chat.completions.create({
    model: settings.model,
    messages,
    stream: true,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content
    if (delta) yield delta
  }
}

async function listModels(endpoint: string, apiKey: string) {
  const client = new OpenAI({
    baseURL: endpoint,
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  return (await client.models.list()).data
}

const openSettings = () => chrome.tabs.create({ url: chrome.runtime.getURL('dist/settings/settings.html') })

// listen orders from content scripts
chrome.runtime.onMessage.addListener(async function messageListener(message, sender, sendResponse) {
  async function error(msg: string) {
    await chrome.tabs.sendMessage(sender.tab.id, { action: 'error', errorText: msg })
  }

  async function sendChunks() {
    let text = ''
    try {
      for await (const chunk of call(message.messages, settings)) {
        text += chunk
        await chrome.tabs.sendMessage(sender.tab.id, { action: 'modelChunk', messages: message.messages, text })
      }
    } catch (e) {
      await error(e.message || String(e))
      return false
    }

    await chrome.tabs.sendMessage(sender.tab.id, { action: 'modelEnd' })
    return true
  }

  const settings = await readSettings()

  switch (message.action) {
    case 'loadModelResponse':
      return await sendChunks()
    case 'openSettings':
      return openSettings()
    case 'listModels':
      return await listModels(message.endpoint, message.apiKey)
  }
})

// open settigns in a new tab when clicked extension button
chrome.action.onClicked.addListener(openSettings)
