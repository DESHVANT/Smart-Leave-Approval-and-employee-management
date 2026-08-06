import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const initial = {
  name: '',
  email: '',
  password: '',
  department: 'Engineering',
  position: 'Software Engineer',
  phone: '',
};

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-panel w-full max-w-2xl rounded-[2rem] p-8">
        <h1 className="text-3xl font-semibold text-white">Create employee account</h1>
        <p className="mt-2 text-sm text-slate-400">Employees can register themselves; admin accounts are seeded for the assessment demo.</p>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={submit}>
          {error ? <div className="md:col-span-2 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}
          <Field label="Full name" value={form.name} onChange={update('name')} required />
          <Field label="Email" type="email" value={form.email} onChange={update('email')} required />
          <Field label="Password" type="password" value={form.password} onChange={update('password')} required />
          <Field label="Phone" value={form.phone} onChange={update('phone')} />
          <Field label="Department" value={form.department} onChange={update('department')} />
          <Field label="Position" value={form.position} onChange={update('position')} />
          <button className="md:col-span-2 rounded-2xl bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300 disabled:opacity-70" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already registered? <Link to="/login" className="text-teal-200">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/40" {...props} />
    </label>
  );
}