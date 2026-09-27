import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { WORKZEN_LOGO_SRC } from '../../constants/brand.js';
import { ADMIN_NAV } from '../../constants/navigation.js';
import { ROUTES } from '../../constants/routes.js';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import CompanyNameGate from '../auth/CompanyNameGate.jsx';

export default function AdminShell({ badges = {} }) {
  const { user, logout, primaryMembership } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between border-r border-outline-variant/40 bg-surface-container-lowest shadow-header dark:shadow-none">
        <div>
          <div className="flex h-16 items-center gap-2 px-4">
            <img src={WORKZEN_LOGO_SRC} alt="WorkZen" className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">WorkZen Admin</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-outline">
                Labour & Payroll
              </span>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-2">
            {ADMIN_NAV.map((item) => {
              const badge = item.badgeKey ? badges[item.badgeKey] : null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon name={item.icon} size={22} className="text-outline" />
                    {item.label}
                  </span>
                  {badge ? (
                    <span className="rounded-full bg-error-container px-2 py-0.5 text-[10px] font-bold text-on-error-container">
                      {badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="m-3 rounded-xl bg-surface-container-low p-3">
          <div className="flex items-center gap-2 text-secondary">
            <Icon name="schedule" size={18} />
            <span className="text-[10px] font-semibold uppercase">Shift cutoff</span>
          </div>
          <p className="mt-1 text-xs font-medium">Day lock: 11:59 PM (company TZ)</p>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed left-72 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/40 bg-surface-container-lowest/90 px-6 backdrop-blur-xl shadow-header dark:bg-surface-container-lowest/95 dark:shadow-none">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-outline">
              {primaryMembership?.companyName || 'Company'}
            </p>
            <p className="text-sm font-semibold capitalize">{location.pathname.split('/').pop()?.replace('-', ' ')}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-sm text-on-surface-variant md:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
          </div>
        </header>

        <main className="min-h-screen bg-background pt-16">
          <CompanyNameGate>
            <div className="p-6">
              <Outlet />
            </div>
          </CompanyNameGate>
        </main>
      </div>
    </div>
  );
}
