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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      // Leemos de forma nativa los parámetros de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const videoSlug = urlParams.get('video');
      const token = urlParams.get('key');

      if (!videoSlug || !token) {
        setErrorMsg('Enlace de seguridad ausente o incompleto.');
        setLoading(false);
        return;
      }

      // Consultamos la función segura en Supabase con los parámetros de la URL
      const { data, error } = await supabase
        .rpc('get_secure_video', { v_slug: videoSlug, v_token: token });

      if (error || !data || data.length === 0) {
        console.error(error);
        setErrorMsg('Acceso denegado. El token es inválido o expiró.');
        setLoading(false);
        return;
      }

      setSelectedVideo(data[0]);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const handler = (event) => event.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-slate-400">Verificando seguridad...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-12">
        <header className="flex items-center justify-between mb-6 px-2">
          <div className="font-semibold text-slate-400 tracking-wider uppercase text-sm">Plataforma de Video</div>
          <a href="/admin" className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">Acceso Admin</a>
        </header>

        <main className="flex-1 flex flex-col space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/50">
          {errorMsg || !selectedVideo ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-600 mb-4">No tienes link para entrar</h2>
              <p className="text-slate-400">Pídele al administrador que te envíe el enlace de tu clase.</p>
            </div>
          ) : (
            <>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-inner shadow-slate-950/40">
                <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    style={{ pointerEvents: 'auto' }}
                    src={embedUrl(selectedVideo)}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                  <div className="absolute inset-0 z-10 pointer-events-none"></div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <h1 className="text-3xl font-semibold text-white">{selectedVideo.title}</h1>
                <p className="mt-3 text-slate-400">{selectedVideo.description}</p>
              </div>
            </>
          )}
          </main>
      </div>
    </div>
  );
}
