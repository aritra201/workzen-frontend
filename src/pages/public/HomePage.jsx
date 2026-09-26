import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { homePathForRole } from '../../utils/membership.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';

export default function HomePage() {
  const { isAuthenticated, primaryMembership } = useAuth();

  if (isAuthenticated && primaryMembership?.role) {
    const dashboard = homePathForRole(primaryMembership.role);
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-on-surface-variant">Continue to your WorkZen workspace.</p>
        <Link to={dashboard} className="mt-6 inline-block">
          <Button>Open dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-bold tracking-tight">WorkZen</h1>
      <p className="mt-3 text-on-surface-variant">
        Field attendance, shift verification, and wage ledgers for civil contractors and site teams.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={ROUTES.register}>
          <Button>Register company</Button>
        </Link>
        <Link to={ROUTES.login}>
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
    </div>
  );
}
