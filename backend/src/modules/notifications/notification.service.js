import Notification from "./notification.model.js";
import User from "../user/user.model.js";

export const createNotification = async (data) => {
    const {recipient, title, message, type, relatedId, relatedModel} = data 

    const notification = await Notification.create({
        recipient, title, message, type, relatedId, relatedModel
    })

    return notification
}

export const getUserNotifications = async (userId) => {
    const notifications = await Notification.find({recipient: userId}).sort({createdAt: -1})

    return notifications
}

export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId 
    })
    
    if(!notification) {
        throw new Error("Notification not found") 
    }

    notification.isRead = true

    await notification.save()

    return notification
}

export const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        {
            recipient: userId,
            isRead: false
        },
        {
            $set: {isRead: true}
        }
    )

    return result
}

export const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    })

    if (!notification) {
        throw new Error("Notification not Found")
    }

    await Notification.findByIdAndDelete(notificationId)

    return notification
}

export const notifyAllActiveUsers = async ({ title, message, type, relatedId = null, relatedModel = null}) => {
     
    const users = await User.find({
        isActive: true 
     }).select("_id")

    if (users.length === 0) return
 
    
    const notifications = users.map((user) => ({
        recipient: user._id,
        title, 
        message,
        type,
        relatedId,
        relatedModel
    }))

    return await Notification.insertMany(notifications)
}

export const getUnreadNotificationCount = async (userId) => {
    const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false
    })

    return count        
}