import { Message } from '..'
import { getTranscript } from './youtube'
import { error } from '../utils'
import { useEffect, useRef, useState } from 'preact/hooks'
import useSettings from './settings'

export function useChat(): [Message[], typeof ask, boolean] {
  const [chat, setChat] = useState<Message[]>([])
  const [isResponding, setIsresponging] = useState(true)
  const [settings] = useSettings()

  useEffect(() => {
    loadSummary()
  }, [])

  function loadModelResponse(messages: Message[]) {
    setIsresponging(true)
    setChat(messages)

    setChat([
      {
        role: 'assistant',
        content: messages[0].content,
      },
    ])

    const body = {
      messages,
      model: settings.model,
      stream: true,
      max_tokens: 2048,
      temperature: 0.2,
      top_p: 1,
      reasoning_format: 'hidden',
    }
  }

  async function loadSummary() {
    const transcript = (await getTranscript()) ?? ''

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
