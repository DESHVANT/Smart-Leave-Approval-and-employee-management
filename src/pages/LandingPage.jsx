import React from 'react';
import { Link } from 'react-router-dom';

const featureCards = [
  { title: 'Employee self-service', text: 'Register, manage profile details, and track leave balance in one place.' },
  { title: 'Role-based approval', text: 'Admins approve or reject requests with enforced JWT authorization.' },
  { title: 'Business rule enforcement', text: 'No past leave, no reverse date ranges, no duplicate or negative-balance approvals.' },
  { title: 'Audit-friendly workflow', text: 'Every request carries status, reviewer note, timestamps, and history.' },
];

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm text-teal-100">
            Production-style internship assessment solution
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Smart Leave Approval & Employee Management System
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              A secure leave workflow with JWT authentication, employee self-service, and admin approvals built on Spring Boot and React.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-teal-300">
              Open app
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10">
              Register employee
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-panel rounded-3xl p-5">
              <div className="text-sm text-slate-400">Employee demo</div>
              <div className="mt-2 font-medium text-white">employee@smartleave.test</div>
            </div>
            <div className="glass-panel rounded-3xl p-5">
              <div className="text-sm text-slate-400">Admin demo</div>
              <div className="mt-2 font-medium text-white">admin@smartleave.test</div>
            </div>
            <div className="glass-panel rounded-3xl p-5">
              <div className="text-sm text-slate-400">JWT + MySQL ready</div>
              <div className="mt-2 font-medium text-white">Backend/API driven</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 shadow-glow">
          <div className="space-y-4">
            <div className="text-sm uppercase tracking-[0.24em] text-teal-200/80">What this system covers</div>
            <div className="space-y-4">
              {featureCards.map((feature) => {
                return (
                  <div key={feature.title} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <h2 className="font-medium text-white">{feature.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{feature.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}