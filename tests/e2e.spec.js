import { test, expect } from '@playwright/test';

const employeeAuth = {
  token: 'employee-token',
  userId: 2,
  name: 'Ava Employee',
  email: 'employee@smartleave.test',
  role: 'ROLE_EMPLOYEE',
  leaveBalance: 12,
};

const adminAuth = {
  token: 'admin-token',
  userId: 1,
  name: 'Admin User',
  email: 'admin@smartleave.test',
  role: 'ROLE_ADMIN',
  leaveBalance: 0,
};

test('employee can login and submit leave', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    const body = route.request().postDataJSON();
    if (body.email === 'employee@smartleave.test' && body.password === 'Employee123!') {
      await route.fulfill({ json: employeeAuth });
      return;
    }
    await route.fulfill({ status: 401, json: { message: 'Invalid email or password' } });
  });

  await page.route('**/api/employee/profile', async (route) => {
    await route.fulfill({ json: { ...employeeAuth, department: 'Engineering', position: 'Software Engineer', phone: '+1-555-0199', pendingLeaves: 0, approvedLeaves: 0, rejectedLeaves: 0 } });
  });

  await page.route('**/api/employee/leaves', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: [] });
      return;
    }
    await route.fulfill({ json: { id: 10, employeeId: 2, employeeName: 'Ava Employee', startDate: '2026-08-10', endDate: '2026-08-12', daysRequested: 3, reason: 'Family travel for a long weekend', status: 'PENDING', reviewNote: null, createdAt: '2026-08-06T12:00:00', reviewedAt: null } });
  });

  await page.route('**/api/employee/leaves/*/cancel', async (route) => {
    await route.fulfill({ json: { id: 10, employeeId: 2, employeeName: 'Ava Employee', startDate: '2026-08-10', endDate: '2026-08-12', daysRequested: 3, reason: 'Family travel for a long weekend', status: 'CANCELLED', reviewNote: 'Cancelled by employee', createdAt: '2026-08-06T12:00:00', reviewedAt: '2026-08-06T12:15:00' } });
  });

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await page.getByLabel('Email').fill('employee@smartleave.test');
  await page.getByLabel('Password').fill('Employee123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();

  await page.getByLabel('Start date').fill('2026-08-10');
  await page.getByLabel('End date').fill('2026-08-12');
  await page.getByLabel('Reason').fill('Family travel for a long weekend');
  await page.getByRole('button', { name: 'Submit leave request' }).click();
  await expect(page.getByText('Leave request submitted successfully')).toBeVisible();
});

test('admin can review leave requests', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({ json: adminAuth });
  });

  await page.route('**/api/admin/dashboard', async (route) => {
    await route.fulfill({ json: { totalEmployees: 1, totalPendingLeaves: 1, totalApprovedLeaves: 0, totalRejectedLeaves: 0, lowBalanceEmployees: 0 } });
  });
  await page.route('**/api/admin/employees', async (route) => {
    await route.fulfill({ json: [{ id: 2, name: 'Ava Employee', email: 'employee@smartleave.test', department: 'Engineering', position: 'Software Engineer', role: 'ROLE_EMPLOYEE', leaveBalance: 12, pendingLeaves: 1, approvedLeaves: 0, rejectedLeaves: 0 }] });
  });
  await page.route('**/api/admin/leaves', async (route) => {
    await route.fulfill({ json: [{ id: 10, employeeId: 2, employeeName: 'Ava Employee', startDate: '2026-08-10', endDate: '2026-08-12', daysRequested: 3, reason: 'Family travel for a long weekend', status: 'PENDING', reviewNote: null, createdAt: '2026-08-06T12:00:00', reviewedAt: null }] });
  });
  await page.route('**/api/admin/leaves/*/approve', async (route) => {
    await route.fulfill({ json: { id: 10, employeeId: 2, employeeName: 'Ava Employee', startDate: '2026-08-10', endDate: '2026-08-12', daysRequested: 3, reason: 'Family travel for a long weekend', status: 'APPROVED', reviewNote: 'Approved for travel', createdAt: '2026-08-06T12:00:00', reviewedAt: '2026-08-06T12:20:00' } });
  });

  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@smartleave.test');
  await page.getByLabel('Password').fill('Admin123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Operational overview' })).toBeVisible();
  await page.getByRole('button', { name: 'Approve' }).first().click();
  await expect(page.getByText('APPROVED')).toBeVisible();
});