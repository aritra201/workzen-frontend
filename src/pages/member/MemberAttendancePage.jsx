import { ROUTES } from '../../constants/routes.js';
import CompanyAttendanceListPage from '../shared/CompanyAttendanceListPage.jsx';

export default function MemberAttendancePage() {
  return (
    <CompanyAttendanceListPage
      title="Attendance (read-only)"
      detailBasePath={ROUTES.member.attendanceDetail}
      readOnly
    />
  );
}
