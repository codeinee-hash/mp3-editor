import React from 'react'
import {
  Tag,
  User,
  Disc,
  Calendar,
  Layers,
  Music2,
  Hash,
  MessageSquare,
  RotateCcw,
  Eraser,
} from 'lucide-react'
import type { Mp3Tags } from '../../types/tags'

interface TagFormProps {
  tags: Mp3Tags
  originalTags: Mp3Tags
  onChange: (updatedTags: Mp3Tags) => void
  disabled?: boolean
}

const COMMON_GENRES = [
  'Pop',
  'Rock',
  'Hip-Hop',
  'Electronic',
  'Dance',
  'R&B',
  'Soul',
  'Jazz',
  'Classical',
  'Metal',
  'Indie',
  'Alternative',
  'Acoustic',
  'Blues',
  'Folk',
  'Country',
  'Reggae',
  'Soundtrack',
  'Ambient',
  'Lo-Fi',
  'Synthwave',
]

export const TagForm: React.FC<TagFormProps> = ({
  tags,
  originalTags,
  onChange,
  disabled = false,
}) => {
  const handleFieldChange = (field: keyof Mp3Tags, value: string) => {
    onChange({
      ...tags,
      [field]: value,
    })
  }

  const handleResetToOriginal = () => {
    onChange({ ...originalTags })
  }

  const handleClearAll = () => {
    onChange({
      title: '',
      artist: '',
      album: '',
      year: '',
      genre: '',
      trackNumber: '',
      discNumber: '',
      composer: '',
      comment: '',
    })
  }

  const isFieldModified = (field: keyof Mp3Tags) => {
    return tags[field] !== originalTags[field]
  }

  const hasAnyModifications = Object.keys(tags).some(
    (key) => tags[key as keyof Mp3Tags] !== originalTags[key as keyof Mp3Tags]
  )

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-400" />
            Метаданные трека
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Редактируйте стандартные ID3v2.3 теги аудиофайла
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasAnyModifications && (
            <button
              type="button"
              onClick={handleResetToOriginal}
              disabled={disabled}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
              title="Вернуть исходные значения"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Сбросить</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-red-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            title="Очистить все поля"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Очистить</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-indigo-400" />
              Название трека (Title)
            </span>
            {isFieldModified('title') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <input
            type="text"
            value={tags.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            disabled={disabled}
            placeholder="например, Bohemian Rhapsody"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
              isFieldModified('title')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Artist */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Исполнитель (Artist)
            </span>
            {isFieldModified('artist') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <input
            type="text"
            value={tags.artist}
            onChange={(e) => handleFieldChange('artist', e.target.value)}
            disabled={disabled}
            placeholder="например, Queen"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
              isFieldModified('artist')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Album */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-indigo-400" />
              Альбом (Album)
            </span>
            {isFieldModified('album') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <input
            type="text"
            value={tags.album}
            onChange={(e) => handleFieldChange('album', e.target.value)}
            disabled={disabled}
            placeholder="например, A Night at the Opera"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
              isFieldModified('album')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Year */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Год выпуска (Year)
            </span>
            {isFieldModified('year') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <input
            type="text"
            maxLength={4}
            value={tags.year}
            onChange={(e) => handleFieldChange('year', e.target.value)}
            disabled={disabled}
            placeholder="например, 1975"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
              isFieldModified('year')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Genre */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Жанр (Genre)
            </span>
            {isFieldModified('genre') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <input
            type="text"
            list="genres-list"
            value={tags.genre}
            onChange={(e) => handleFieldChange('genre', e.target.value)}
            disabled={disabled}
            placeholder="например, Rock"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
              isFieldModified('genre')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
          <datalist id="genres-list">
            {COMMON_GENRES.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>

        {/* Track Number & Disc Number */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                Трек №
              </span>
              {isFieldModified('trackNumber') && (
                <span className="text-[10px] text-amber-400">изм.</span>
              )}
            </label>
            <input
              type="text"
              value={tags.trackNumber}
              onChange={(e) => handleFieldChange('trackNumber', e.target.value)}
              disabled={disabled}
              placeholder="1/12"
              className={`w-full px-3 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
                isFieldModified('trackNumber')
                  ? 'border-amber-500/50 focus:border-amber-500'
                  : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Disc className="w-3.5 h-3.5 text-indigo-400" />
                Диск №
              </span>
              {isFieldModified('discNumber') && (
                <span className="text-[10px] text-amber-400">изм.</span>
              )}
            </label>
            <input
              type="text"
              value={tags.discNumber}
              onChange={(e) => handleFieldChange('discNumber', e.target.value)}
              disabled={disabled}
              placeholder="1/1"
              className={`w-full px-3 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
                isFieldModified('discNumber')
                  ? 'border-amber-500/50 focus:border-amber-500'
                  : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        {/* Composer */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Композитор (Composer)
            </span>
            {isFieldModified('composer') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <input
            type="text"
            value={tags.composer}
            onChange={(e) => handleFieldChange('composer', e.target.value)}
            disabled={disabled}
            placeholder="например, Freddie Mercury"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
              isFieldModified('composer')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Comment */}
        <div className="md:col-span-2">
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Комментарий (Comment)
            </span>
            {isFieldModified('comment') && (
              <span className="text-[10px] text-amber-400">изменено</span>
            )}
          </label>
          <textarea
            rows={2}
            value={tags.comment}
            onChange={(e) => handleFieldChange('comment', e.target.value)}
            disabled={disabled}
            placeholder="Дополнительные примечания или ссылка"
            className={`w-full px-3.5 py-2.5 bg-slate-950/70 text-sm text-white placeholder-slate-500 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none transition-all ${
              isFieldModified('comment')
                ? 'border-amber-500/50 focus:border-amber-500'
                : 'border-slate-800 focus:border-indigo-500'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
