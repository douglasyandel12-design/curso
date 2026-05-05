import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const embedUrl = (video) => {
  if (!video) return '';

  if (video.platform === 'vimeo') {
    return `https://player.vimeo.com/video/${video.video_id}?badge=0&autopause=0&player_id=0&app_id=58479&muted=0&transparent=0`;
  }

  return `https://www.youtube-nocookie.com/embed/${video.video_id}?rel=0&modestbranding=1&controls=1&disablekb=1&showinfo=0`;
};

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setVideos(data);
      setSelectedVideo(data[0] ?? null);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const handler = (event) => event.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 xl:px-0">
        <header className="mb-8 flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-sky-400">Video Classroom</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Clases privadas</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Solo los alumnos invitados pueden acceder. Los videos se cargan desde el panel de administración.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-4 text-right text-sm text-slate-400">Módulos: {videos.length}</div>
        </header>

        <div className="grid flex-1 gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
            <h2 className="text-lg font-semibold text-white">Módulos</h2>
            <div className="space-y-3">
              {loading && <p className="text-slate-500">Cargando módulos...</p>}
              {!loading && videos.length === 0 && <p className="text-slate-500">No hay videos disponibles.</p>}
              {videos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedVideo?.id === video.id ? 'border-sky-500 bg-slate-800' : 'border-slate-800 bg-slate-950/90 hover:border-slate-600 hover:bg-slate-900'}`}
                >
                  <p className="font-semibold text-white">{video.title}</p>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{video.description}</p>
                </button>
              ))}
            </div>
          </aside>

          <main className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            {selectedVideo ? (
              <>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-inner shadow-slate-950/40">
                  <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={embedUrl(selectedVideo)}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.title}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <h2 className="text-2xl font-semibold text-white">{selectedVideo.title}</h2>
                  <p className="mt-3 text-slate-400">{selectedVideo.description}</p>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-12 text-center text-slate-400">
                Selecciona un video de la lista para comenzar.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
