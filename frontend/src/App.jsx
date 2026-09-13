import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Routes, Route } from 'react-router'
import DashboardLayout from '@/components/layout.jsx/DashboardLayout'
import Dashboard from '@/pages/admin/Dashboard'
import Services from './pages/admin/Services'

function App() {

  return (
    <Routes>
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
    </Routes>
  )
}

export default App
