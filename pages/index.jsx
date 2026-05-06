import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    <div className="min-h-screen bg-[#050505] text-slate-100 relative font-sans overflow-hidden">
      <style>{`
        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
        .scanline { position: absolute; inset: 0; height: 8px; background: linear-gradient(to bottom, transparent, rgba(0,255,255,0.15), transparent); animation: scan 6s linear infinite; pointer-events: none; z-index: 50; }
        @keyframes scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-scroll { animation: scroll 25s linear infinite; white-space: nowrap; }
      `}</style>
      
      {/* Cuadrícula de fondo Deep-Tech */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="scanline"></div>

      {/* Ticker de información del sistema */}
      <div className="absolute top-0 left-0 w-full bg-[#0055FF]/10 border-b border-cyan-500/20 text-cyan-400 font-mono text-xs py-1 z-20 backdrop-blur-md">
        <div className="animate-scroll">
          <span className="mx-6">SYS_CORE 🔵 ONLINE</span>
          <span className="mx-6">ENCRYPTION 🔵 AES-256</span>
          <span className="mx-6">NETWORK_SEC 🔵 ACTIVE</span>
          <span className="mx-6">DATA_STREAM 🔵 ENCRYPTED</span>
          <span className="mx-6">NODE_STATUS 🔵 OPTIMAL</span>
        </div>
      </div>
      
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-12 z-10">
        <header className="flex items-center justify-between mb-8 px-6 py-4 bg-[#0055FF]/5 border border-cyan-500/20 backdrop-blur-lg rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]"></div>
            <div className="font-mono text-cyan-400 tracking-widest uppercase text-xs sm:text-sm">DEEP_TECH // SECURE_PORTAL</div>
          </div>
          <a href="/admin" className="font-mono uppercase tracking-wider rounded-lg border border-cyan-500/30 bg-[#050505] px-4 py-2 text-xs text-cyan-400 transition-all duration-300 hover:bg-cyan-500 hover:text-[#050505] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]">ADMIN_LOGIN</a>
        </header>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">SISTEMA DE ACCESO A VIDEO PROTEGIDO</h1>
          <p className="mt-3 text-sm text-cyan-100/60 font-light">La seguridad de tus contenidos es nuestra prioridad. Tu curso está a un paso.</p>
        </div>

        <main className="flex-1 flex flex-col space-y-6 bg-[#0055FF]/5 border border-cyan-500/20 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          {errorMsg || !selectedVideo ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-[40vh] text-center border border-cyan-500/30 bg-[#0055FF]/10 p-10 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.05)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.8)]"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-4 tracking-wide drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">[PROTECCIÓN DEL CURSO ACTIVADA]</h2>
              <p className="text-cyan-100/70 font-light mb-8 max-w-md">El acceso está restringido. Utiliza el <span className="text-cyan-400 font-medium">Enlace de Acceso Único</span> proporcionado por el administrador para desbloquear tu contenido.</p>
              <div className="px-8 py-3 rounded-lg border border-cyan-500/40 bg-[#050505] text-cyan-500/60 font-mono text-xs uppercase animate-pulse shadow-[inset_0_0_15px_rgba(0,255,255,0.1)]">Esperando autenticación segura...</div>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-cyan-500/30 bg-[#050505] overflow-hidden relative group transition-all duration-500 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.25)]">
                <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                  <video
                    className="absolute inset-0 h-full w-full object-contain bg-[#050505]"
                    src={selectedVideo.video_url}
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-[#0055FF]/5 backdrop-blur-md p-6 relative">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">{selectedVideo.title}</h2>
                  <div className="text-right hidden sm:block">
                    <p className="font-mono text-xs text-cyan-500/50">SECURE_ID: {selectedVideo.id.split('-')[0]}</p>
                    <p className="font-mono text-xs text-cyan-500/50">ENCRYPTION: AES-256</p>
                  </div>
                </div>
                <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent my-4"></div>
                <p className="text-slate-300 font-light leading-relaxed">{selectedVideo.description}</p>
              </div>
            </>
          )}
          </main>
      </div>
    </div>
  );
}
