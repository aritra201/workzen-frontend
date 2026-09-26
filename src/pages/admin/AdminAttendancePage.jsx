import { ROUTES } from '../../constants/routes.js';
import CompanyAttendanceListPage from '../shared/CompanyAttendanceListPage.jsx';

export default function AdminAttendancePage() {
  return (
    <CompanyAttendanceListPage
      title="Company attendance"
      detailBasePath={ROUTES.admin.attendanceDetail}
    />
  );
}
