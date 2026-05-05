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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/50">
      <h2 className="text-2xl font-semibold text-slate-100">Panel Admin: Agrega un video</h2>
      <p className="mt-2 text-sm text-slate-400">Pega el ID o enlace de Vimeo/YouTube, pon un título y descripción. Guarda para que el alumno lo vea.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Título
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
              placeholder="Nombre del módulo"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Plataforma
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            >
              <option value="vimeo">Vimeo</option>
              <option value="youtube">YouTube</option>
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-300">
          Identificador para la URL (slug)
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            placeholder="ej: introduccion-modulo-1"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          ID o URL del video
          <input
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            placeholder="https://vimeo.com/123456789"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          Descripción
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            placeholder="Breve resumen del módulo"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Orden de módulo
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
              min="1"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Guardar video
          </button>
          <span className="text-sm text-slate-400">{status}</span>
        </div>
      </form>
      </div>

      <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/50">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Enlaces Generados</h2>
        <div className="space-y-3">
          {generatedLinks.length === 0 && <p className="text-slate-400 text-sm">Aún no hay videos guardados.</p>}
          {generatedLinks.map((link) => {
            const url = `${window.location.origin}/?video=${link.slug}&key=${link.access_token}`;
            return (
              <div key={link.slug} className="p-4 rounded-xl border border-slate-800 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-200">{link.title}</p>
                  <p className="text-xs text-sky-400 mt-1 select-all">{url}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition"
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
