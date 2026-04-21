import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Props {
  children: React.ReactNode
  vendorOrAdmin?: boolean
}

export default function ProtectedRoute({ children, vendorOrAdmin = false }: Props) {
  const { user, token } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" replace />
  if (vendorOrAdmin && user.role !== 'ADMIN' && user.role !== 'VENDOR') return <Navigate to="/" replace />

  return <>{children}</>
}
