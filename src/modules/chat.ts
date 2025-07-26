import { Message, Settings } from '..'
import { getTranscript } from './youtube'
import { error, readSettings, storage } from '../utils'
import { useEffect, useRef, useState } from 'preact/hooks'

export function useChat(): [Message[], typeof ask, boolean] {
  const [chat, setChat] = useState<Message[]>([])
  const [isResponding, setIsresponging] = useState(true)

  useEffect(() => {
    async function messageListener(message, sender, sendResponse) {
      if (sender.id !== chrome.runtime.id) {
        return
      }

      if (message.action === 'modelChunk') {
        setChat((prev) => [
          ...message.messages,
          {
            role: 'assistant',
            content: message.text,
          },
        ])
      }
    }
    chrome.runtime.onMessage.addListener(messageListener)

    loadSummary()

    return () => chrome.runtime.onMessage.removeListener(messageListener)
  }, [])

  async function loadModelResponse(messages: Message[]) {
    setIsresponging(true)
    setChat(messages)

    await chrome.runtime.sendMessage({
      action: 'loadModelResponse',
      messages,
    })

    setIsresponging(false)
  }

  async function loadSummary() {
    const transcript = (await getTranscript()) ?? ''
    const settings = await readSettings()

    if (!settings.prompt.includes('{transcription}')) {
      error('Prompt must contain "{transcription}" flag')
      setChat([
        {
          role: 'assistant',
          content: 'Prompt must contain "{transcription}" flag',
        },
      ])
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
