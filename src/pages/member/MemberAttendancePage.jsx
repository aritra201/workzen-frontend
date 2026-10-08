import { ROUTES } from '../../constants/routes.js';
import CompanyAttendanceListPage from '../shared/CompanyAttendanceListPage.jsx';

export default function MemberAttendancePage() {
  return (
    <CompanyAttendanceListPage
      title="Employee Attendance List"
      detailBasePath={ROUTES.member.attendanceDetail}
      readOnly
    />
  );
}
