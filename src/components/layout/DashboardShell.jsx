import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { WORKZEN_LOGO_SRC } from '../../constants/brand.js';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

const WIDTH = {
  wide: {
    aside: 'w-72',
    pad: 'md:pl-72',
    header: 'md:left-72',
    drawer: 'w-[min(100%,18rem)] max-w-[18rem]',
  },
  narrow: {
    aside: 'w-64',
    pad: 'md:pl-64',
    header: 'md:left-64',
    drawer: 'w-[min(100%,16rem)] max-w-[16rem]',
  },
};

export default function DashboardShell({
  brandTitle,
  brandSubtitle,
  navItems,
  badges = {},
  sidebarFooter,
  headerCompanyName,
  headerTitle,
  userEmail,
  onLogout,
  sidebarWidth = 'wide',
  mainPaddingClass = 'p-4 sm:p-6',
  mainInnerClassName = '',
  children,
}) {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const layout = WIDTH[sidebarWidth] ?? WIDTH.wide;

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setNavOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [navOpen]);

  const mainContent = mainInnerClassName ? (
    <div className={`min-w-0 ${mainInnerClassName}`}>{children}</div>
  ) : (
    children
  );

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full ${layout.aside} ${layout.drawer} flex-col justify-between border-r border-outline-variant/40 bg-surface-container-lowest shadow-header transition-transform duration-200 ease-out dark:shadow-none ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        id="app-sidebar"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain">
          <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            <div className="flex min-w-0 items-center gap-2">
              <img src={WORKZEN_LOGO_SRC} alt="WorkZen" className="h-8 w-auto shrink-0" />
              <div className="min-w-0 flex flex-col">
                <span className="truncate text-sm font-semibold leading-tight">{brandTitle}</span>
                {brandSubtitle ? (
                  <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-outline">
                    {brandSubtitle}
                  </span>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high md:hidden"
              aria-label="Close navigation menu"
              onClick={() => setNavOpen(false)}
            >
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Main">
            {navItems.map((item) => {
              const badge = item.badgeKey ? badges[item.badgeKey] : null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end ?? false}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`
                  }
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon name={item.icon} size={22} className="shrink-0 text-outline" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {badge ? (
                    <span className="ml-2 shrink-0 rounded-full bg-error-container px-2 py-0.5 text-[10px] font-bold text-on-error-container">
                      {badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>
        {sidebarFooter ? <div className="shrink-0">{sidebarFooter}</div> : null}
      </aside>

      <div className={`min-w-0 w-full ${layout.pad}`}>
        <header
          className={`fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between gap-2 border-b border-outline-variant/40 bg-surface-container-lowest/90 px-4 backdrop-blur-xl shadow-header sm:px-6 dark:bg-surface-container-lowest/95 dark:shadow-none pt-safe ${layout.header}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high md:hidden"
              aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={navOpen}
              aria-controls="app-sidebar"
              onClick={() => setNavOpen((open) => !open)}
            >
              <Icon name={navOpen ? 'close' : 'menu'} size={24} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-outline">
                {headerCompanyName || 'Company'}
              </p>
              <p className="truncate text-sm font-semibold capitalize">{headerTitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {userEmail ? (
              <span className="hidden max-w-[12rem] truncate text-sm text-on-surface-variant md:inline">
                {userEmail}
              </span>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="max-sm:px-2"
              onClick={onLogout}
              aria-label="Log out"
            >
              <span className="hidden sm:inline">Log out</span>
              <Icon name="logout" size={20} className="sm:hidden" />
            </Button>
          </div>
        </header>

        <main className="min-h-screen w-full min-w-0 bg-background pt-16">
          <div className={`min-w-0 w-full max-w-full ${mainPaddingClass}`}>{mainContent}</div>
        </main>
      </div>
    </div>
  );
}
