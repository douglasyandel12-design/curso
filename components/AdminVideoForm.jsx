import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminVideoForm() {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoId, setVideoId] = useState('');
  const [platform, setPlatform] = useState('vimeo');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [status, setStatus] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState([]);

  useEffect(() => {
    const handler = (event) => event.preventDefault();
    document.addEventListener('contextmenu', handler);
    fetchLinks();
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  const fetchLinks = async () => {
    const { data } = await supabase
      .from('videos')
      .select('title, slug, access_token')
      .order('created_at', { ascending: false });
    if (data) setGeneratedLinks(data);
  };

  const extractId = (value) => {
    if (platform === 'vimeo') {
      const match = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : value.trim();
    }

    if (platform === 'youtube') {
      const youtubeMatch = value.match(/[?&]v=([^&]+)/);
      if (youtubeMatch) return youtubeMatch[1];
      const shortMatch = value.match(/youtu\.be\/(.+)/);
      return shortMatch ? shortMatch[1] : value.trim();
    }

    return value.trim();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanedId = extractId(videoId);

    if (!title || !cleanedId || !slug) {
      setStatus('Completa título, slug y video ID.');
      return;
    }

    setStatus('Guardando...');

    const { data, error } = await supabase.from('videos').insert([{
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      title,
      description,
      video_id: cleanedId,
      platform,
      display_order: displayOrder,
    }]).select();

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }

    setSlug('');
    setTitle('');
    setDescription('');
    setVideoId('');
    setDisplayOrder((prev) => prev + 1);
    setStatus('Video guardado correctamente.');
    fetchLinks();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div className="border border-emerald-500/30 bg-zinc-950/90 p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-mono font-bold text-emerald-400 tracking-wider flex items-center gap-3"><div className="w-3 h-3 bg-emerald-500 rounded-sm animate-pulse"></div>SYSTEM_ADMIN // MODULE_UPLOAD</h2>
          <p className="mt-2 text-xs text-slate-400 font-mono">INGRESA LOS DATOS DEL ENLACE PARA GENERAR UN ACCESO CIFRADO.</p>
        </div>
        <div className="hidden sm:block text-right font-mono text-xs text-emerald-500/50 border border-emerald-500/20 p-2 bg-black">DB_CONN: OK<br/>LATENCY: 12ms</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-mono tracking-wider text-emerald-500/80 uppercase">
            Título del Módulo
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-emerald-500/30 bg-black px-4 py-3 text-emerald-100 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              placeholder="Nombre del módulo"
            />
          </label>

          <label className="space-y-2 text-xs font-mono tracking-wider text-emerald-500/80 uppercase">
            Plataforma
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-emerald-500/30 bg-black px-4 py-3 text-emerald-100 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            >
              <option value="vimeo">Vimeo</option>
              <option value="youtube">YouTube</option>
            </select>
          </label>
        </div>

        <label className="space-y-2 text-xs font-mono tracking-wider text-emerald-500/80 uppercase">
          Identificador para la URL (slug)
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-emerald-500/30 bg-black px-4 py-3 text-emerald-100 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            placeholder="ej: introduccion-modulo-1"
          />
        </label>

        <label className="space-y-2 text-xs font-mono tracking-wider text-emerald-500/80 uppercase">
          ID o URL del video
          <input
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full border border-emerald-500/30 bg-black px-4 py-3 text-emerald-100 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            placeholder="https://vimeo.com/123456789"
          />
        </label>

        <label className="space-y-2 text-xs font-mono tracking-wider text-emerald-500/80 uppercase">
          Descripción
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full border border-emerald-500/30 bg-black px-4 py-3 text-emerald-100 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] font-sans"
            placeholder="Breve resumen del módulo"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-mono tracking-wider text-emerald-500/80 uppercase">
            Orden de módulo
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full border border-emerald-500/30 bg-black px-4 py-3 text-emerald-100 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              min="1"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="font-mono tracking-widest inline-flex items-center justify-center bg-emerald-500/10 border border-emerald-500 px-8 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            ENCRIPTAR & GUARDAR
          </button>
          <span className="text-sm font-mono text-emerald-400/70 uppercase">{status}</span>
        </div>
      </form>
      </div>

      <div className="border border-emerald-500/30 bg-zinc-950/90 p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-xl">
        <h2 className="text-xl font-mono font-bold text-emerald-400 mb-6 uppercase tracking-wider">ENLACES_GENERADOS // DB_RECORDS</h2>
        <div className="space-y-3">
          {generatedLinks.length === 0 && <p className="text-emerald-500/50 text-sm font-mono uppercase">Aún no hay registros en la base de datos.</p>}
          {generatedLinks.map((link) => {
            const url = `${window.location.origin}/?video=${link.slug}&key=${link.access_token}`;
            return (
              <div key={link.slug} className="p-4 border border-emerald-500/20 bg-black flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/50 transition-colors">
                <div>
                  <p className="font-bold text-emerald-100 font-mono text-sm uppercase">{link.title}</p>
                  <p className="text-xs font-mono text-emerald-500 mt-2 select-all break-all">{url}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="shrink-0 font-mono tracking-widest border border-emerald-500/40 bg-emerald-500/5 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500 hover:text-black transition uppercase"
                >
                  Copiar Enlace
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
