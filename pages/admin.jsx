import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminVideoForm from '../components/AdminVideoForm';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('admin@micurso.com');
  const [password, setPassword] = useState('1979correoCurso');
  const [loading, setLoading] = useState(false);

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Error: ' + error.message);
    setLoading(false);
  };

  // Si no ha iniciado sesión, mostramos el login
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <form onSubmit={handleLogin} className="relative bg-zinc-950 p-10 border border-emerald-500/30 space-y-6 w-full max-w-sm shadow-[0_0_30px_rgba(16,185,129,0.15)] z-10 before:absolute before:-top-[1px] before:left-0 before:w-full before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-emerald-500 before:to-transparent">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-mono font-bold text-emerald-400 tracking-widest uppercase">AUTH_SYSTEM</h2>
            <p className="text-xs font-mono text-emerald-500/50 mt-2">INGRESAR CREDENCIALES DE OPERADOR</p>
          </div>
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
    <div className="min-h-screen bg-black py-12 px-4 font-sans relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-4xl mx-auto flex justify-end mb-6">
        <button onClick={() => supabase.auth.signOut()} className="relative z-10 font-mono text-xs text-red-500 hover:bg-red-950 hover:text-red-400 transition px-4 py-2 border border-red-500/30 uppercase tracking-widest">Desconectar</button>
      </div>
      <AdminVideoForm />
    </div>
  );
}