import { getTranscript } from './youtube'

const endpoint = 'https://api.cerebras.ai/v1/chat/completions'
const modelName = 'llama-4-scout-17b-16e-instruct'

export async function ask(setResponse: (callback: string | ((oldResponse: string) => string)) => void) {
  const videoId = new URLSearchParams(window.location.search).get('v')

  if (!videoId) {
    throw "Couldn't get video id"
    return
  }

  const transcript = await getTranscript(videoId)

  const body = {
    messages: [
      {
        role: 'system',
        content: `Resume el siguiente video a partir de su transcripción.
          Quédate con las ideas clave que merece la pena recordar de el video.`,
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
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
      setResponse(result)
    },
  })
}
