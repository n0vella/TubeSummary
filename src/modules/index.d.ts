import '@violentmonkey/types'

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

export type Message = { role: string; content: string }
