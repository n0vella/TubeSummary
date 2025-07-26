import OpenAI from 'openai'
import { Message, Settings } from '..'

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
chrome.runtime.onMessage.addListener(function messageListener(message, sender, sendResponse) {
  switch (message.action) {
    case 'loadModelResponse':
      ;(async () => {
        let text = ''
        for await (const chunk of call(message.messages, message.settings)) {
          text += chunk
          await chrome.tabs.sendMessage(sender.tab.id, { action: 'modelChunk', messages: message.messages, text })
        }
        return true
      })()
  }
})

// open settigns in a new tab when clicked
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL('dist-settings/settings.html') })
})
