import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/marketing/LandingPage';

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
import { LazyFallback } from '@/components/ui/LazyFallback';

// Lazy-load authentication & protected route bundles so landing page initial payload remains minimal

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
        element: <RoleEntryPage roleTitle="Customer" />,
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
