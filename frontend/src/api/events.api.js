import api from './axios'

export const getEvents = async (params = {}) => {
    const response = await api.get('/events', {params})

    return response
}

export const getOneEvent = async (id) => {
    const response = await api.get(`/events/${id}`)

    return response
}

export const createEvent = async (data) => {
    const response = await api.post('/events', data)

    return response 
}

export const updateEvent = async (id, data) => {
    const response = await api.post(`/events/${id}`, data)

    return response 
}

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`)

    return response
}