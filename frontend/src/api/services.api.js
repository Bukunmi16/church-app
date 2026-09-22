import api from './axios'

export const getServices = async (params = {}) => {
    const services = await api.get('/services', {params})

    return services
}

export const getOneService = async (id) => {
    const response = await api.get(`/services/${id}`)

    return response.data
}

export const createService = async (data) => {
    const response = await api.post('/services', data)

    return response 
}

export const updateService = async (id, data) => {
    const response = await api.post(`/services/${id}`, data)

    return response 
}

export const deleteService = async (id) => {
    const response = await api.delete(`/services/${id}`)

    return response.data
}