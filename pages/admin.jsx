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
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <style>{`
          @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
          .scanline { position: absolute; inset: 0; height: 8px; background: linear-gradient(to bottom, transparent, rgba(16,185,129,0.4), transparent); animation: scan 3s linear infinite; pointer-events: none; z-index: 50; }
          @keyframes scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
          .animate-scroll { animation: scroll 20s linear infinite; white-space: nowrap; }
        `}</style>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="scanline"></div>

        <div className="absolute top-0 left-0 w-full bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-500 font-mono text-xs py-1 z-20">
          <div className="animate-scroll">
            <span className="mx-6">BTC/USDT 🟢 64,230.50 (+2.4%)</span>
            <span className="mx-6">ETH/USDT 🔴 3,420.10 (-0.8%)</span>
            <span className="mx-6">SOL/USDT 🟢 145.20 (+5.1%)</span>
            <span className="mx-6">SYS/STATUS 🟢 ONLINE_SECURE</span>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="relative bg-zinc-950 p-10 border border-emerald-500/30 space-y-6 w-full max-w-sm shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 before:absolute before:-top-[1px] before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-emerald-500 before:to-transparent">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-mono font-bold text-emerald-400 tracking-widest uppercase">AUTH_SYSTEM</h2>
            <p className="text-xs font-mono text-emerald-500/50 mt-2">INGRESAR CREDENCIALES DE OPERADOR</p>
          </div>

          {loginError && (
            <div className="bg-red-950/50 border border-red-500/50 p-3 text-center animate-pulse">
              <p className="text-red-500 font-mono text-xs uppercase tracking-wider">ERROR: {loginError}</p>
            </div>
          )}

          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full font-mono bg-black border border-emerald-500/30 p-4 text-emerald-300 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full font-mono bg-black border border-emerald-500/30 p-4 text-emerald-300 outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all" required />
          <button type="submit" disabled={loading} className="w-full font-mono uppercase tracking-widest bg-emerald-500/10 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold p-4 transition-all duration-300">
            {loading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    );
  }

  // Si ya inició sesión, mostramos el formulario de videos
  return (
    <div className="min-h-screen bg-black py-16 px-4 font-sans relative overflow-hidden">
      <style>{`
        @keyframes scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
        .animate-scroll { animation: scroll 20s linear infinite; white-space: nowrap; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="absolute top-0 left-0 w-full bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-500 font-mono text-xs py-1 z-20">
        <div className="animate-scroll">
          <span className="mx-6">LOGGED IN AS ADMIN</span>
          <span className="mx-6">ENCRYPTION 🟢 ACTIVE</span>
          <span className="mx-6">SERVER_PING 🟢 12ms</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 relative z-10">
        <div className="font-mono text-emerald-500 text-xs">STATUS: <span className="text-emerald-300">AUTHORIZED</span></div>
        <button onClick={() => supabase.auth.signOut()} className="font-mono text-xs text-red-500 hover:bg-red-950 hover:text-red-400 transition px-4 py-2 border border-red-500/30 uppercase tracking-widest">Desconectar</button>
      </div>
      <AdminVideoForm />
    </div>
  );
}