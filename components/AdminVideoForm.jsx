import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminVideoForm() {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !slug || !file) {
      setStatus('Completa título, slug y selecciona un archivo de video.');
      return;
    }

    setUploading(true);
    setStatus('Subiendo video... Por favor espera.');

    // 1. Subir archivo a Supabase Storage
    const fileExt = file.name.split('.').pop();
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileName = `${safeSlug}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('course_videos')
      .upload(fileName, file);

    if (uploadError) {
      setStatus(`Error subiendo: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    // 2. Obtener URL pública segura
    const { data: { publicUrl } } = supabase.storage
      .from('course_videos')
      .getPublicUrl(fileName);

    // 3. Guardar en Base de Datos
    const { error } = await supabase.from('videos').insert([{
      slug: safeSlug,
      title,
      description,
      video_url: publicUrl
    }]);

    if (error) {
      setStatus(`Error: ${error.message}`);
      setUploading(false);
      return;
    }

    setSlug('');
    setTitle('');
    setDescription('');
    setFile(null);
    setUploading(false);
    setStatus('Video guardado correctamente.');
    fetchLinks();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div className="rounded-2xl border border-cyan-500/30 bg-[#0055FF]/5 p-8 shadow-[0_0_40px_rgba(0,255,255,0.05)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-3"><div className="w-3 h-3 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-pulse"></div>SYSTEM_ADMIN // UPLOAD</h2>
          <p className="mt-2 text-xs text-slate-400 font-mono">INGRESA LOS DATOS DEL ENLACE PARA GENERAR UN ACCESO CIFRADO.</p>
        </div>
        <div className="hidden sm:block text-right font-mono text-xs text-cyan-500/50 border border-cyan-500/20 p-2 bg-[#050505] rounded-md">DB_CONN: OK<br/>LATENCY: 12ms</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-mono tracking-wider text-cyan-500/80 uppercase">
            Título del Módulo
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-cyan-500/30 bg-[#050505] px-4 py-3 text-cyan-100 outline-none transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              placeholder="Nombre del módulo"
            />
          </label>
        </div>

        <label className="space-y-2 text-xs font-mono tracking-wider text-cyan-500/80 uppercase">
          Identificador para la URL (slug)
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/30 bg-[#050505] px-4 py-3 text-cyan-100 outline-none transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            placeholder="ej: introduccion-modulo-1"
          />
        </label>

        <label className="space-y-2 text-xs font-mono tracking-wider text-cyan-500/80 uppercase">
          Archivo de Video (MP4)
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full rounded-lg border border-cyan-500/30 bg-[#050505] px-4 py-3 text-cyan-100 outline-none transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/40 cursor-pointer"
          />
        </label>

        <label className="space-y-2 text-xs font-mono tracking-wider text-cyan-500/80 uppercase">
          Descripción
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full rounded-lg border border-cyan-500/30 bg-[#050505] px-4 py-3 text-cyan-100 outline-none transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] font-sans"
            placeholder="Breve resumen del módulo"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={uploading} className="rounded-lg font-bold tracking-widest inline-flex items-center justify-center bg-cyan-500/10 border border-cyan-500 px-8 py-4 text-sm text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-[#050505] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] disabled:opacity-50">
            ENCRIPTAR & GUARDAR
          </button>
          <span className="text-sm font-mono text-cyan-400/70 uppercase">{status}</span>
        </div>
      </form>
      </div>

      <div className="rounded-2xl border border-cyan-500/30 bg-[#0055FF]/5 p-8 shadow-[0_0_40px_rgba(0,255,255,0.05)] backdrop-blur-xl">
        <h2 className="text-xl font-mono font-bold text-cyan-400 mb-6 uppercase tracking-wider">ENLACES_GENERADOS // DB_RECORDS</h2>
        <div className="space-y-3">
          {generatedLinks.length === 0 && <p className="text-cyan-500/50 text-sm font-mono uppercase">Aún no hay registros en la base de datos.</p>}
          {generatedLinks.map((link) => {
            const url = `${window.location.origin}/?video=${link.slug}&key=${link.access_token}`;
            return (
              <div key={link.slug} className="p-4 rounded-xl border border-cyan-500/20 bg-[#050505] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300">
                <div>
                  <p className="font-bold text-cyan-100 font-mono text-sm uppercase">{link.title}</p>
                  <p className="text-xs font-mono text-cyan-500 mt-2 select-all break-all">{url}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="shrink-0 rounded-lg font-bold tracking-widest border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-400 hover:bg-cyan-400 hover:text-[#050505] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-300 uppercase"
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
