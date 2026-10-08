import { ROUTES } from './routes.js';

export const ADMIN_NAV = [
  { to: ROUTES.admin.dashboard, label: 'Dashboard', icon: 'dashboard' },
  { to: ROUTES.admin.attendance, label: 'Attendance', icon: 'how_to_reg' },
  { to: ROUTES.admin.verification, label: 'Verification Queue', icon: 'fact_check', badgeKey: 'verification' },
  { to: ROUTES.admin.unlockRequests, label: 'Unlock Requests', icon: 'lock_open', badgeKey: 'unlock' },
  { to: ROUTES.admin.employees, label: 'Employees & Labour', icon: 'group' },
  { to: ROUTES.admin.members, label: 'Members', icon: 'security' },
  { to: ROUTES.admin.reports, label: 'Payroll & Reports', icon: 'payments' },
  { to: ROUTES.admin.company, label: 'Company Settings', icon: 'settings' },
];

export const MEMBER_NAV = [
  { to: ROUTES.member.dashboard, label: 'Overview', icon: 'dashboard', end: true },
  { to: ROUTES.member.attendance, label: 'Attendance', icon: 'how_to_reg', end: true },
  { to: ROUTES.member.reports, label: 'Payroll & Reports', icon: 'payments', end: true },
  { to: ROUTES.member.profile, label: 'My profile', icon: 'person', end: true },
];

/** Desktop web app sidebar (native mobile app is separate). */
export const EMPLOYEE_NAV = [
  { to: ROUTES.employee.dashboard, label: 'Dashboard', icon: 'dashboard', end: true },
  { to: ROUTES.employee.attendance, label: 'Mark attendance', icon: 'how_to_reg', end: true },
  { to: ROUTES.employee.attendanceHistory, label: 'Attendance history', icon: 'calendar_month' },
  { to: ROUTES.employee.payroll, label: 'My payroll report', icon: 'payments' },
  { to: ROUTES.employee.unlockRequests, label: 'Unlock requests', icon: 'lock_open' },
  { to: ROUTES.employee.profile, label: 'My profile', icon: 'person', end: true },
];
