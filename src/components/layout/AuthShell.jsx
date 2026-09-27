import { Link, Outlet } from 'react-router-dom';
import { WORKZEN_LOGO_SRC } from '../../constants/brand.js';
import { ROUTES } from '../../constants/routes.js';
import Icon from '../ui/Icon.jsx';

export default function AuthShell() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="fixed top-0 z-50 w-full bg-surface/80 shadow-header backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-margin">
          <Link to={ROUTES.home} className="flex items-center gap-2">
            <img src={WORKZEN_LOGO_SRC} alt="WorkZen" className="h-8" />
            <span className="text-sm font-semibold">WorkZen</span>
            <span className="hidden rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold uppercase text-on-surface-variant sm:inline">
              Employee & Wage Suite
            </span>
          </Link>
          <Link to={ROUTES.login} className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary">
            <Icon name="help_outline" size={18} />
            Help
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col pt-16">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6 sm:px-margin sm:py-8">
          <div className="pointer-events-none absolute -left-20 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 rounded-full bg-secondary-container/30 blur-2xl" />
          <div className="relative z-10 w-full max-w-5xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
