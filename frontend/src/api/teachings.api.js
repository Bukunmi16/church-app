import api from "./axios";

export const getTeachings = (params = {}) => {
    const response = api.get('/teachings', {params})

    return response.data
} 

export const getOneTeaching = (id) => {
    const response = api.get(`/teachings/${id}`)

    return response.data
}

export const createTeaching = (data) => {
    const response = api.post(`/teachings`, data)

    return response.data
}

export const updateTeaching = (id, data) => {
    const response = api.post(`/teachings/${id}`, data)

    return response.data
}

export const deleteTeaching = (id) => {
    const response = api.delete(`/teachings/${id}`)

    return response.data
}