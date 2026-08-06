import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-3xl place-items-center px-4 py-10 text-center">
      <div className="glass-panel rounded-[2rem] p-10">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-400">404</div>
        <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The route does not exist or the user is not authorized for this view.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-teal-400 px-6 py-3 font-medium text-slate-950">Return home</Link>
      </div>
    </div>
  );
}