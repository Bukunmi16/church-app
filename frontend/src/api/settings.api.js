import api from "./axios"

export const getProfile = async () => {
    const user = await api.get('/auth/me')

    return user
} 

export const updateProfile = async (data) => {
    const user = await api.patch('/users/me', data)

    return user
} 

export const updatePassword = async (data) => {
    const response = await api.patch('/users/me/password', data)
 
    return response
} 

export const getChurchInfo = async () => {
    const churchInfo = await api.get('/church-info')

    return churchInfo
} 

export const updateChurchInfo = async (data) => {
    const churchInfo = await api.patch('/church-info', data)

    return churchInfo
} 