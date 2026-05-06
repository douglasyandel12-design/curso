import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminVideoForm from '../components/AdminVideoForm';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('admin@micurso.com');
  const [password, setPassword] = useState('1979correoCurso');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Revisamos si el admin ya tiene la sesión iniciada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginError(error.message);
        console.error("Error de Supabase:", error);
      }
    } catch (err) {
      setLoginError(err.message || 'Error de red inesperado al conectar.');
    } finally {
    setLoading(false);
    }
  };

  // Si no ha iniciado sesión, mostramos el login
  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <style>{`
          @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
          .scanline { position: absolute; inset: 0; height: 8px; background: linear-gradient(to bottom, transparent, rgba(0,255,255,0.2), transparent); animation: scan 3s linear infinite; pointer-events: none; z-index: 50; }
          @keyframes scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
          .animate-scroll { animation: scroll 20s linear infinite; white-space: nowrap; }
        `}</style>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="scanline"></div>

        <div className="absolute top-0 left-0 w-full bg-[#0055FF]/10 border-b border-cyan-500/20 text-cyan-400 font-mono text-xs py-1 z-20 backdrop-blur-md">
          <div className="animate-scroll">
            <span className="mx-6">SYS_CORE 🔵 ONLINE</span>
            <span className="mx-6">ENCRYPTION 🔵 AES-256</span>
            <span className="mx-6">NETWORK_SEC 🔵 ACTIVE</span>
            <span className="mx-6">AUTH_SERVER 🔵 STANDBY</span>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="relative bg-[#0055FF]/5 backdrop-blur-xl p-10 rounded-2xl border border-cyan-500/30 space-y-6 w-full max-w-md shadow-[0_0_40px_rgba(0,255,255,0.1)] z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">[ ACCESO RESTRINGIDO ]</h2>
            <p className="text-sm text-cyan-100/60 mt-2 font-light">Ingresa tu Clave de Acceso Única</p>
          </div>

          {loginError && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-center animate-pulse">
              <p className="text-red-400 font-mono text-xs uppercase tracking-wider">ERROR: {loginError}</p>
            </div>
          )}

          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg font-mono bg-[#050505] border border-cyan-500/30 p-4 text-cyan-300 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg font-mono bg-[#050505] border border-cyan-500/30 p-4 text-cyan-300 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all" required />
          <button type="submit" disabled={loading} className="w-full rounded-lg font-bold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-400 hover:text-[#050505] p-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]">
            {loading ? 'VERIFICANDO...' : 'DESBLOQUEAR SISTEMA'}
          </button>
        </form>
      </div>
    );
  }

  // Si ya inició sesión, mostramos el formulario de videos
  return (
    <div className="min-h-screen bg-[#050505] py-16 px-4 font-sans relative overflow-hidden">
      <style>{`
        @keyframes scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-scroll { animation: scroll 20s linear infinite; white-space: nowrap; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="absolute top-0 left-0 w-full bg-[#0055FF]/10 border-b border-cyan-500/20 text-cyan-400 font-mono text-xs py-1 z-20 backdrop-blur-md">
        <div className="animate-scroll">
          <span className="mx-6">LOGGED IN AS ADMIN</span>
          <span className="mx-6">ENCRYPTION 🔵 ACTIVE</span>
          <span className="mx-6">SERVER_PING 🔵 12ms</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 relative z-10">
        <div className="font-mono text-cyan-500 text-xs">STATUS: <span className="text-cyan-300">AUTHORIZED</span></div>
        <button onClick={() => supabase.auth.signOut()} className="rounded-lg font-mono text-xs text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all px-4 py-2 border border-cyan-500/30 uppercase tracking-widest">Bloquear Sesión</button>
      </div>
      <AdminVideoForm />
    </div>
  );
}