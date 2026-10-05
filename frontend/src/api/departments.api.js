import api from "./axios";

export const createDepartment = (data) => {
    const response = api.post('/departments', data)

    return response
}

export const getDepartments = () => {
    const response = api.get('/departments')

    return response 
}

export const getOneDepartment = (departmentId) => {
    const response = api.get(`/departments/${departmentId}`)

    return response 
}

export const updateDepartment = (departmentId, data) => {
    const response = api.post(`/departments/${departmentId}`, data)

    return response
}

export const deleteDepartment = (departmentId) => {
    const response = api.delete(`/departments/${departmentId}`)

    return response
}

//Relationships

export const assignLeader = (departmentId, userId) => {
    const response = api.patch(`/departments/${departmentId}/leader`, {userId})

    return response
}

export const assignWorker = (departmentId, userId) => {
    const response = api.post(`/departments/${departmentId}/worker`, {userId})

    return response
}

export const assignAssistant = (departmentId, userId) => {
    const response = api.post(`/departments/${departmentId}/assistant`, {userId})

    return response
}

export const removeWorker = (departmentId, userId) => {
    const response = api.delete(`/departments/${departmentId}/worker/${userId}`)

    return response
}

export const removeAssistant = (departmentId, userId) => {
    const response = api.delete(`/departments/${departmentId}/assistant/${userId}`)

    return response
}
