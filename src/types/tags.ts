export interface Mp3Tags {
  title: string
  artist: string
  album: string
  year: string
  genre: string
  trackNumber: string
  discNumber: string
  composer: string
  comment: string
}

export interface CoverArtData {
  data: Uint8Array
  mimeType: string
  previewUrl: string
  description?: string
  width?: number
  height?: number
  sizeBytes?: number
}

export interface AudioFormatInfo {
  duration?: number // in seconds
  bitrate?: number // in bps
  sampleRate?: number // in Hz
  numberOfChannels?: number
  container?: string
  codec?: string
  lossless?: boolean
  fileSize: number // in bytes
  fileName: string
}

export interface TrackItem {
  id: string
  file: File
  originalTags: Mp3Tags
  currentTags: Mp3Tags
  originalCover: CoverArtData | null
  currentCover: CoverArtData | null
  coverModified: boolean
  isModified: boolean
  formatInfo: AudioFormatInfo
  audioUrl: string
  status: 'idle' | 'reading' | 'saving' | 'saved' | 'error'
  errorMessage?: string
}
