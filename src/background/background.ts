import { streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { Message, Settings } from '..'
import { readSettings, storage } from '../utils'

function describeError(e: unknown): string {
  const err = e as Error & { statusCode?: number; responseBody?: string }
  return [err?.statusCode && `HTTP ${err.statusCode}`, err?.message ?? String(e), err?.responseBody].filter(Boolean).join(' — ')
}

async function listModels(endpoint: string, apiKey: string) {
  const res = await fetch(`${endpoint.replace(/\/+$/, '')}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${await res.text()}`)
  return (await res.json()).data
}

const openSettings = () => chrome.tabs.create({ url: chrome.runtime.getURL('dist/settings/settings.html') })

// listen orders from content scripts
chrome.runtime.onMessage.addListener(function messageListener(message, sender, sendResponse) {
  const tabId = sender.tab?.id
  const sendError = (e: unknown) => chrome.tabs.sendMessage(tabId, { action: 'error', errorText: describeError(e) })

  async function sendChunks() {
    const settings = await readSettings()
    const provider = createOpenAICompatible({
      name: 'provider',
      baseURL: settings.endpoint,
      apiKey: settings.apiKey,
    })

    let failed = false
    const stream = streamText({
      model: provider(settings.model),
      instructions: message.messages[0].content,
      messages: message.messages.slice(1),
      // stream errors (402, 404, quota...) arrive here, not in the catch below
      onError: ({ error }) => {
        failed = true
        sendError(error)
      },
    })

    try {
      let text = ''
      for await (const delta of stream.textStream) {
        text += delta
        await chrome.tabs.sendMessage(tabId, { action: 'modelChunk', messages: message.messages, text })
      }
    } catch (e) {
      // sync errors (bad config, messaging failures) also reach the frontend
      failed = true
      await sendError(e)
    }

    if (failed) return false
    await chrome.tabs.sendMessage(tabId, { action: 'modelEnd' })
    return true
  }

  switch (message.action) {
    case 'loadModelResponse':
      sendChunks().then((r) => sendResponse(r))
      return true
    case 'openSettings':
      openSettings()
      sendResponse()
      return true
    case 'listModels':
      listModels(message.endpoint, message.apiKey)
        .then((models) => sendResponse(models))
        .catch(sendError)
      return true
  }
})

// open settings in a new tab when clicked extension button
chrome.action.onClicked.addListener(openSettings)
