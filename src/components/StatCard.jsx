import React from 'react';

export default function StatCard({ label, value, hint }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      {hint ? <div className="mt-2 text-sm text-slate-400">{hint}</div> : null}
    </div>
  );
}