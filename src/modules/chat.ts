import { useEffect, useState } from 'react'
import { Message } from '..'
import { getTranscript } from './youtube'
import { Settings } from '..'
import { error } from '../utils'

export function useChat(): [Message[], typeof ask, boolean] {
  const [chat, setChat] = useState<Message[]>([])
  const [isResponding, setIsresponging] = useState(true)
  const settings = GM_getValue<Settings>('settings')

  useEffect(() => {
    loadSummary()
  }, [])

  function loadModelResponse(messages: Message[]) {
    setIsresponging(true)
    setChat(messages)

    const body = {
      messages,
      model: settings.model,
      stream: true,
      max_tokens: 2048,
      temperature: 0.2,
      top_p: 1,
      reasoning_format: 'hidden',
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: settings.endpoint,
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + settings.apiKey,
      },
      onloadend: () => setIsresponging(false),
      onabort: () => {
        setIsresponging(false)
        setChat([
          ...messages,
          {
            role: 'assistant',
            content: "There was a problem with model's response. See console for more info",
          },
        ])
      },
      onprogress: function (response) {
        let responses
        let result = ''

        try {
          responses = response.responseText?.split('\n')

          if (!responses) return

          for (const response of responses) {
            if (response) {
              const parseableResponse = '{' + response.replace('data: ', '"data": ') + '}'
              try {
                const data = JSON.parse(parseableResponse).data
                const delta = data.choices[0].delta.content

                if (delta) {
                  result += delta
                }
              } catch {
                error('Could not parse delta in chunk', response)
              }
            }
          }
        } catch (exc) {
          error(`There was a problem with model's response: ${exc}\n`, response)
          result = "There was a problem with model's response. See console for more info"
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
