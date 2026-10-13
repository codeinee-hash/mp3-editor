import React from 'react'
import { Header } from './components/Header/Header'
import { Dropzone } from './components/Dropzone/Dropzone'
import { CoverArtEditor } from './components/CoverArtEditor/CoverArtEditor'
import { TagForm } from './components/TagForm/TagForm'
import { TrackQueue } from './components/TrackQueue/TrackQueue'
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer'
import { ActionBar } from './components/ActionBar/ActionBar'
import { useMp3Editor } from './hooks/useMp3Editor'
import { AlertCircle, CheckCircle, Info, Sparkles, SlidersHorizontal, ShieldCheck, Zap } from 'lucide-react'

export const App: React.FC = () => {
  const {
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
  } = useMp3Editor()

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans pb-28">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                : notification.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-500/40'
                : 'bg-slate-900/90 text-slate-200 border-slate-700'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tracks.length === 0 ? (
          /* Empty / Upload State */
          <div className="max-w-3xl mx-auto space-y-8 py-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Быстрый редактор ID3v2 тегов
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Редактируйте теги и обложки <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MP3 прямо в браузере</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                Загрузите один или несколько MP3 файлов, измените название, исполнителя, альбом и обложку, затем скачайте обновленные треки без потери качества звука.
              </p>
            </div>

            {/* Hero Dropzone */}
            <Dropzone onFilesSelected={addFiles} isLoading={isProcessing} />

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Все популярные теги</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Название, артист, альбом, год, жанр, номер трека, диск и комментарий.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">100% Локально</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Файлы не загружаются на сервер. Вся обработка происходит прямо в вашем браузере.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Мгновенный Lossless экспорт</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Звуковой поток не перекодируется — оригинальное аудиокачество сохраняется 1:1.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Editor State (Files loaded) */
          <div className="space-y-6">
            {/* Top Action & Technical info Bar */}
            <ActionBar
              activeTrack={activeTrack}
              totalTracks={tracks.length}
              onDownloadCurrent={downloadActiveTrack}
              onDownloadAll={downloadAllTracks}
              isDownloading={isDownloading}
              isDownloadingAll={isDownloadingAll}
            />

            {/* Layout: Sidebar Queue + Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Track Queue */}
              <div className="lg:col-span-4 xl:col-span-3">
                <TrackQueue
                  tracks={tracks}
                  activeTrackId={activeTrackId}
                  onSelectTrack={setActiveTrackId}
                  onRemoveTrack={removeTrack}
                  onAddFiles={addFiles}
                  onClearAll={clearAll}
                />
              </div>

              {/* Center / Right Column: Active Track Editor */}
              {activeTrack ? (
                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Cover Art Column */}
                    <div className="md:col-span-5 xl:col-span-4">
                      <CoverArtEditor
                        currentCover={activeTrack.currentCover}
                        originalCover={activeTrack.originalCover}
                        onCoverChange={updateActiveCover}
                        disabled={isDownloading}
                      />
                    </div>

                    {/* Metadata Tag Fields */}
                    <div className="md:col-span-7 xl:col-span-8">
                      <TagForm
                        tags={activeTrack.currentTags}
                        originalTags={activeTrack.originalTags}
                        onChange={updateActiveTags}
                        disabled={isDownloading}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-8 xl:col-span-9 bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                  Выберите трек из списка слева для редактирования
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Persistent Docked Audio Player (at bottom of screen when track is active) */}
      {activeTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-black via-slate-950 to-transparent pointer-events-none">
          <div className="max-w-5xl mx-auto pointer-events-auto">
            <AudioPlayer
              key={activeTrack.id}
              audioUrl={activeTrack.audioUrl}
              title={activeTrack.currentTags.title || activeTrack.formatInfo.fileName}
              artist={activeTrack.currentTags.artist}
              coverUrl={activeTrack.currentCover?.previewUrl}
              totalDuration={activeTrack.formatInfo.duration}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
