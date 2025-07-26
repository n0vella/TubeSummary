import { Message, Settings } from '..'
import { getTranscript } from './youtube'
import { error, openSettingsPage, readSettings, storage } from '../utils'
import { useEffect, useRef, useState } from 'preact/hooks'

export function useChat(): [Message[], typeof ask, boolean] {
  const [chat, setChat] = useState<Message[]>([])
  const [isResponding, setIsresponging] = useState(true)

  useEffect(() => {
    async function messageListener(message, sender, sendResponse) {
      if (sender.id !== chrome.runtime.id) {
        return
      }

      switch (message.action) {
        case 'modelChunk':
          setChat([
            ...message.messages,
            {
              role: 'assistant',
              content: message.text,
            },
          ])
          return
        case 'error':
          setError(message.errorText)
          return
        case 'modelEnd':
          setIsresponging(false)
          return
      }
    }
    chrome.runtime.onMessage.addListener(messageListener)

    loadSummary()

    return () => chrome.runtime.onMessage.removeListener(messageListener)
  }, [])

  function setError(message: string) {
    setChat([
      {
        role: 'error',
        content: message,
      },
    ])
    error(message)
  }

  async function loadModelResponse(messages: Message[]) {
    setIsresponging(true)
    setChat(messages)

    await chrome.runtime.sendMessage({
      action: 'loadModelResponse',
      messages,
    })
  }

  async function loadSummary() {
    const transcript = (await getTranscript()) ?? ''
    const settings = await readSettings()

    if (!settings.apiKey) {
      setError('You must configure a provider first')
      openSettingsPage()
      return
    }

    if (!settings.prompt.includes('{transcription}')) {
      setError('Prompt must contain "{transcription}" flag')
      return
    }

    const prompt = settings.prompt.replace('{transcription}', transcript)

    const messages: Message[] = [
      {
        role: 'system',
        content: prompt,
      },
    ]

    loadModelResponse(messages)
  }

  function ask(question: string) {
    const newChat = [
      ...chat,
      {
        role: 'user',
        content: question,
      },
    ]

    loadModelResponse(newChat)
  }

  return [chat, ask, isResponding]
}
