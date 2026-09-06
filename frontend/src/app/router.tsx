import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/marketing/LandingPage';
import { LazyFallback } from '@/components/ui/LazyFallback';

// Lazy-load authentication & protected route bundles so landing page initial payload remains minimal
const LoginPage = React.lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = React.lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const GuestOnlyRoute = React.lazy(() =>
  import('@/features/auth/routing/GuestOnlyRoute').then((m) => ({ default: m.GuestOnlyRoute }))
);
const ProtectedRoute = React.lazy(() =>
  import('@/features/auth/routing/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute }))
);
const RoleRedirect = React.lazy(() =>
  import('@/features/auth/routing/RoleRedirect').then((m) => ({ default: m.RoleRedirect }))
);
const ForbiddenPage = React.lazy(() =>
  import('@/features/auth/routing/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage }))
);
const ForgotPasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = React.lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const AccountSecurityPage = React.lazy(() =>
  import('@/features/auth/pages/AccountSecurityPage').then((m) => ({ default: m.AccountSecurityPage }))
);

// Lazy-load Customer Experience pages
const CustomerDashboardPage = React.lazy(() =>
  import('@/features/customer/pages/CustomerDashboardPage').then((m) => ({ default: m.CustomerDashboardPage }))
);
const VehicleListPage = React.lazy(() =>
  import('@/features/customer/pages/VehicleListPage').then((m) => ({ default: m.VehicleListPage }))
);
const AddVehiclePage = React.lazy(() =>
  import('@/features/customer/pages/AddVehiclePage').then((m) => ({ default: m.AddVehiclePage }))
);
const VehicleDetailPage = React.lazy(() =>
  import('@/features/customer/pages/VehicleDetailPage').then((m) => ({ default: m.VehicleDetailPage }))
);
const AppointmentListPage = React.lazy(() =>
  import('@/features/customer/pages/AppointmentListPage').then((m) => ({ default: m.AppointmentListPage }))
);
const BookAppointmentPage = React.lazy(() =>
  import('@/features/customer/pages/BookAppointmentPage').then((m) => ({ default: m.BookAppointmentPage }))
);
const AppointmentDetailPage = React.lazy(() =>
  import('@/features/customer/pages/AppointmentDetailPage').then((m) => ({ default: m.AppointmentDetailPage }))
);
const ActiveServicePage = React.lazy(() =>
  import('@/features/customer/pages/ActiveServicePage').then((m) => ({ default: m.ActiveServicePage }))
);
const InvoiceListPage = React.lazy(() =>
  import('@/features/customer/pages/InvoiceListPage').then((m) => ({ default: m.InvoiceListPage }))
);
const InvoiceDetailPage = React.lazy(() =>
  import('@/features/customer/pages/InvoiceDetailPage').then((m) => ({ default: m.InvoiceDetailPage }))
);
const CustomerProfilePage = React.lazy(() =>
  import('@/features/customer/pages/CustomerProfilePage').then((m) => ({ default: m.CustomerProfilePage }))
);
const RoadsideAssistancePage = React.lazy(() =>
  import('@/features/customer/pages/RoadsideAssistancePage').then((m) => ({ default: m.RoadsideAssistancePage }))
);

// Lazy-load Manager Experience pages
const ManagerDashboardPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerDashboardPage').then((m) => ({ default: m.ManagerDashboardPage }))
);
const ManagerAppointmentListPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerAppointmentListPage').then((m) => ({ default: m.ManagerAppointmentListPage }))
);
const ManagerAppointmentDetailPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerAppointmentDetailPage').then((m) => ({ default: m.ManagerAppointmentDetailPage }))
);
const ManagerTeamPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerTeamPage').then((m) => ({ default: m.ManagerTeamPage }))
);
const ManagerJobCardListPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerJobCardListPage').then((m) => ({ default: m.ManagerJobCardListPage }))
);
const ManagerJobCardDetailPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerJobCardDetailPage').then((m) => ({ default: m.ManagerJobCardDetailPage }))
);
const ManagerInventoryPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerInventoryPage').then((m) => ({ default: m.ManagerInventoryPage }))
);
const ManagerInvoiceListPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerInvoiceListPage').then((m) => ({ default: m.ManagerInvoiceListPage }))
);
const ManagerInvoiceDetailPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerInvoiceDetailPage').then((m) => ({ default: m.ManagerInvoiceDetailPage }))
);
const ManagerReportsPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerReportsPage').then((m) => ({ default: m.ManagerReportsPage }))
);
const ManagerActivityPage = React.lazy(() =>
  import('@/features/manager/pages/ManagerActivityPage').then((m) => ({ default: m.ManagerActivityPage }))
);
const ManagerProfilePage = React.lazy(() =>
  import('@/features/manager/pages/ManagerProfilePage').then((m) => ({ default: m.ManagerProfilePage }))
);

// Lazy-load Mechanic Experience pages
const MechanicDashboardPage = React.lazy(() =>
  import('@/features/mechanic/pages/MechanicDashboardPage').then((m) => ({ default: m.MechanicDashboardPage }))
);
const MechanicJobListPage = React.lazy(() =>
  import('@/features/mechanic/pages/MechanicJobListPage').then((m) => ({ default: m.MechanicJobListPage }))
);
const MechanicJobDetailPage = React.lazy(() =>
  import('@/features/mechanic/pages/MechanicJobDetailPage').then((m) => ({ default: m.MechanicJobDetailPage }))
);
const MechanicCompletedJobsPage = React.lazy(() =>
  import('@/features/mechanic/pages/MechanicCompletedJobsPage').then((m) => ({ default: m.MechanicCompletedJobsPage }))
);
const MechanicProfilePage = React.lazy(() =>
  import('@/features/mechanic/pages/MechanicProfilePage').then((m) => ({ default: m.MechanicProfilePage }))
);

// Lazy-load Admin Experience pages
const AdminDashboardPage = React.lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminUserListPage = React.lazy(() =>
  import('@/features/admin/pages/AdminUserListPage').then((m) => ({ default: m.AdminUserListPage }))
);
const AdminUserDetailPage = React.lazy(() =>
  import('@/features/admin/pages/AdminUserDetailPage').then((m) => ({ default: m.AdminUserDetailPage }))
);
const AdminManagerListPage = React.lazy(() =>
  import('@/features/admin/pages/AdminManagerListPage').then((m) => ({ default: m.AdminManagerListPage }))
);
const AdminMechanicListPage = React.lazy(() =>
  import('@/features/admin/pages/AdminMechanicListPage').then((m) => ({ default: m.AdminMechanicListPage }))
);
const AdminTeamStructurePage = React.lazy(() =>
  import('@/features/admin/pages/AdminTeamStructurePage').then((m) => ({ default: m.AdminTeamStructurePage }))
);
const AdminAppointmentListPage = React.lazy(() =>
  import('@/features/admin/pages/AdminAppointmentListPage').then((m) => ({ default: m.AdminAppointmentListPage }))
);
const AdminJobCardListPage = React.lazy(() =>
  import('@/features/admin/pages/AdminJobCardListPage').then((m) => ({ default: m.AdminJobCardListPage }))
);
const AdminInventoryPage = React.lazy(() =>
  import('@/features/admin/pages/AdminInventoryPage').then((m) => ({ default: m.AdminInventoryPage }))
);
const AdminInvoiceListPage = React.lazy(() =>
  import('@/features/admin/pages/AdminInvoiceListPage').then((m) => ({ default: m.AdminInvoiceListPage }))
);
const AdminReportsPage = React.lazy(() =>
  import('@/features/admin/pages/AdminReportsPage').then((m) => ({ default: m.AdminReportsPage }))
);
const AdminAuditPage = React.lazy(() =>
  import('@/features/admin/pages/AdminAuditPage').then((m) => ({ default: m.AdminAuditPage }))
);
const AdminSettingsPage = React.lazy(() =>
  import('@/features/admin/pages/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);
const AdminProfilePage = React.lazy(() =>
  import('@/features/admin/pages/AdminProfilePage').then((m) => ({ default: m.AdminProfilePage }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: (
      <Suspense fallback={<LazyFallback />}>
        <GuestOnlyRoute />
      </Suspense>
    ),
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<LazyFallback />}>
        <ProtectedRoute />
      </Suspense>
    ),
    children: [
      {
        path: '/app',
        element: <RoleRedirect />,
      },
      {
        path: '/account/security',
        element: <AccountSecurityPage />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<LazyFallback />}>
        <ProtectedRoute allowedRoles={['CUSTOMER']} />
      </Suspense>
    ),
    children: [
      {
        path: '/customer',
        element: <Navigate to="/customer/dashboard" replace />,
      },
      {
        path: '/customer/dashboard',
        element: <CustomerDashboardPage />,
      },
      {
        path: '/customer/vehicles',
        element: <VehicleListPage />,
      },
      {
        path: '/customer/vehicles/new',
        element: <AddVehiclePage />,
      },
      {
        path: '/customer/vehicles/:vehicleId',
        element: <VehicleDetailPage />,
      },
      {
        path: '/customer/appointments',
        element: <AppointmentListPage />,
      },
      {
        path: '/customer/appointments/new',
        element: <BookAppointmentPage />,
      },
      {
        path: '/customer/appointments/:appointmentId',
        element: <AppointmentDetailPage />,
      },
      {
        path: '/customer/service/:jobCardId',
        element: <ActiveServicePage />,
      },
      {
        path: '/customer/invoices',
        element: <InvoiceListPage />,
      },
      {
        path: '/customer/invoices/:invoiceId',
        element: <InvoiceDetailPage />,
      },
      {
        path: '/customer/profile',
        element: <CustomerProfilePage />,
      },
      {
        path: '/customer/roadside',
        element: <RoadsideAssistancePage />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<LazyFallback />}>
        <ProtectedRoute allowedRoles={['MANAGER']} />
      </Suspense>
    ),
    children: [
      {
        path: '/manager',
        element: <ManagerDashboardPage />,
      },
      {
        path: '/manager/dashboard',
        element: <Navigate to="/manager" replace />,
      },
      {
        path: '/manager/appointments',
        element: <ManagerAppointmentListPage />,
      },
      {
        path: '/manager/appointments/:appointmentId',
        element: <ManagerAppointmentDetailPage />,
      },
      {
        path: '/manager/team',
        element: <ManagerTeamPage />,
      },
      {
        path: '/manager/job-cards',
        element: <ManagerJobCardListPage />,
      },
      {
        path: '/manager/job-cards/:jobCardId',
        element: <ManagerJobCardDetailPage />,
      },
      {
        path: '/manager/inventory',
        element: <ManagerInventoryPage />,
      },
      {
        path: '/manager/invoices',
        element: <ManagerInvoiceListPage />,
      },
      {
        path: '/manager/invoices/:invoiceId',
        element: <ManagerInvoiceDetailPage />,
      },
      {
        path: '/manager/reports',
        element: <ManagerReportsPage />,
      },
      {
        path: '/manager/activity',
        element: <ManagerActivityPage />,
      },
      {
        path: '/manager/profile',
        element: <ManagerProfilePage />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<LazyFallback />}>
        <ProtectedRoute allowedRoles={['MECHANIC']} />
      </Suspense>
    ),
    children: [
      {
        path: '/mechanic',
        element: <MechanicDashboardPage />,
      },
      {
        path: '/mechanic/dashboard',
        element: <Navigate to="/mechanic" replace />,
      },
      {
        path: '/mechanic/jobs',
        element: <MechanicJobListPage />,
      },
      {
        path: '/mechanic/jobs/:jobCardId',
        element: <MechanicJobDetailPage />,
      },
      {
        path: '/mechanic/completed',
        element: <MechanicCompletedJobsPage />,
      },
      {
        path: '/mechanic/profile',
        element: <MechanicProfilePage />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<LazyFallback />}>
        <ProtectedRoute allowedRoles={['ADMIN']} />
      </Suspense>
    ),
    children: [
      {
        path: '/admin',
        element: <AdminDashboardPage />,
      },
      {
        path: '/admin/dashboard',
        element: <Navigate to="/admin" replace />,
      },
      {
        path: '/admin/users',
        element: <AdminUserListPage />,
      },
      {
        path: '/admin/users/:userId',
        element: <AdminUserDetailPage />,
      },
      {
        path: '/admin/managers',
        element: <AdminManagerListPage />,
      },
      {
        path: '/admin/mechanics',
        element: <AdminMechanicListPage />,
      },
      {
        path: '/admin/teams',
        element: <AdminTeamStructurePage />,
      },
      {
        path: '/admin/appointments',
        element: <AdminAppointmentListPage />,
      },
      {
        path: '/admin/job-cards',
        element: <AdminJobCardListPage />,
      },
      {
        path: '/admin/inventory',
        element: <AdminInventoryPage />,
      },
      {
        path: '/admin/invoices',
        element: <AdminInvoiceListPage />,
      },
      {
        path: '/admin/reports',
        element: <AdminReportsPage />,
      },
      {
        path: '/admin/audit',
        element: <AdminAuditPage />,
      },
      {
        path: '/admin/settings',
        element: <AdminSettingsPage />,
      },
      {
        path: '/admin/profile',
        element: <AdminProfilePage />,
      },
    ],
  },
  {
    path: '/forbidden',
    element: (
      <Suspense fallback={<LazyFallback />}>
        <ForbiddenPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
