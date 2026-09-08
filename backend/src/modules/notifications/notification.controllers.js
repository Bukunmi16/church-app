import { getUserNotifications, markAllAsRead, markAsRead, deleteNotification, getUnreadNotificationCount } from "./notification.service.js"

export const getNotifications = async (req, res) => {
    try {
        const notifications = await getUserNotifications(req.user)
        
        res.status(200).json({
            message: "All Notifications Fetched Successfully",
            notifications
        })
    } catch (error) {
        next(error)
    }
}

export const readNotification = async (req, res) => {
    try {
        const notification = await markAsRead(req.params.id, req.user._id)
        
        res.status(200).json({
            message: "Notification Marked as Read",
            notification
        })
    } catch (error) {
        next(error)
    }
}

export const readAllNotifications = async (req, res) => {
    try {
        const notification = await markAllAsRead(req.user._id)
        
        res.status(200).json({
            message: "All Notifications Marked as Read",
            notification
        })
    } catch (error) {
        next(error)
    }
}

export const removeNotification = async (req, res) => {
    try {
        const notification = await deleteNotification(req.params.id, req.user._id)
    
        res.status(200).json({
            message: "Notification Deleted Successfully",
            notification
        })

    } catch (error) {
     next(error)   
    }
}

export const countUnreadNotifications = async (req, res) => {
    try {
        const count = await getUnreadNotificationCount(req.user._id)
        
        res.status(200).json({
            success: true,
            count 
        })
    } catch (error) {
        next(error)
    }
} 