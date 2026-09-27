import api from "./axios";

export const getTeachingSeries = (params = {}) => {
    const response = api.get('/teaching-series', {params})

    return response
} 


export const getOneTeachingSeries = (id) => {
    const response = api.get(`/teaching-series/${id}`)

    return response
}

export const createTeachingSeries = (data) => {
    const response = api.post(`/teaching-series`, data)

    return response
}

export const updateTeaching = (id, data) => {
    const response = api.post(`/teaching-series/${id}`, data)

    return response.data
}

export const deleteTeaching = (id) => {
    const response = api.delete(`/teaching-series/${id}`)

    return response.data
}