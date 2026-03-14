import { YoutubeApiData } from "../index"


function extractInnertubeApiKey() {
  const pattern = '"INNERTUBE_API_KEY":\s*"([a-zA-Z0-9_-]+)"'

  return document.documentElement.innerHTML.match(pattern).at(1)
}

async function fetchInnertubeData(videoId: string) {
  const apiKey = extractInnertubeApiKey()

  const r = await fetch('https://www.youtube.com/youtubei/v1/player?key=' + apiKey, {
    body: JSON.stringify({
      context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38' } },
      videoId,
    }),
    method: 'POST',
  })

  return await r.json()
}

export async function getTranscript() {
  const videoId = new URLSearchParams(window.location.search).get('v')

  if (!videoId) {
    throw "Couldn't get video id"
    return
  }

  const data: YoutubeApiData = await fetchInnertubeData(videoId)


  if (data.captions === undefined) {
    throw "Looks like this video doesn't have captions or we had trouble fetching them"
  }

  const captions = data.captions.playerCaptionsTracklistRenderer

  let defaultCaptionLanguage = captions.audioTracks[0].defaultCaptionTrackIndex ?? captions.defaultAudioTrackIndex ?? 0

  if (defaultCaptionLanguage > captions.captionTracks.length - 1) {
    // defaultCaptionLanguage could be a large number on audio-translated videos
    // TODO: check if this solution works in every case
    defaultCaptionLanguage = 0
  }

  const captionsUrl = new URL(captions.captionTracks[defaultCaptionLanguage].baseUrl)
  captionsUrl.searchParams.set("fmt", "") // return basic xml

  const r = await fetch(captionsUrl)

  const xmlText = await r.text()

  // Parse XML to DOM
  const parser = new DOMParser()

  const xml = parser.parseFromString(xmlText, 'text/xml')
  const entityParser = new DOMParser()

  let transcription = ''

  for (const caption of xml.getElementsByTagName('text')) {
    const escapedText = caption.textContent ?? ''
    const time = Number(caption.getAttribute('start'))
    const doc = entityParser.parseFromString(`<root>${escapedText}</root>`, 'text/xml')
    const text = doc.documentElement.textContent || ''

    if (time) {
      transcription += `[${Math.floor(time)}s]\n`
    }

    transcription += text + '\n'
  }

  return transcription
}
