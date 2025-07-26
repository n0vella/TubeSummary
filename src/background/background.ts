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

    return true
  }

  const settings = await readSettings()

  switch (message.action) {
    case 'loadModelResponse':
      return await sendChunks()
  }
})

// open settigns in a new tab when clicked
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL('dist-settings/settings.html') })
})
