import api from "./axios";

export const createDepartment = async (data) => {
    const response = await api.post('/departments', data)

    return response
}

export const getDepartments = async () => {
    const response = await api.get('/departments')

    return response
}


export const getOneDepartment = async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}`)

    return response 
}

export const updateDepartment = async (departmentId, data) => {
    const response = await api.post(`/departments/${departmentId}`, data)

    return response
}

export const deleteDepartment = async (departmentId) => {
    const response = await api.delete(`/departments/${departmentId}`)

    return response
}

//Relationships

export const assignLeader = async (departmentId, userId) => {
    const response = await api.patch(`/departments/${departmentId}/leader`, {userId})

    return response
}

export const assignWorker = async (departmentId, userId) => {
    const response = await api.post(`/departments/${departmentId}/worker`, {userId})

    return response
}

export const assignAssistant = async (departmentId, userId) => {
    const response = await api.post(`/departments/${departmentId}/assistant`, {userId})

    return response
}

export const removeWorker = async (departmentId, userId) => {
    const response = await api.delete(`/departments/${departmentId}/worker/${userId}`)

    return response
}

export const removeAssistant = async (departmentId, userId) => {
    const response = await api.delete(`/departments/${departmentId}/assistant/${userId}`)

    return response
}
