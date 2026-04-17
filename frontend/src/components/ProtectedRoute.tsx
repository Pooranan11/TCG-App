import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
  vendorOrAdmin?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false, vendorOrAdmin = false }: Props) {
  const { user, token } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />
  if (vendorOrAdmin && user.role !== 'ADMIN' && user.role !== 'VENDOR') return <Navigate to="/" replace />

  return <>{children}</>
}
