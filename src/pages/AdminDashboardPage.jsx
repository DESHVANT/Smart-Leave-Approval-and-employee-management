import React, { useEffect, useState } from 'react';
import http from '../services/http';
import StatCard from '../components/StatCard';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState('');

  const load = async () => {
    const [dashboardResponse, employeesResponse, leavesResponse] = await Promise.all([
      http.get('/api/admin/dashboard'),
      http.get('/api/admin/employees'),
      http.get('/api/admin/leaves'),
    ]);
    setDashboard(dashboardResponse.data);
    setEmployees(employeesResponse.data);
    setLeaves(leavesResponse.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err?.response?.data?.message || 'Unable to load admin dashboard'));
  }, []);

  const review = async (leaveId, action) => {
    setError('');
    const payload = { reviewNote: notes[leaveId] || '' };
    try {
      await http.patch(`/api/admin/leaves/${leaveId}/${action}`, payload);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update leave request');
    }
  };

  const adjustBalance = async (employeeId, delta) => {
    try {
      await http.patch(`/api/admin/employees/${employeeId}/balance`, { delta });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to adjust balance');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-teal-200/80">Admin dashboard</div>
        <h1 className="mt-2 text-4xl font-semibold text-white">Operational overview</h1>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-100">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Employees" value={dashboard?.totalEmployees ?? '—'} />
        <StatCard label="Pending" value={dashboard?.totalPendingLeaves ?? '—'} />
        <StatCard label="Approved" value={dashboard?.totalApprovedLeaves ?? '—'} />
        <StatCard label="Rejected" value={dashboard?.totalRejectedLeaves ?? '—'} />
        <StatCard label="Low balance" value={dashboard?.lowBalanceEmployees ?? '—'} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-white">Employees</h2>
          <div className="mt-5 space-y-3">
            {employees.map((employee) => (
              <div key={employee.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{employee.name}</div>
                    <div className="mt-1 text-sm text-slate-400">{employee.email} • {employee.department}</div>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-teal-100">{employee.leaveBalance} days</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-300">
                  <button className="rounded-full border border-white/10 px-3 py-1 hover:bg-white/5" onClick={() => adjustBalance(employee.id, 1)}>+1</button>
                  <button className="rounded-full border border-white/10 px-3 py-1 hover:bg-white/5" onClick={() => adjustBalance(employee.id, -1)}>-1</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-white">Leave requests</h2>
          <div className="mt-5 space-y-3">
            {leaves.map((leave) => (
              <div key={leave.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{leave.employeeName}</div>
                    <div className="mt-1 text-sm text-slate-400">{leave.startDate} to {leave.endDate} • {leave.daysRequested} day(s)</div>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-teal-100">{leave.status}</div>
                </div>
                <div className="mt-3 text-sm text-slate-300">{leave.reason}</div>
                <input value={notes[leave.id] || ''} onChange={(event) => setNotes((current) => ({ ...current, [leave.id]: event.target.value }))} placeholder="Review note" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-white outline-none" />
                {leave.status === 'PENDING' ? (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => review(leave.id, 'approve')} className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950">Approve</button>
                    <button onClick={() => review(leave.id, 'reject')} className="rounded-full bg-red-400 px-4 py-2 text-sm font-medium text-slate-950">Reject</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}