// apps/web/app/dashboard/page.tsx
import ProtectedRoute from '../../components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1 className="text-2xl">Your Dashboard</h1>
      {/* ...rest of your protected UI... */}
    </ProtectedRoute>
  )
}
