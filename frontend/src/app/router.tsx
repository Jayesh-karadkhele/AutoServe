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
const RoleEntryPage = React.lazy(() =>
  import('@/features/auth/routing/RoleEntryPage').then((m) => ({ default: m.RoleEntryPage }))
);
const ForbiddenPage = React.lazy(() =>
  import('@/features/auth/routing/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage }))
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
        path: '/manager/dashboard',
        element: <RoleEntryPage roleTitle="Manager" />,
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
        path: '/mechanic/dashboard',
        element: <RoleEntryPage roleTitle="Mechanic" />,
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
        path: '/admin/dashboard',
        element: <RoleEntryPage roleTitle="Admin" />,
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
