interface CaptionTrack {
  baseUrl: string
}

interface AudioTrack {
  defaultCaptionTrackIndex: number
}

export interface YoutubeApiData {
  captions: {
    playerCaptionsTracklistRenderer: {
      defaultAudioTrackIndex: number
      captionTracks: CaptionTrack[]
      audioTracks: AudioTrack[]
    }
  }
}

export type Message = ChatCompletionMessageParam

export interface Settings {
  prompt: string
  endpoint: string
  model: string
  apiKey: string
}

export type CSS_Selector = string

export interface Storage {
  set: (items: { [key: string]: any }) => void
  get: (keys?: null | string | string[] | { [key: string]: any }) => Promise<any>
}
