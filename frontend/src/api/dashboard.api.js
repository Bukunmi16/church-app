import api from './axios'

export const getAdminDashboard = async () => {
    const response = await api.get('/dashboard/admin')

    return response.data
}

export const getWorkerDashboard = async () => {
    const response = await api.get('/dashboard/worker')

    return response.data
}

export const getMemberDashboard = async () => {
    const response = await api.get('/dashboard/member')

    return response.data
}