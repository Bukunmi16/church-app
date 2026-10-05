import api from "./axios";

export const getUsers = async (params = {}) => {
    const response = await api.get('/users', {params})

    return response
}

export const getOneUser = async (userId) => {
    const response = await api.get(`/users/${userId}`)

    return response
}

export const updateUserStatus = async (userId) => {
    const response = await api.patch(`/users/${userId}/status`)

    return response
}

export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, role)

    return response
}

export const deleteUser = async (userId) => {
    const response = await api.patch(`/users/${userId}`)

    return response
}