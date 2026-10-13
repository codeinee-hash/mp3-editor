import { ID3Writer } from 'browser-id3-writer'
import type { CoverArtData, Mp3Tags } from '../types/tags'

/**
 * Writes updated ID3v2.3 tags and cover art to an MP3 file without re-encoding audio
 */
export async function writeMp3Tags(
  file: File,
  tags: Mp3Tags,
  cover: CoverArtData | null
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const writer = new ID3Writer(arrayBuffer)

  // Title
  if (tags.title.trim()) {
    writer.setFrame('TIT2', tags.title.trim())
  }

  // Artist(s)
  if (tags.artist.trim()) {
    writer.setFrame('TPE1', [tags.artist.trim()])
  }

  // Album
  if (tags.album.trim()) {
    writer.setFrame('TALB', tags.album.trim())
  }

  // Year
  const yearNumber = parseInt(tags.year.trim(), 10)
  if (!isNaN(yearNumber) && yearNumber > 0) {
    writer.setFrame('TYER', yearNumber)
  }

  // Genre
  if (tags.genre.trim()) {
    writer.setFrame('TCON', [tags.genre.trim()])
  }

  // Track number
  if (tags.trackNumber.trim()) {
    writer.setFrame('TRCK', tags.trackNumber.trim())
  }

  // Disc number
  if (tags.discNumber.trim()) {
    writer.setFrame('TPOS', tags.discNumber.trim())
  }

  // Composer
  if (tags.composer.trim()) {
    writer.setFrame('TCOM', [tags.composer.trim()])
  }

  // Comment
  if (tags.comment.trim()) {
    writer.setFrame('COMM', {
      description: '',
      text: tags.comment.trim(),
    })
  }

  // Cover art (APIC: type 3 = Cover Front)
  if (cover && cover.data && cover.data.length > 0) {
    // Ensure we provide a clean ArrayBuffer
    const coverBuffer = cover.data.buffer.slice(
      cover.data.byteOffset,
      cover.data.byteOffset + cover.data.byteLength
    )

    writer.setFrame('APIC', {
      type: 3,
      data: coverBuffer,
      description: cover.description || 'Front Cover',
    })
  }

  writer.addTag()
  return writer.getBlob()
}

/**
 * Generates an appropriate safe filename based on track tags
 */
export function generateFileName(tags: Mp3Tags, fallbackName: string): string {
  const artist = tags.artist.trim().replace(/[\\/:*?"<>|]/g, '_')
  const title = tags.title.trim().replace(/[\\/:*?"<>|]/g, '_')

  if (artist && title) {
    return `${artist} - ${title}.mp3`
  }
  if (title) {
    return `${title}.mp3`
  }
  return fallbackName.endsWith('.mp3') ? fallbackName : `${fallbackName}.mp3`
}

/**
 * Initiates browser download for a Blob
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
