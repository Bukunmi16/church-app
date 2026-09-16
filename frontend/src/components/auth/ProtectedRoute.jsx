import useAuthStore from '@/stores/auth.store'
import React from 'react'
import { Navigate, Outlet } from 'react-router'
import LoadingScreen from '../ui/Loading'

const ProtectedRoute = () => {
  
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isInitialized = useAuthStore((state) => state.isInitialized)

    if (!isInitialized) {
        return <LoadingScreen/>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

  return <Outlet/> 
}

export default ProtectedRoute