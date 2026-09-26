import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { homePathForRole } from '../utils/membership.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function RoleRoute({ allowedRoles, children }) {
  const { primaryMembership, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const role = primaryMembership?.role;
  if (!role || !allowedRoles.includes(role)) {
    const fallback = role ? homePathForRole(role) : '/login';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
