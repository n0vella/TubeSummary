import { getTranscript } from './youtube'

const endpoint = 'https://api.cerebras.ai/v1/chat/completions'
const modelName = 'llama-4-scout-17b-16e-instruct'

export function ask() {
  return new Promise<string>(async (resolve, reject) => {
    const videoId = new URLSearchParams(window.location.search).get('v')

    if (!videoId) {
      reject("Couldn't get video id")
      return
    }

    const transcript = await getTranscript(videoId)

    console.log(transcript)

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
      stream: false,
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
      onload: function (response) {
        const resp = JSON.parse(response.response as string)

        console.log(resp)

        if (!resp.choices) {
          return reject(['Error in response', resp])
        }

        const content: string = resp.choices[0].message.content
        resolve(content)
      },
      onerror: function (error) {
        reject(error)
      },
    })
  })
}
