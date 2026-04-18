import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import TournamentsPage from './pages/TournamentsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AdminPage from './pages/AdminPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { loadMe } = useAuthStore()

  useEffect(() => { loadMe() }, [loadMe])

  return (
    <Routes>
      {/* Auth — standalone layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin — protected, standalone layout */}
      <Route path="/admin" element={
        <ProtectedRoute vendorOrAdmin>
          <AdminPage />
        </ProtectedRoute>
      } />

      {/* Public pages — shared layout with Navbar + Footer */}
      <Route path="/*" element={
        <div className="min-h-screen bg-offwhite flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}
