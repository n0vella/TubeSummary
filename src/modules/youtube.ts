import { YoutubeApiData } from '..'

async function fetchVideoData(videoId: string): Promise<YoutubeApiData> {
  // https://stackoverflow.com/questions/67615278/get-video-info-youtube-endpoint-suddenly-returning-404-not-found/68492807#68492807
  const url = 'https://release-youtubei.sandbox.googleapis.com/youtubei/v1/player'

  const payload = {
    videoId,
    context: {
      client: {
        hl: 'en',
        clientName: 'WEB',
        clientVersion: '2.20210721.00.00',
      },
      user: {
        lockedSafetyMode: false,
      },
      request: {
        useSsl: true,
        internalExperimentFlags: [],
        consistencyTokenJars: [],
      },
    },
    playbackContext: {
      contentPlaybackContext: {
        vis: 0,
        splay: false,
        autoCaptionsDefaultOn: false,
        autonavState: 'STATE_NONE',
        html5Preference: 'HTML5_PREF_WANTS',
        lactMilliseconds: '-1',
      },
    },
    racyCheckOk: false,
    contentCheckOk: false,
  }

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(payload),
  })

  return await r.json()
}

export async function getTranscript() {
  const videoId = new URLSearchParams(window.location.search).get('v')

  if (!videoId) {
    throw "Couldn't get video id"
    return
  }

  const data = await fetchVideoData(videoId)

  if (data.captions === undefined) {
    throw "Looks like this video doesn't have captions"
  }

  const captions = data.captions.playerCaptionsTracklistRenderer

  let defaultCaptionLanguage = captions.audioTracks[0].defaultCaptionTrackIndex ?? captions.defaultAudioTrackIndex ?? 0

  if (defaultCaptionLanguage > captions.captionTracks.length - 1) {
    // defaultCaptionLanguage could be a large number on audio-translated videos
    // TODO: check if this solution works in every case
    defaultCaptionLanguage = 0
  }

  const captionsUrl = captions.captionTracks[defaultCaptionLanguage].baseUrl

  const r = await fetch(captionsUrl)

  const xmlText = await r.text()

  // Parse XML to DOM
  const parser = new DOMParser()

  const xml = parser.parseFromString(xmlText, 'text/xml')
  const jsonTranscript: any[] = []
  const entityParser = new DOMParser()

  let transcription = ''

  for (const caption of xml.getElementsByTagName('text')) {
    const escapedText = caption.textContent ?? ''
    const doc = entityParser.parseFromString(`<root>${escapedText}</root>`, 'text/xml')
    const text = doc.documentElement.textContent || ''

    transcription += text + '\n'
  }

  return transcription
}
