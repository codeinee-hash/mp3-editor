import React, { useRef, useState } from 'react'
import { Image as ImageIcon, Upload, Trash2, RotateCcw, Sparkles } from 'lucide-react'
import type { CoverArtData } from '../../types/tags'
import { processImageFile } from '../../services/id3Reader'
import { formatBytes } from '../../utils/formatters'

interface CoverArtEditorProps {
  currentCover: CoverArtData | null
  originalCover: CoverArtData | null
  onCoverChange: (newCover: CoverArtData | null) => void
  disabled?: boolean
}

export const CoverArtEditor: React.FC<CoverArtEditorProps> = ({
  currentCover,
  originalCover,
  onCoverChange,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        const coverData = await processImageFile(file)
        onCoverChange(coverData)
      }
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        const coverData = await processImageFile(file)
        onCoverChange(coverData)
      }
      e.target.value = ''
    }
  }

  const handleRemoveCover = () => {
    onCoverChange(null)
  }

  const handleRestoreOriginal = () => {
    onCoverChange(originalCover)
  }

  const isCoverDifferent =
    (currentCover && !originalCover) ||
    (!currentCover && originalCover) ||
    (currentCover && originalCover && currentCover.previewUrl !== originalCover.previewUrl)

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          Обложка альбома
        </span>
        {isCoverDifferent && (
          <span className="text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            Изменено
          </span>
        )}
      </div>

      {/* Cover image preview box */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden cursor-pointer group border-2 transition-all duration-300 shadow-xl flex items-center justify-center ${
          isDragOver
            ? 'border-indigo-400 ring-4 ring-indigo-500/20 scale-102 bg-indigo-950/40'
            : currentCover
            ? 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-950'
            : 'border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {currentCover ? (
          <>
            <img
              src={currentCover.previewUrl}
              alt="Album Cover"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center backdrop-blur-xs">
              <Upload className="w-8 h-8 text-white mb-2" />
              <p className="text-xs font-semibold text-white">Нажмите или перетащите для замены</p>
              <p className="text-[10px] text-slate-300 mt-1">JPG, PNG, WEBP</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200 mb-3 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-slate-300">Нет обложки</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Нажмите или перетащите изображение сюда
            </p>
          </div>
        )}
      </div>

      {/* Info & Action Buttons */}
      <div className="w-full mt-4 space-y-2">
        {currentCover && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Формат: {currentCover.mimeType.replace('image/', '').toUpperCase()}</span>
            <span>Размер: {formatBytes(currentCover.sizeBytes)}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            {currentCover ? 'Заменить' : 'Загрузить'}
          </button>

          {currentCover ? (
            <button
              type="button"
              onClick={handleRemoveCover}
              disabled={disabled}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Удалить
            </button>
          ) : originalCover ? (
            <button
              type="button"
              onClick={handleRestoreOriginal}
              disabled={disabled}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              Вернуть
            </button>
          ) : null}
        </div>

        {isCoverDifferent && originalCover && currentCover && (
          <button
            type="button"
            onClick={handleRestoreOriginal}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            Восстановить исходную обложку
          </button>
        )}
      </div>
    </div>
  )
}
