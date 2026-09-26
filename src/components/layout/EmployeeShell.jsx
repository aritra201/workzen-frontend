import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { WORKZEN_LOGO_SRC } from '../../constants/brand.js';
import { EMPLOYEE_NAV } from '../../constants/navigation.js';
import { ROUTES } from '../../constants/routes.js';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';
import EmployeeProfileGate from '../auth/EmployeeProfileGate.jsx';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  attendance: 'Mark attendance',
  history: 'Attendance history',
  record: 'Record detail',
  unlock: 'Unlock requests',
  'unlock-requests': 'Unlock requests',
  profile: 'My profile',
};

function pageTitleFromPath(pathname) {
  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard';
  return PAGE_TITLES[segment] || 'Employee';
}

export default function EmployeeShell() {
  const { user, logout, primaryMembership } = useAuth();
  const location = useLocation();
  const pageTitle = pageTitleFromPath(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between bg-surface-container-lowest shadow-header">
        <div>
          <div className="flex h-16 items-center gap-2 px-4">
            <img src={WORKZEN_LOGO_SRC} alt="WorkZen" className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">WorkZen</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-outline">
                Employee portal
              </span>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-2">
            {EMPLOYEE_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={
                  item.to === ROUTES.employee.dashboard ||
                  item.to === ROUTES.employee.attendance ||
                  item.to === ROUTES.employee.profile
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                <Icon name={item.icon} size={22} className="text-outline" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="m-3 rounded-xl bg-surface-container-low p-3">
          <div className="flex items-center gap-2 text-secondary">
            <Icon name="schedule" size={18} />
            <span className="text-[10px] font-semibold uppercase">Shift cutoff</span>
          </div>
          <p className="mt-1 text-xs font-medium">Attendance lock: 11:59 PM</p>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed left-72 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-surface-container-high/80 bg-surface-container-lowest/90 px-6 backdrop-blur-xl shadow-header">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-outline">
              {primaryMembership?.companyName || 'Company'}
            </p>
            <p className="text-sm font-semibold">{pageTitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-on-surface-variant md:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
          </div>
        </header>

        <main className="min-h-screen bg-background pt-16">
          <EmployeeProfileGate>
            <div className="mx-auto max-w-6xl p-6">
              <Outlet />
            </div>
          </EmployeeProfileGate>
        </main>
      </div>
    </div>
  );
}
