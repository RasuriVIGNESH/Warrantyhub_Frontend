import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { LoadingScreen } from './components/ui/LoadingScreen';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Devices = lazy(() => import('./pages/Devices').then(m => ({ default: m.Devices })));
const AddDevice = lazy(() => import('./pages/AddDevice').then(m => ({ default: m.AddDevice })));
const DeviceDetail = lazy(() => import('./pages/DeviceDetail').then(m => ({ default: m.DeviceDetail })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const UpdateProfile = lazy(() => import('./pages/UpdateProfile').then(m => ({ default: m.UpdateProfile })));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      cacheTime: 0, // Disable caching
      staleTime: 0, // Consider data stale immediately
    },
  },
});

// Clear any existing cache
queryClient.clear();

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Login />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <Register />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <ForgotPassword />
            </Suspense>
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <Suspense fallback={<LoadingScreen />}>
              <ResetPassword />
            </Suspense>
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingScreen />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/devices" element={
            <Suspense fallback={<LoadingScreen />}>
              <Devices />
            </Suspense>
          } />
          <Route path="/devices/new" element={
            <Suspense fallback={<LoadingScreen />}>
              <AddDevice />
            </Suspense>
          } />
          <Route path="/devices/:id" element={
            <Suspense fallback={<LoadingScreen />}>
              <DeviceDetail />
            </Suspense>
          } />
          <Route path="/profile" element={
            <Suspense fallback={<LoadingScreen />}>
              <Profile />
            </Suspense>
          } />
          <Route path="/profile/edit" element={
            <Suspense fallback={<LoadingScreen />}>
              <UpdateProfile />
            </Suspense>
          } />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingScreen />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
