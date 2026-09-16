import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Routes, Route } from 'react-router'
import DashboardLayout from '@/components/layout.jsx/DashboardLayout'
import Dashboard from '@/pages/admin/Dashboard'
import Services from './pages/admin/Services'
import useAuthStore from './stores/auth.store'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import MemberDashboard from './pages/member/MemberDashboard'
import RoleRoute from './components/auth/RoleRoute'
import Unauthorized from './pages/errors/Unauthorized'

function App() {

  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute/>}>
      <Route element={<RoleRoute allowedRoles={['admin']} />}>
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/teachings" element={<Services />} />
        <Route path="/admin/events" element={<Services />} />
        <Route path="/admin/departments" element={<Services />} />
        <Route path="/admin/members" element={<Services />} />
        <Route path="/admin/notifications" element={<Services />} />
        <Route path="/admin/settings" element={<Services />} />
      </Route>
      </Route>

      <Route path="/worker" element={<WorkerDashboard/>}></Route>
      <Route path="/member" element={<MemberDashboard/>}></Route>
      </Route>
    </Routes>
  )
}

export default App
