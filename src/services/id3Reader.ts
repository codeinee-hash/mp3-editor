import { parseBlob, selectCover } from 'music-metadata'
import type { AudioFormatInfo, CoverArtData, Mp3Tags } from '../types/tags'

export interface ParsedTrackData {
  tags: Mp3Tags
  cover: CoverArtData | null
  formatInfo: AudioFormatInfo
}

/**
 * Reads ID3 tags, album art and audio format information from a local MP3 file
 */
export async function readMp3Metadata(file: File): Promise<ParsedTrackData> {
  const metadata = await parseBlob(file)
  const common = metadata.common || {}
  const format = metadata.format || {}

  // Parse track number format: e.g. "1" or "1/10"
  let trackNumberStr = ''
  if (common.track?.no !== null && common.track?.no !== undefined) {
    trackNumberStr = common.track.of
      ? `${common.track.no}/${common.track.of}`
      : `${common.track.no}`
  }

  // Parse disc number format: e.g. "1" or "1/2"
  let discNumberStr = ''
  if (common.disk?.no !== null && common.disk?.no !== undefined) {
    discNumberStr = common.disk.of
      ? `${common.disk.no}/${common.disk.of}`
      : `${common.disk.no}`
  }

  const tags: Mp3Tags = {
    title: common.title || '',
    artist: common.artist || (common.artists ? common.artists.join(', ') : ''),
    album: common.album || '',
    year: common.year ? String(common.year) : '',
    genre: common.genre ? common.genre.join(', ') : '',
    trackNumber: trackNumberStr,
    discNumber: discNumberStr,
    composer: common.composer ? common.composer.join(', ') : '',
    comment: common.comment ? common.comment.join('\n') : '',
  }

  // Extract cover art
  let cover: CoverArtData | null = null
  const selectedPic = selectCover(common.picture)

  if (selectedPic && selectedPic.data && selectedPic.data.length > 0) {
    const mimeType = selectedPic.format || 'image/jpeg'
    const blob = new Blob([selectedPic.data as BlobPart], { type: mimeType })
    const previewUrl = URL.createObjectURL(blob)

    cover = {
      data: selectedPic.data,
      mimeType,
      previewUrl,
      description: selectedPic.description || 'Cover',
      sizeBytes: selectedPic.data.length,
    }
  }

  const formatInfo: AudioFormatInfo = {
    duration: format.duration,
    bitrate: format.bitrate,
    sampleRate: format.sampleRate,
    numberOfChannels: format.numberOfChannels,
    container: format.container,
    codec: format.codec,
    lossless: format.lossless,
    fileSize: file.size,
    fileName: file.name,
  }

  return {
    tags,
    cover,
    formatInfo,
  }
}

/**
 * Creates CoverArtData from an uploaded image File
 */
export async function processImageFile(imageFile: File): Promise<CoverArtData> {
  const arrayBuffer = await imageFile.arrayBuffer()
  const data = new Uint8Array(arrayBuffer)
  const mimeType = imageFile.type || 'image/jpeg'
  const previewUrl = URL.createObjectURL(imageFile)

  return {
    data,
    mimeType,
    previewUrl,
    description: 'Front Cover',
    sizeBytes: imageFile.size,
  }
}
