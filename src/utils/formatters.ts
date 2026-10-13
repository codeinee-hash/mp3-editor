/**
 * Formats seconds into mm:ss format
 */
export function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Formats bytes into human-readable size (KB, MB)
 */
export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Formats bitrate in kbps
 */
export function formatBitrate(bitrate?: number): string {
  if (!bitrate) return ''
  return `${Math.round(bitrate / 1000)} kbps`
}
