import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import './layout.css';

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Link to={ROUTES.home} className="brand">
          WorkZen
        </Link>
      </header>
      <main className="auth-main">
        <div className="auth-card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
