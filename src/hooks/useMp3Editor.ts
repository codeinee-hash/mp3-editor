import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { CoverArtData, Mp3Tags, TrackItem } from '../types/tags'
import { readMp3Metadata } from '../services/id3Reader'
import { downloadBlob, generateFileName, writeMp3Tags } from '../services/id3Writer'

export function useMp3Editor() {
  const [tracks, setTracks] = useState<TrackItem[]>([])
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  // Track all active Object URLs to safely revoke them only when tracks are removed or on full unmount
  const createdUrlsRef = useRef<Set<string>>(new Set())

  // Show auto-dismissing toast notifications
  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setNotification({ message, type })
      setTimeout(() => {
        setNotification((current) => (current?.message === message ? null : current))
      }, 4000)
    },
    []
  )

  const activeTrack = useMemo(() => {
    return tracks.find((t) => t.id === activeTrackId) || null
  }, [tracks, activeTrackId])

  // Clean up object URLs ONLY when useMp3Editor truly unmounts (empty deps)
  useEffect(() => {
    const urls = createdUrlsRef.current
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch {
          // ignore
        }
      })
      urls.clear()
    }
  }, [])

  /**
   * Parse and add newly selected MP3 files to the editor queue
   */
  const addFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      setIsProcessing(true)

      const newTrackItems: TrackItem[] = []

      for (const file of files) {
        try {
          const { tags, cover, formatInfo } = await readMp3Metadata(file)

          // Ensure audio blob has explicit 'audio/mpeg' mime type for broad browser compatibility
          const audioBlob = file.type === 'audio/mpeg' ? file : new Blob([file], { type: 'audio/mpeg' })
          const audioUrl = URL.createObjectURL(audioBlob)
          createdUrlsRef.current.add(audioUrl)

          if (cover?.previewUrl) {
            createdUrlsRef.current.add(cover.previewUrl)
          }

          const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

          newTrackItems.push({
            id,
            file,
            originalTags: { ...tags },
            currentTags: { ...tags },
            originalCover: cover,
            currentCover: cover,
            coverModified: false,
            isModified: false,
            formatInfo,
            audioUrl,
            status: 'idle',
          })
        } catch (error) {
          console.error('Error parsing file:', file.name, error)
          showNotification(
            `Ошибка при чтении ${file.name}: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
            'error'
          )
        }
      }

      setTracks((prev) => {
        const updated = [...prev, ...newTrackItems]
        if (!activeTrackId && newTrackItems.length > 0) {
          setActiveTrackId(newTrackItems[0].id)
        }
        return updated
      })

      setIsProcessing(false)
      if (newTrackItems.length > 0) {
        showNotification(
          `Загружено файлов: ${newTrackItems.length}`,
          'success'
        )
      }
    },
    [activeTrackId, showNotification]
  )

  /**
   * Update active track tags
   */
  const updateActiveTags = useCallback(
    (updatedTags: Mp3Tags) => {
      if (!activeTrackId) return

      setTracks((prev) =>
        prev.map((track) => {
          if (track.id !== activeTrackId) return track

          const tagsChanged = Object.keys(updatedTags).some(
            (key) =>
              updatedTags[key as keyof Mp3Tags] !==
              track.originalTags[key as keyof Mp3Tags]
          )
          const isModified = tagsChanged || track.coverModified

          return {
            ...track,
            currentTags: updatedTags,
            isModified,
            status: isModified ? 'idle' : track.status,
          }
        })
      )
    },
    [activeTrackId]
  )

  /**
   * Update active track cover art
   */
  const updateActiveCover = useCallback(
    (newCover: CoverArtData | null) => {
      if (!activeTrackId) return

      if (newCover?.previewUrl) {
        createdUrlsRef.current.add(newCover.previewUrl)
      }

      setTracks((prev) =>
        prev.map((track) => {
          if (track.id !== activeTrackId) return track

          const coverModified =
            (newCover && !track.originalCover) ||
            (!newCover && track.originalCover) ||
            (newCover && track.originalCover && newCover.data !== track.originalCover.data)

          const tagsChanged = Object.keys(track.currentTags).some(
            (key) =>
              track.currentTags[key as keyof Mp3Tags] !==
              track.originalTags[key as keyof Mp3Tags]
          )

          return {
            ...track,
            currentCover: newCover,
            coverModified: Boolean(coverModified),
            isModified: Boolean(coverModified || tagsChanged),
            status: 'idle',
          }
        })
      )
    },
    [activeTrackId]
  )

  /**
   * Remove a single track from the queue
   */
  const removeTrack = useCallback(
    (trackId: string) => {
      setTracks((prev) => {
        const trackToRemove = prev.find((t) => t.id === trackId)
        if (trackToRemove) {
          if (trackToRemove.audioUrl) {
            URL.revokeObjectURL(trackToRemove.audioUrl)
            createdUrlsRef.current.delete(trackToRemove.audioUrl)
          }
          if (trackToRemove.currentCover?.previewUrl) {
            URL.revokeObjectURL(trackToRemove.currentCover.previewUrl)
            createdUrlsRef.current.delete(trackToRemove.currentCover.previewUrl)
          }
        }

        const remaining = prev.filter((t) => t.id !== trackId)
        if (activeTrackId === trackId) {
          setActiveTrackId(remaining.length > 0 ? remaining[0].id : null)
        }
        return remaining
      })
    },
    [activeTrackId]
  )

  /**
   * Clear all tracks
   */
  const clearAll = useCallback(() => {
    createdUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // ignore
      }
    })
    createdUrlsRef.current.clear()

    setTracks([])
    setActiveTrackId(null)
  }, [])

  /**
   * Save and download the currently active track
   */
  const downloadActiveTrack = useCallback(async () => {
    if (!activeTrack) return

    setIsDownloading(true)
    try {
      const blob = await writeMp3Tags(
        activeTrack.file,
        activeTrack.currentTags,
        activeTrack.currentCover
      )

      const targetFileName = generateFileName(
        activeTrack.currentTags,
        activeTrack.formatInfo.fileName
      )

      downloadBlob(blob, targetFileName)

      setTracks((prev) =>
        prev.map((t) => (t.id === activeTrack.id ? { ...t, status: 'saved' } : t))
      )

      showNotification(`Файл «${targetFileName}» успешно сохранен!`, 'success')
    } catch (error) {
      console.error('Save error:', error)
      showNotification(
        `Ошибка сохранения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        'error'
      )
    } finally {
      setIsDownloading(false)
    }
  }, [activeTrack, showNotification])

  /**
   * Save and download all tracks sequentially
   */
  const downloadAllTracks = useCallback(async () => {
    if (!tracks.length) return

    setIsDownloadingAll(true)
    try {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const blob = await writeMp3Tags(
          track.file,
          track.currentTags,
          track.currentCover
        )
        const targetFileName = generateFileName(
          track.currentTags,
          track.formatInfo.fileName
        )

        downloadBlob(blob, targetFileName)

        setTracks((prev) =>
          prev.map((t) => (t.id === track.id ? { ...t, status: 'saved' } : t))
        )

        // Small delay between downloads to prevent browser suppression
        if (i < tracks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 800))
        }
      }

      showNotification(`Все файлы (${tracks.length}) успешно сохранены!`, 'success')
    } catch (error) {
      console.error('Save all error:', error)
      showNotification(
        `Ошибка при сохранении: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        'error'
      )
    } finally {
      setIsDownloadingAll(false)
    }
  }, [tracks, showNotification])

  return {
    tracks,
    activeTrack,
    activeTrackId,
    setActiveTrackId,
    isProcessing,
    isDownloading,
    isDownloadingAll,
    notification,
    addFiles,
    updateActiveTags,
    updateActiveCover,
    removeTrack,
    clearAll,
    downloadActiveTrack,
    downloadAllTracks,
  }
}
