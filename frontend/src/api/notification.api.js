import api from "./axios";

export const getNotifications = (params = {}) => {
    const response = api.get('/notifications', {params} )

    return response
} 

export const countNotifications = (params = {}) => {
    const response = api.get('/notifications/unread-count')

    return response
} 

export const viewNotification = (notificationId) => {
    const response = api.get(`/notifications/${notificationId}`)

    return response
} 

export const readAllNotifications = () => {
    const response = api.patch(`/notifications/read-all`)

    return response
} 

export const readOneNotification = (notificationId) => {
    const response = api.patch(`/notifications/${notificationId}/read`)

    return response
} 

export const deleteNotification = (notificationId) => {
    const response = api.delete(`/notifications/${notificationId}`)

    return response
} 

export const deleteManyNotifications = (notificationIds) => {
    const response = api.delete('/notifications/bulk', { data: { notificationIds } })

    return response
} 
