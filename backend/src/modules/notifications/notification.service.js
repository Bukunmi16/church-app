import Notification from "./notification.model.js";
import User from "../user/user.model.js";
import buildFilter from "../../utils/buildFilter.js";
import getPagination from "../../utils/pagination.js";
import { notificationQueryConfig } from "../../config/queryConfig.js";

export const createNotification = async (data) => {
    const {recipient, title, message, type, relatedId, relatedModel} = data 

    const notification = await Notification.create({
        recipient, title, message, type, relatedId, relatedModel
    })

    return notification
}

export const getUserNotifications = async (query, userId) => {
    const {page, limit, skip} = getPagination(query)
    
    const {filter, sort} = buildFilter({query, ...notificationQueryConfig})

    const notificationFilter = {
        recipient: userId,
        ...filter
    }

    const [ notifications, totalItems] = await Promise.all([
     Notification.find(notificationFilter)
        .skip(skip)  
        .limit(limit)
        .sort(sort)
        .lean(),

        Notification.countDocuments(notificationFilter)
    ]) 

    const totalPages = Math.ceil(totalItems/limit)


    return {
        notifications,
        pagination:{
            currentPage: page,
            totalPages,
            totalItems,
            limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1 
        }
    }
}

export const getOneNotification = async (notificationId, userId) => {
    const notifications = await Notification.findOne({recipient: userId, _id: notificationId})

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

export const deleteManyNotifications = async (notificationIds, userId) => {
    const result = await Notification.deleteMany({
        _id: { $in: notificationIds },
        recipient: userId,
    })

    return {
        deletedCount: result.deletedCount,
    }
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