import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward, AlertCircle, Loader2 } from 'lucide-react'
import { formatDuration } from '../../utils/formatters'

interface AudioPlayerProps {
  audioUrl: string
  title: string
  artist: string
  coverUrl?: string
  totalDuration?: number
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title,
  artist,
  coverUrl,
  totalDuration = 0,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [loadedDuration, setLoadedDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)

  const effectiveDuration = totalDuration > 0 ? totalDuration : loadedDuration

  // Re-sync and load ONLY when audioUrl changes (switching track)
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
      setIsLoading(false)
      setHasError(false)
      setCurrentTime(0)
      audio.load()
    }
  }, [audioUrl])

  // Sync volume smoothly without interrupting playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      try {
        setHasError(false)
        setIsLoading(true)
        await audio.play()
      } catch (err) {
        console.error('Playback error:', err)
        setHasError(true)
        setIsPlaying(false)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime)
      if (!loadedDuration && audioRef.current.duration) {
        setLoadedDuration(audioRef.current.duration)
      }
    }
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
  }

  const handleSeekStart = () => {
    setIsSeeking(true)
  }

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsSeeking(false)
    const target = e.currentTarget as HTMLInputElement
    const newTime = parseFloat(target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (audioRef.current) {
      audioRef.current.volume = newVol
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume
    }
  }

  const skipForward = (secs: number) => {
    if (audioRef.current) {
      const nextTime = Math.min(audioRef.current.currentTime + secs, effectiveDuration)
      audioRef.current.currentTime = nextTime
      setCurrentTime(nextTime)
    }
  }

  const skipBackward = (secs: number) => {
    if (audioRef.current) {
      const prevTime = Math.max(audioRef.current.currentTime - secs, 0)
      audioRef.current.currentTime = prevTime
      setCurrentTime(prevTime)
    }
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 shadow-2xl">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        onPlay={() => {
          setIsPlaying(true)
          setIsLoading(false)
        }}
        onPlaying={() => {
          setIsPlaying(true)
          setIsLoading(false)
        }}
        onPause={() => {
          setIsPlaying(false)
          setIsLoading(false)
        }}
        onWaiting={() => {
          setIsLoading(true)
        }}
        onCanPlay={() => {
          setIsLoading(false)
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
        }}
        onError={(e) => {
          const mediaError = audioRef.current?.error
          console.error('Audio element playback error:', mediaError?.code, mediaError?.message, e)
          setHasError(true)
          setIsPlaying(false)
          setIsLoading(false)
        }}
        onLoadedMetadata={(e) => {
          const dur = e.currentTarget.duration
          if (dur && !isNaN(dur) && isFinite(dur)) {
            setLoadedDuration(dur)
          }
        }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Track quick info */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {coverUrl ? (
              <img src={coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">🎵</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {title || 'Без названия'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {artist || 'Неизвестный исполнитель'}
            </p>
            {hasError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                Ошибка загрузки аудиопотока
              </p>
            )}
          </div>
        </div>

        {/* Playback Controls & Progress bar */}
        <div className="flex flex-col items-center gap-2 w-full sm:w-2/4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => skipBackward(5)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              title="Назад на 5 секунд"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              disabled={hasError}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                hasError
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/25'
              }`}
              title={isPlaying ? 'Пауза' : 'Слушать'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skipForward(5)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              title="Вперед на 5 секунд"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
              {formatDuration(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={effectiveDuration || 100}
              step={0.1}
              value={currentTime}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />

            <span className="text-[11px] font-mono text-slate-400 w-10">
              {formatDuration(effectiveDuration)}
            </span>
          </div>
        </div>

        {/* Volume controls */}
        <div className="hidden sm:flex items-center justify-end gap-2 w-1/4">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}
