import { getUserNotifications, markAllAsRead, getOneNotification, markAsRead, deleteNotification, getUnreadNotificationCount, deleteManyNotifications } from "./notification.service.js"

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await getUserNotifications(req.query, req.user._id)
        
        res.status(200).json({
            message: "All Notifications Fetched Successfully",
            notifications
        })
    } catch (error) {
        next(error)
    }
}

export const viewNotification = async (req, res, next) => {
    const notification = await getOneNotification(req.params.id, req.user._id)

    res.status(200).json({
        message: 'One Notification Displayed',
        notification
    })
}

export const readNotification = async (req, res, next) => {
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

export const readAllNotifications = async (req, res, next) => {
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

export const removeNotification = async (req, res, next) => {
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
export const removeManyNotifications = async (req, res, next) => {
    try {
    
        const { notificationIds } = req.body;
        const userId = req.user._id

        if(!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "NotificationIds are required" 
            });
        }

        const result = await deleteManyNotifications(notificationIds, userId)
    
        res.status(200).json({
            success: true,
            message: `${result.deletedCount} notification(s) Deleted Successfully"`,
            deletedCount: result.deletedCount
        })

    } catch (error) {
     next(error)   
    }
}

export const countUnreadNotifications = async (req, res, next) => {
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