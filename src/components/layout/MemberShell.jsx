import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { WORKZEN_LOGO_SRC } from '../../constants/brand.js';
import { MEMBER_NAV } from '../../constants/navigation.js';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';

export default function MemberShell() {
  const { user, logout, primaryMembership } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-surface-container-lowest shadow-header">
        <div className="flex h-16 items-center gap-2 border-b border-surface-container-high px-4">
          <img src={WORKZEN_LOGO_SRC} alt="WorkZen" className="h-8" />
          <span className="text-sm font-semibold">Member view</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {MEMBER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="pl-64">
        <header className="flex h-14 items-center justify-between border-b border-surface-container-high bg-surface-container-lowest px-6">
          <span className="text-sm text-on-surface-variant">{primaryMembership?.companyName}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
