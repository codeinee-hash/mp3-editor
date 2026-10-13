import React from 'react'
import { Music, X, CheckCircle2, Clock } from 'lucide-react'
import type { TrackItem } from '../../types/tags'
import { formatBytes, formatDuration } from '../../utils/formatters'
import { Dropzone } from '../Dropzone/Dropzone'

interface TrackQueueProps {
  tracks: TrackItem[]
  activeTrackId: string | null
  onSelectTrack: (trackId: string) => void
  onRemoveTrack: (trackId: string) => void
  onAddFiles: (files: File[]) => void
  onClearAll: () => void
}

export const TrackQueue: React.FC<TrackQueueProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  onRemoveTrack,
  onAddFiles,
  onClearAll,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Список файлов</h3>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-medium">
            {tracks.length}
          </span>
        </div>

        {tracks.length > 1 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
          >
            Очистить все
          </button>
        )}
      </div>

      {/* Track list items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
        {tracks.map((track) => {
          const isActive = track.id === activeTrackId
          const displayTitle = track.currentTags.title || track.formatInfo.fileName
          const displayArtist = track.currentTags.artist || 'Неизвестный исполнитель'

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`group relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/15 border-indigo-500/60 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/40 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Cover thumbnail */}
              <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-700/50">
                {track.currentCover ? (
                  <img
                    src={track.currentCover.previewUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">🎵</span>
                )}
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-medium truncate ${
                    isActive ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {displayTitle}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span className="truncate max-w-[120px]">{displayArtist}</span>
                  <span>•</span>
                  <span>{formatDuration(track.formatInfo.duration)}</span>
                  <span>•</span>
                  <span>{formatBytes(track.formatInfo.fileSize)}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {track.status === 'saved' ? (
                  <span title="Сохранено" className="text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                ) : track.isModified ? (
                  <span
                    title="Есть несохраненные изменения"
                    className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
                  />
                ) : null}

                {track.status === 'saving' && (
                  <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveTrack(track.id)
                  }}
                  className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Удалить из списка"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add more button */}
      <div className="pt-3 mt-2 border-t border-slate-800">
        <Dropzone onFilesSelected={onAddFiles} isCompact />
      </div>
    </div>
  )
}
