import { useEffect, useState } from 'react'
import { Message } from '..'
import { getTranscript } from './youtube'
import { Settings } from '..'

const endpoint = 'https://api.cerebras.ai/v1/chat/completions'
const modelName = 'llama-4-scout-17b-16e-instruct'

export function useChat(): [Message[], typeof ask, boolean] {
  const [chat, setChat] = useState<Message[]>([])
  const [isResponding, setIsresponging] = useState(true)

  useEffect(() => {
    loadSummary()
  }, [])

  function loadModelResponse(messages: Message[]) {
    setIsresponging(true)
    setChat(messages)

    const body = {
      messages,
      model: modelName,
      stream: true,
      max_tokens: 2048,
      temperature: 0.2,
      top_p: 1,
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: endpoint,
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        Authorization: 'Bearer ' + import.meta.env.VITE_CEREBRAS_TOKEN,
      },
      onloadend: () => setIsresponging(false),
      onabort: () => setIsresponging(false),
      onprogress: function (response) {
        const responses = response.responseText?.split('\n')

        if (!responses) return

        let result = ''
        for (const response of responses) {
          if (response) {
            const parseableResponse = '{' + response.replace('data: ', '"data": ') + '}'
            const data = JSON.parse(parseableResponse).data
            const delta = data.choices[0].delta.content

            if (delta) {
              result += delta
            }
          }
        }

        setChat([
          ...messages,
          {
            role: 'assistant',
            content: result,
          },
        ])
      },
    })
  }

  async function loadSummary() {
    const transcript = (await getTranscript()) ?? ''
    const settings = GM_getValue<Settings>('settings')

    if (!settings.prompt.includes('{transcription}')) {
      throw 'Prompt must contain "{transcription}" flag'
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
