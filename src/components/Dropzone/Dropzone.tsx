import React, { useRef, useState } from 'react'
import { UploadCloud, FileAudio, Plus } from 'lucide-react'

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  isCompact?: boolean
  isLoading?: boolean
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  isCompact = false,
  isLoading = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.name.toLowerCase().endsWith('.mp3') || f.type.includes('audio')
      )
      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files)
      onFilesSelected(validFiles)
      e.target.value = '' // reset input
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  if (isCompact) {
    return (
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-3 flex items-center justify-center gap-2 transition-all duration-200 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
            : 'border-slate-700/80 hover:border-slate-500 bg-slate-800/30 text-slate-400 hover:text-slate-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/mpeg,.mp3"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isLoading}
        />
        <Plus className="w-4 h-4" />
        <span className="text-xs font-medium">Добавить ещё MP3 файлы</span>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 md:p-14 text-center transition-all duration-300 group overflow-hidden ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/10'
          : 'border-slate-700 bg-slate-900/40 hover:border-indigo-500/60 hover:bg-slate-900/60'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,.mp3"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isDragOver
              ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/30'
              : 'bg-slate-800 text-indigo-400 border border-slate-700'
          }`}
        >
          {isDragOver ? (
            <FileAudio className="w-10 h-10 animate-bounce" />
          ) : (
            <UploadCloud className="w-10 h-10 group-hover:text-indigo-300 transition-colors" />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold text-white">
            Перетащите сюда ваши <span className="text-indigo-400">MP3 файлы</span>
          </p>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            или нажмите в любую область для выбора файлов на компьютере
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/60">
            Поддерживаются .mp3
          </span>
          <span className="text-xs bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/60">
            Пакетная загрузка
          </span>
          <span className="text-xs bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/60">
            ID3v1, ID3v2.3, ID3v2.4
          </span>
        </div>
      </div>
    </div>
  )
}
