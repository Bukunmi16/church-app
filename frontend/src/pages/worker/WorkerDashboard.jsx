import useAuthStore from '@/stores/auth.store'
import React from 'react'

const WorkerDashboard = () => {
    const user  = useAuthStore((state) => state.user)
    
  return (
    <div>Welcome { user.name }</div>
  )
}

export default WorkerDashboard