import { Message, Settings } from '..'
import { getTranscript } from './youtube'
import { error, openSettingsPage, readSettings, storage } from '../utils'
import { useEffect, useRef, useState } from 'preact/hooks'

export function useChat(): [Message[], typeof ask, boolean] {
  const [chat, setChat] = useState<Message[]>([])
  const [isResponding, setIsresponging] = useState(true)

  function parseTimestamps(msg: string) {
    const secondsToTimeStr = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = Math.floor(seconds % 60)

      if (hours) {
        return hours + ':' + minutes + ':' + secs.toString().padStart(2, '0')
      } else {
        return minutes + ':' + secs.toString().padStart(2, '0')
      }
    }

    const timestampRegex = /\[(\d+)s\]/g
    const params = new URLSearchParams(window.location.search)
    const videoID = params.get('v')

    return msg.replace(timestampRegex, (_match, seconds) => `[[${secondsToTimeStr(seconds)}]](/watch?v=${videoID}&t=${seconds})`)
  }

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
              content: parseTimestamps(message.text),
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
    let transcript = ''

    try {
      transcript = await getTranscript()
    } catch (e) {
      setError('Trouble fetching transcription: ' + e)
      return
    }

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
