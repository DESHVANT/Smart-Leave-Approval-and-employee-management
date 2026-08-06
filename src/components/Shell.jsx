import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function navClass({ isActive }) {
  return [
    'rounded-full px-4 py-2 text-sm transition border',
    isActive
      ? 'bg-teal-400/15 border-teal-300/40 text-teal-200'
      : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5',
  ].join(' ');
}

export default function Shell({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-teal-200/80">Smart Leave</div>
              <div className="text-xs text-slate-400">Approval and employee management</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {isAdmin ? (
              <>
                <NavLink to="/admin" className={navClass}>Admin</NavLink>
                <NavLink to="/admin/employees" className={navClass}>Employees</NavLink>
                <NavLink to="/admin/leaves" className={navClass}>Leaves</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
                <NavLink to="/dashboard/leaves" className={navClass}>Leave History</NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}