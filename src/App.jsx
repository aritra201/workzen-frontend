import AppRoutes from './routes/AppRoutes.jsx';
import FcmBootstrap from './fcm/FcmBootstrap.jsx';

export default function App() {
  return (
    <>
      <FcmBootstrap />
      <AppRoutes />
    </>
  );
}
