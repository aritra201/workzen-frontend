import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { WORKZEN_APP_ICON_SRC } from '../../constants/brand.js';
import { EMPLOYEE_BOTTOM_NAV } from '../../constants/navigation.js';
import Icon from '../ui/Icon.jsx';

function titleFromPath(pathname) {
  if (pathname.includes('/attendance/history')) return 'Attendance history';
  if (pathname.includes('/attendance/record')) return 'Record detail';
  if (pathname.includes('/attendance')) return 'Mark attendance';
  if (pathname.includes('/unlock')) return 'Unlock requests';
  if (pathname.includes('/profile')) return 'Profile';
  return 'Dashboard';
}

export default function EmployeeShell() {
  const { user, logout, primaryMembership } = useAuth();
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="fixed top-0 z-50 w-full bg-surface/90 pt-safe shadow-header backdrop-blur-xl">
        <div className="flex h-20 items-center justify-between gap-2 px-margin">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <img src={WORKZEN_APP_ICON_SRC} alt="" className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1 truncate">
                <span className="text-sm font-semibold">WorkZen</span>
                <span className="hidden text-on-surface-variant sm:inline">•</span>
                <span className="hidden truncate text-sm font-semibold text-primary sm:inline">{title}</span>
              </div>
              <div className="mt-0.5 flex max-w-[220px] items-center gap-1 rounded-full bg-surface-container-low px-2 py-0.5">
                <Icon name="location_on" size={14} className="shrink-0 text-primary" />
                <span className="truncate text-[10px] font-semibold text-on-surface-variant">
                  {primaryMembership?.companyName || 'Site'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs font-semibold text-primary"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="flex-1 px-margin pb-28 pt-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-container-high bg-surface-container-lowest pb-safe shadow-[0_-4px_12px_rgba(15,23,42,0.04)]">
        <div className="grid h-16 grid-cols-5">
          {EMPLOYEE_BOTTOM_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`
              }
            >
              <Icon name={item.icon} size={22} filled={pathname.startsWith(item.to)} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
