import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminVideoForm from '../components/AdminVideoForm';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 w-full max-w-sm shadow-2xl">
          <h2 className="text-2xl font-semibold text-white text-center">Acceso Admin</h2>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Tu correo de Supabase" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-sky-500" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-sky-500" required />
          <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold p-3 rounded-xl transition">
            {loading ? 'Entrando...' : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    );
  }

  // Si ya inició sesión, mostramos el formulario de videos
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto flex justify-end mb-6">
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-slate-400 hover:text-white transition px-4 py-2 border border-slate-800 rounded-lg">Cerrar sesión</button>
      </div>
      <AdminVideoForm />
    </div>
  );
}