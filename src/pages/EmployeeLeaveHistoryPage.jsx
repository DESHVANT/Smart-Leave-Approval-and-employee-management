import React, { useContext, useEffect, useState } from 'react';
import http from '../services/http';
import StatCard from '../components/StatCard';
import { AuthContext } from '../context/AuthContext';

export default function EmployeeLeaveHistoryPage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const [profileResponse, leavesResponse] = await Promise.all([
      http.get('/api/employee/profile'),
      http.get('/api/employee/leaves'),
    ]);
    setProfile(profileResponse.data);
    setLeaves(leavesResponse.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err?.response?.data?.message || 'Unable to load leave history'));
  }, []);

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
        <div className="text-sm uppercase tracking-[0.2em] text-teal-200/80">Leave history</div>
        <h1 className="mt-2 text-4xl font-semibold text-white">Your leave requests</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Review every leave request, see the status, and cancel pending requests if needed.</p>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-100">{error}</div> : null}
      {message ? <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Leave balance" value={profile?.leaveBalance ?? user?.leaveBalance ?? '—'} hint="Current balance" />
        <StatCard label="Pending requests" value={profile?.pendingLeaves ?? '—'} hint="Awaiting review" />
        <StatCard label="Approved requests" value={profile?.approvedLeaves ?? '—'} hint="Confirmed leave" />
      </div>

      <section className="glass-panel mt-8 rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-white">History</h2>
        <div className="mt-5 space-y-3">
          {leaves.length === 0 ? <p className="text-sm text-slate-400">No leave requests yet.</p> : null}
          {leaves.map((leave) => (
            <div key={leave.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-white">{leave.startDate} to {leave.endDate}</div>
                  <div className="mt-1 text-sm text-slate-400">{leave.reason}</div>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-teal-100">{leave.status}</div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span>{leave.daysRequested} day(s)</span>
                {leave.status === 'PENDING' ? <button onClick={() => cancel(leave.id)} className="text-amber-200 hover:text-amber-100">Cancel</button> : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}