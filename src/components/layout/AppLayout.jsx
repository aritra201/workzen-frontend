import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';
import './layout.css';

export default function AppLayout() {
  const { isAuthenticated, user, logout, primaryMembership } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to={ROUTES.home} className="brand">
          WorkZen
        </Link>
        <nav className="app-nav">
          {isAuthenticated ? (
            <>
              <span className="nav-user">
                {user?.email}
                {primaryMembership?.role ? ` · ${primaryMembership.role}` : ''}
              </span>
              <button type="button" className="btn-link" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login}>Log in</Link>
              <Link to={ROUTES.register}>Register company</Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
