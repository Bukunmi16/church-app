import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Routes, Route } from 'react-router'
import DashboardLayout from '@/components/layout.jsx/DashboardLayout'
import Dashboard from '@/pages/admin/Dashboard'
import Services from './pages/services/Services'
import useAuthStore from './stores/auth.store'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import MemberDashboard from './pages/member/MemberDashboard'
import RoleRoute from './components/auth/RoleRoute'
import Unauthorized from './pages/errors/Unauthorized'
import ServiceDetails from './pages/services/ServiceDetails'
import CreateService from './pages/services/CreateService'
import EditService from './pages/services/EditService'
import Teaching from './pages/teachings/Teaching'
import CreateTeaching from './pages/teachings/CreateTeaching'
import TeachingDetails from './pages/teachings/TeachingDetails'
import Event from './pages/events/Event'
import CreateEvent from './pages/events/CreateEvent'
import EventDetails from './pages/events/EventDetails'
import EditEvent from './pages/events/EditEvent'
import Department from './pages/departments/Department'
import CreateDepartment from './pages/departments/CreateDepartment'
import DepartmentDetails from './pages/departments/DepartmentDetails'
import EditDepartment from './pages/departments/EditDepartment'
import MemberDetails from './pages/member/MemberDetails'
import ViewMembers from './pages/member/ViewMembers'
import Notifications from './pages/notifications/Notifications'
import CreateNotification from './pages/notifications/CreateNotification'
import NotificationDetails from './pages/notifications/NotificationDetails'
import EditNotification from './pages/notifications/EditNotification'
import Settings from './pages/Settings'

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

        <Route path="services">
        <Route index element={<Services />}/>
        <Route path="new" element={<CreateService />} />
        <Route path=":serviceId" element={<ServiceDetails />} />
        <Route path=":serviceId/edit" element={<EditService />} />
        </Route>

        <Route path="teachings" >
        <Route index element={<Teaching />} />
        <Route path="new" element={<CreateTeaching />} />
        <Route path=":teachingId" element={<TeachingDetails />} />
        <Route path=":teachingId/edit" element={<Teaching />} />
        </Route>

        <Route path="events" >
        <Route index element={<Event />} />
        <Route path="new" element={<CreateEvent />} />
        <Route path=":eventId" element={<EventDetails />} />
        <Route path=":eventId/edit" element={<EditEvent />} />
        </Route>

        <Route path="departments" >
        <Route index element={<Department />} />
        <Route path="new" element={<CreateDepartment />} />
        <Route path=":departmentId" element={<DepartmentDetails />} />
        <Route path=":departmentId/edit" element={<EditDepartment />} />
        </Route>

        <Route path="members" >
        <Route index element={<ViewMembers />} />
        <Route path=":memberId" element={<MemberDetails />} />
        <Route path=":memberId/edit" element={<MemberDetails />} />
        </Route>

        <Route path="notifications" >
        <Route index element={<Notifications />} />
        <Route path="new" element={<CreateNotification />} />
        <Route path=":teachingId" element={<NotificationDetails />} />
        <Route path=":teachingId/edit" element={<EditNotification />} />
        </Route>

        <Route path="settings" element={<Settings/>} />

      </Route>
      </Route>

      <Route path="/worker" element={<WorkerDashboard/>}></Route>
      <Route path="/member" element={<MemberDashboard/>}></Route>
      </Route>
    </Routes>
  )
}

export default App
