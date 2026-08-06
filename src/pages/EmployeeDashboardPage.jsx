import React, { useContext, useEffect, useState } from 'react';
import http from '../services/http';
import StatCard from '../components/StatCard';
import { AuthContext } from '../context/AuthContext';

const emptyLeave = { startDate: '', endDate: '', reason: '' };

export default function EmployeeDashboardPage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyLeave);
  const [profileForm, setProfileForm] = useState({ name: '', department: '', position: '', phone: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const profileResponse = await http.get('/api/employee/profile');
    setProfile(profileResponse.data);
    setProfileForm({
      name: profileResponse.data.name ?? '',
      department: profileResponse.data.department ?? '',
      position: profileResponse.data.position ?? '',
      phone: profileResponse.data.phone ?? '',
    });
  };

  useEffect(() => {
    load().catch((err) => setError(err?.response?.data?.message || 'Unable to load dashboard'));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await http.post('/api/employee/leaves', form);
      setForm(emptyLeave);
      setMessage('Leave request submitted successfully');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await http.put('/api/employee/profile', profileForm);
      setProfile(data);
      setProfileForm({
        name: data.name,
        department: data.department,
        position: data.position,
        phone: data.phone ?? '',
      });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  const cancel = async (leaveId) => {
    setError('');
    setMessage('');
    try {
      await http.patch(`/api/employee/leaves/${leaveId}/cancel`);
      setMessage('Leave request cancelled');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to cancel leave request');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-teal-200/80">Employee dashboard</div>
        <h1 className="mt-2 text-4xl font-semibold text-white">Welcome back, {user?.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Apply for leave, monitor your balance, and update your profile from one place.</p>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-100">{error}</div> : null}
      {message ? <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Leave balance" value={profile?.leaveBalance ?? user?.leaveBalance ?? '—'} hint="Current balance" />
        <StatCard label="Pending requests" value={profile?.pendingLeaves ?? '—'} hint="Awaiting review" />
        <StatCard label="Approved requests" value={profile?.approvedLeaves ?? '—'} hint="Confirmed leave" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-white">Edit profile</h2>
          <form className="mt-5 space-y-4" onSubmit={saveProfile}>
            <Field label="Full name" value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} required />
            <Field label="Department" value={profileForm.department} onChange={(event) => setProfileForm((current) => ({ ...current, department: event.target.value }))} required />
            <Field label="Position" value={profileForm.position} onChange={(event) => setProfileForm((current) => ({ ...current, position: event.target.value }))} required />
            <Field label="Phone" value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} />
            <button className="rounded-2xl bg-white px-4 py-3 font-medium text-slate-950 transition hover:bg-slate-200">Save profile</button>
          </form>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-white">Apply leave</h2>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <Field label="Start date" type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} />
            <Field label="End date" type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} />
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Reason</span>
              <textarea rows="5" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/40" placeholder="Explain the request in at least 10 characters" required />
            </label>
            <button className="rounded-2xl bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300">Submit leave request</button>
          </form>
        </section>
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