import { COMPANY_ROLE } from '../constants/roles.js';

export function pickPrimaryMembership(memberships = []) {
  if (!memberships.length) {
    return null;
  }

  const admin = memberships.find((m) => m.role === COMPANY_ROLE.ADMIN && m.isActive);
  if (admin) {
    return admin;
  }

  const member = memberships.find((m) => m.role === COMPANY_ROLE.MEMBER && m.isActive);
  if (member) {
    return member;
  }

  const employee = memberships.find((m) => m.role === COMPANY_ROLE.EMPLOYEE && m.isActive);
  if (employee) {
    return employee;
  }

  return memberships[0];
}

export function homePathForRole(role) {
  switch (role) {
    case COMPANY_ROLE.ADMIN:
      return '/admin/dashboard';
    case COMPANY_ROLE.MEMBER:
      return '/member/dashboard';
    case COMPANY_ROLE.EMPLOYEE:
      return '/employee/dashboard';
    default:
      return '/';
  }
}
