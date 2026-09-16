import React from 'react'
import useAuthStore from '@/stores/auth.store'
import { Navigate, Outlet } from 'react-router'

const RoleRoute = ({allowedRoles}) => {
  const user = useAuthStore((state) => state.user)

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default RoleRoute