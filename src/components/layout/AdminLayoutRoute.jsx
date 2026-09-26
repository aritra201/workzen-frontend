import AdminShell from './AdminShell.jsx';
import { useAdminBadges } from '../../hooks/useAdminBadges.js';

export default function AdminLayoutRoute() {
  const badges = useAdminBadges();
  return <AdminShell badges={badges} />;
}
