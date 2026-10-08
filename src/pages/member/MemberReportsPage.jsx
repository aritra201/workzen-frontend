import { ROUTES } from '../../constants/routes.js';
import CompanyPayrollPage from '../shared/CompanyPayrollPage.jsx';

export default function MemberReportsPage() {
  return (
    <CompanyPayrollPage
      title="Payroll & reports"
      detailBasePath={ROUTES.member.attendanceDetail}
      readOnly
    />
  );
}
