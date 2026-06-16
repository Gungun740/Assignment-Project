import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/useAuth";
import toast from 'react-hot-toast';
import './AppShell.css';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/tasks',     label: 'Tasks',     icon: '✦' },
];

export default function AppShell() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <div className={`shell ${collapsed ? 'shell--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__header">
          <div className="logo">
            <span className="logo__mark">T</span>
            {!collapsed && <span className="logo__text">TaskFlow</span>}
          </div>
          <button className="btn btn-icon btn-ghost sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
              <span className="nav-item__icon">{icon}</span>
              {!collapsed && <span className="nav-item__label">{label}</span>}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
              <span className="nav-item__icon">◈</span>
              {!collapsed && <span className="nav-item__label">Admin</span>}
            </NavLink>
          )}
        </nav>

        <div className="sidebar__footer">
          <div className="user-card">
            <div className="user-card__avatar">{initials}</div>
            {!collapsed && (
              <div className="user-card__info">
                <span className="user-card__name">{user?.username}</span>
                <span className="user-card__role">{isAdmin ? 'Admin' : 'User'}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="btn btn-ghost btn-sm logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="shell__main">
        <div className="shell__content animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}