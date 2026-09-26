import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-margin text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to={ROUTES.home} className="mt-4 text-primary font-semibold">Back home</Link>
    </div>
  );
}
