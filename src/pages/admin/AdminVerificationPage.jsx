import { ROUTES } from '../../constants/routes.js';
import CompanyAttendanceListPage from '../shared/CompanyAttendanceListPage.jsx';

export default function AdminVerificationPage() {
  return (
    <CompanyAttendanceListPage
      title="Verification queue"
      detailBasePath={ROUTES.admin.attendanceDetail}
      statusFilter="pending_verification"
    />
  );
}
