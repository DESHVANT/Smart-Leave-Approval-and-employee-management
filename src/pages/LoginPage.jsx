import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('employee@smartleave.test');
  const [password, setPassword] = useState('Employee123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      navigate(result.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-panel w-full max-w-md rounded-[2rem] p-8">
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Use the seeded demo account or a registered employee profile.</p>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/40" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/40" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button disabled={loading} className="w-full rounded-2xl bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Need an account? <Link to="/register" className="text-teal-200">Register here</Link>
        </p>
      </div>
    </div>
  );
}