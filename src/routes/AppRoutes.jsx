import { Navigate, Route, Routes } from 'react-router-dom';
import { COMPANY_ROLE } from '../constants/roles.js';
import { ROUTES } from '../constants/routes.js';
import AuthShell from '../components/layout/AuthShell.jsx';
import AdminLayoutRoute from '../components/layout/AdminLayoutRoute.jsx';
import MemberShell from '../components/layout/MemberShell.jsx';
import EmployeeShell from '../components/layout/EmployeeShell.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import AcceptMemberInvitePage from '../pages/invitations/AcceptMemberInvitePage.jsx';
import AcceptEmployeeInvitePage from '../pages/invitations/AcceptEmployeeInvitePage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminCompanyPage from '../pages/admin/AdminCompanyPage.jsx';
import AdminMembersPage from '../pages/admin/AdminMembersPage.jsx';
import AdminEmployeesPage from '../pages/admin/AdminEmployeesPage.jsx';
import AdminUnlockRequestsPage from '../pages/admin/AdminUnlockRequestsPage.jsx';
import AdminAttendancePage from '../pages/admin/AdminAttendancePage.jsx';
import AdminVerificationPage from '../pages/admin/AdminVerificationPage.jsx';
import AdminReportsPage from '../pages/admin/AdminReportsPage.jsx';
import MemberDashboardPage from '../pages/member/MemberDashboardPage.jsx';
import MemberAttendancePage from '../pages/member/MemberAttendancePage.jsx';
import MemberProfilePage from '../pages/member/MemberProfilePage.jsx';
import MemberReportsPage from '../pages/member/MemberReportsPage.jsx';
import EmployeeDashboardPage from '../pages/employee/EmployeeDashboardPage.jsx';
import EmployeeAttendancePage from '../pages/employee/EmployeeAttendancePage.jsx';
import EmployeeAttendanceHistoryPage from '../pages/employee/EmployeeAttendanceHistoryPage.jsx';
import EmployeePayrollPage from '../pages/employee/EmployeePayrollPage.jsx';
import EmployeeUnlockRequestsPage from '../pages/employee/EmployeeUnlockRequestsPage.jsx';
import EmployeeProfilePage from '../pages/employee/EmployeeProfilePage.jsx';
import AttendanceRecordDetailPage from '../pages/shared/AttendanceRecordDetailPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import { WORKZEN_LOGO_SRC } from '../constants/brand.js';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';

function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-surface-container-high bg-surface-container-lowest/90 px-4 py-4 shadow-header sm:px-margin">
        <Link to={ROUTES.home} className="inline-flex items-center gap-2">
          <img src={WORKZEN_LOGO_SRC} alt="" className="h-8" />
          <span className="font-semibold">WorkZen</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="px-margin py-8">{children}</main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.home}
        element={
          <PublicShell>
            <HomePage />
          </PublicShell>
        }
      />

      <Route element={<AuthShell />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
        <Route path={ROUTES.inviteMember} element={<AcceptMemberInvitePage />} />
        <Route path={ROUTES.inviteEmployee} element={<AcceptEmployeeInvitePage />} />
        <Route path={ROUTES.acceptMemberInvite} element={<AcceptMemberInvitePage />} />
        <Route path={ROUTES.acceptEmployeeInvite} element={<AcceptEmployeeInvitePage />} />
      </Route>

      <Route
        path={`${ROUTES.admin.root}/*`}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[COMPANY_ROLE.ADMIN]}>
              <AdminLayoutRoute />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.admin.dashboard} replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="company" element={<AdminCompanyPage />} />
        <Route path="members" element={<AdminMembersPage />} />
        <Route path="employees" element={<AdminEmployeesPage />} />
        <Route path="extra-shifts" element={<Navigate to={ROUTES.admin.attendance} replace />} />
        <Route path="unlock-requests" element={<AdminUnlockRequestsPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="verification" element={<AdminVerificationPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route
          path="attendance/record"
          element={<AttendanceRecordDetailPage mode="admin" backTo={ROUTES.admin.attendance} />}
        />
      </Route>

      <Route
        path={`${ROUTES.member.root}/*`}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[COMPANY_ROLE.MEMBER]}>
              <MemberShell />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.member.dashboard} replace />} />
        <Route path="dashboard" element={<MemberDashboardPage />} />
        <Route path="attendance" element={<MemberAttendancePage />} />
        <Route path="reports" element={<MemberReportsPage />} />
        <Route path="profile" element={<MemberProfilePage />} />
        <Route
          path="attendance/record"
          element={<AttendanceRecordDetailPage mode="member" backTo={ROUTES.member.attendance} />}
        />
      </Route>

      <Route
        path={`${ROUTES.employee.root}/*`}
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[COMPANY_ROLE.EMPLOYEE]}>
              <EmployeeShell />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.employee.dashboard} replace />} />
        <Route path="dashboard" element={<EmployeeDashboardPage />} />
        <Route path="attendance" element={<EmployeeAttendancePage />} />
        <Route path="attendance/history" element={<EmployeeAttendanceHistoryPage />} />
        <Route path="payroll" element={<EmployeePayrollPage />} />
        <Route path="attendance/record" element={<AttendanceRecordDetailPage mode="employee" backTo={ROUTES.employee.attendanceHistory} />} />
        <Route path="unlock-requests" element={<EmployeeUnlockRequestsPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
