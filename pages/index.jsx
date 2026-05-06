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
    <div className="min-h-screen bg-black text-slate-100 relative font-sans">
      {/* Cuadrícula de fondo estilo gráfico de trading */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 z-10">
        <header className="flex items-center justify-between mb-8 px-4 py-4 bg-zinc-950/80 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="font-mono text-emerald-500 tracking-widest uppercase text-xs sm:text-sm">TRADING_DESK // SECURE_FEED</div>
          </div>
          <a href="/admin" className="font-mono uppercase tracking-wider border border-emerald-500/30 bg-black px-4 py-2 text-xs text-emerald-500 transition hover:bg-emerald-950 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">ADMIN_LOGIN</a>
        </header>

        <main className="flex-1 flex flex-col space-y-6 bg-zinc-950/90 border border-emerald-500/20 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {errorMsg || !selectedVideo ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] text-center border border-red-900/30 bg-red-950/10 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
              <h2 className="text-4xl md:text-5xl font-mono font-bold text-red-500 mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">ACCESS DENIED</h2>
              <p className="text-red-400/70 font-mono tracking-wide">CONNECTION_REFUSED: TOKEN NO VÁLIDO O AUSENTE</p>
              <div className="mt-8 px-6 py-2 border border-red-500/20 text-red-500/50 font-mono text-xs uppercase animate-pulse">Esperando enlace de autorización...</div>
            </div>
          ) : (
            <>
              <div className="border border-emerald-500/20 bg-black overflow-hidden relative group shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 h-full w-full pointer-events-none grayscale-[20%] contrast-125"
                    style={{ pointerEvents: 'auto' }}
                    src={embedUrl(selectedVideo)}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                  <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-emerald-500/10"></div>
                </div>
                {/* Marcos decorativos estilo cámara de seguridad/terminal */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500/50 pointer-events-none"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500/50 pointer-events-none"></div>
              </div>

              <div className="border border-emerald-500/20 bg-zinc-950 p-6 relative">
                <h1 className="text-2xl font-mono font-bold text-emerald-400 uppercase tracking-wide">{selectedVideo.title}</h1>
                <div className="w-12 h-1 bg-emerald-500/50 my-4"></div>
                <p className="text-slate-400 font-sans leading-relaxed">{selectedVideo.description}</p>
              </div>
            </>
          )}
          </main>
      </div>
    </div>
  );
}
