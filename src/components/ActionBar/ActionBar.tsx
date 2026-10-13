import React from 'react'
import { Download, Loader2, Sparkles, FolderDown } from 'lucide-react'
import type { AudioFormatInfo, TrackItem } from '../../types/tags'
import { formatBitrate, formatBytes, formatDuration } from '../../utils/formatters'

interface ActionBarProps {
  activeTrack: TrackItem | null
  totalTracks: number
  onDownloadCurrent: () => void
  onDownloadAll?: () => void
  isDownloading: boolean
  isDownloadingAll?: boolean
}

export const ActionBar: React.FC<ActionBarProps> = ({
  activeTrack,
  totalTracks,
  onDownloadCurrent,
  onDownloadAll,
  isDownloading,
  isDownloadingAll = false,
}) => {
  if (!activeTrack) return null

  const format: AudioFormatInfo = activeTrack.formatInfo

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      {/* File Technical Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="font-mono text-slate-300 font-medium truncate max-w-[200px]" title={format.fileName}>
          {format.fileName}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-700" />
        <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
          {formatBytes(format.fileSize)}
        </span>
        {format.duration && (
          <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
            {formatDuration(format.duration)}
          </span>
        )}
        {format.bitrate && (
          <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
            {formatBitrate(format.bitrate)}
          </span>
        )}
        {format.sampleRate && (
          <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
            {Math.round(format.sampleRate / 1000)} kHz
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {totalTracks > 1 && onDownloadAll && (
          <button
            type="button"
            onClick={onDownloadAll}
            disabled={isDownloading || isDownloadingAll}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all duration-200 disabled:opacity-50"
          >
            {isDownloadingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Сохранение всех...</span>
              </>
            ) : (
              <>
                <FolderDown className="w-4 h-4 text-slate-400" />
                <span>Скачать все ({totalTracks})</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onDownloadCurrent}
          disabled={isDownloading}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform active:scale-95 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Формирование файла...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Скачать обновленный MP3</span>
              {activeTrack.isModified && <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
