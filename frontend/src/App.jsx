import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import MainLayout from './components/layout/MainLayout';

const HomePage           = lazy(() => import('./pages/HomePage'));
const ShopPage           = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage  = lazy(() => import('./pages/ProductDetailPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));
const AdminPage          = lazy(() => import('./pages/AdminPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-medium">Loading ToyAlfa…</p>
      </div>
    </div>
  );
}

function AdminRoute({ children }) {
  const { isLoggedIn, user } = useAuthStore();
  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification System */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          },
          success: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"            element={<HomePage />} />
            <Route path="/shop"        element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}