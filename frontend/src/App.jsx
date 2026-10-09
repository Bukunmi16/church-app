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
import UserDetails from './pages/users/UserDetails'
import ViewUsers from './pages/users/ViewUsers'
import Notifications from './pages/notifications/Notifications'
import NotificationDetails from './pages/notifications/NotificationDetails'
import Settings from './pages/Settings'
import EditTeaching from './pages/teachings/EditTeaching'
import TeachingSeries from './pages/teaching-series/TeachingSeries'
import CreateTeachingSeries from './pages/teaching-series/CreateTeachingSeries'
import TeachingSeriesDetails from './pages/teaching-series/TeachingSeriesDetails'
import EditTeachingSeries from './pages/teaching-series/EditTeachingSeries'

function App() {

  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* =========================
              SHARED RESOURCES
          ========================== */}

          {/* Services */}
          <Route path="services">
            <Route index element={<Services />} />
            <Route path=":serviceId" element={<ServiceDetails />} />
          </Route>
          
          
          {/* Teachings */}
          <Route path="teachings">
            <Route index element={<Teaching />} />
            <Route path=":teachingId" element={<TeachingDetails />} />
          </Route>
          
          
          {/* Teaching Series */}
          <Route path="teaching-series">
            <Route index element={<TeachingSeries />} />
            <Route path=":seriesId" element={<TeachingSeriesDetails />} />
          </Route>
          
          
          {/* Events */}
          <Route path="events">
            <Route index element={<Event />} />
            <Route path=":eventId" element={<EventDetails />} />
          </Route>
          
          
          {/* Departments */}
          <Route path="departments">
            <Route index element={<Department />} />
            <Route path=":departmentId" element={<DepartmentDetails />} />
          </Route>
          
          
          {/* Users */}
          <Route path="users">
            <Route index element={<ViewUsers />} />
            <Route path=":userId" element={<UserDetails />} />
          </Route>
          
          
          {/* Notifications */}
          <Route path="notifications">
            <Route index element={<Notifications />} />
            <Route path=":notificationId" element={<NotificationDetails />} />
          </Route>
          
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          
          
          {/* =========================
              ADMIN ONLY
          ========================== */}

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="admin">
              <Route index element={<Dashboard />} />
          
              {/* Management routes */}
              <Route path="services/new" element={<CreateService />} />
              <Route
                path="services/:serviceId/edit"
                element={<EditService />}
              />

              <Route path="teachings/new" element={<CreateTeaching />} />
              <Route
                path="teachings/:teachingId/edit"
                element={<EditTeaching />}
              />

              <Route
                path="teaching-series/new"
                element={<CreateTeachingSeries />}
              />
              <Route
                path="teaching-series/:seriesId/edit"
                element={<EditTeachingSeries />}
              />

              <Route path="events/new" element={<CreateEvent />} />
              <Route
                path="events/:eventId/edit"
                element={<EditEvent />}
              />

              <Route path="departments/new" element={<CreateDepartment />} />
              <Route
                path="departments/:departmentId/edit"
                element={<EditDepartment />}
              />
            </Route>
          </Route>
          
          
          {/* =========================
              WORKER
          ========================== */}

          <Route element={<RoleRoute allowedRoles={["worker"]} />}>
            <Route path="worker">
              <Route index element={<WorkerDashboard />} />
            </Route>
          </Route>
          
          
          {/* =========================
              MEMBER
          ========================== */}

          <Route element={<RoleRoute allowedRoles={["member"]} />}>
            <Route path="member">
              {/* <Route index element={<MemberDashboard />} /> */}
            </Route>
          </Route>
          
        </Route>
      </Route>
    </Routes>

  )
}

export default App
