import { ROUTES } from '../../constants/routes.js';
import CompanyPayrollPage from '../shared/CompanyPayrollPage.jsx';

export default function EmployeePayrollPage() {
  return (
    <CompanyPayrollPage
      title="My payroll report"
      detailBasePath={ROUTES.employee.attendanceDetail}
      employeeScope
    />
  );
}
