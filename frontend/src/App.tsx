import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import TournamentsPage from './pages/TournamentsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { loadMe } = useAuthStore()

  useEffect(() => { loadMe() }, [loadMe])

  return (
    <Routes>
      {/* Auth — standalone layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin — protected, standalone layout */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
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
              <Route path="/tournaments" element={<TournamentsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}
