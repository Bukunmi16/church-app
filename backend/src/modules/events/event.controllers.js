import { createEvent, getAllEvents, getOneEvent, removeEvent, updateEvent } from "./event.service.js"


export const create = async (req, res, next) => {
    try {
        const event = await createEvent(req.body, req.user.id)

        res.status(200).json({
            sucess: true,
            message: "Event Created Successfully",
            event
        })

    } catch (error) {
        next(error)
    }
} 

export const getAll = async (req, res, next) => {
    try {
        const Events = await getAllEvents()

        res.status(200).json({
        sucess: true,
        message: "All Events Fetched Successfully",
        Events
        })
    } catch (error) {
        next(error)
    }
} 

export const getOne = async (req, res, next) => {
    try {
        const Event = await getOneEvent(req.params.id)
        
        res.status(200).json({
        sucess: true,
        message: "Event Fetched Successfully",
        Event
        })    
    } catch (error) {
        next(error)
    }
} 

export const update = async (req, res, next) => {
    try {
        const Event = await updateEvent(req.params.id, req.body)
        
        res.status(200).json({
        sucess: true,
        message: "Event Updated Successfully",
        Event
        })
    } catch (error) {
        next(error)
    }
} 

export const deleteEvent = async (req, res, next) => {
    try {
        const Event = await removeEvent(req.params.id)

        res.status(200).json({
        sucess: true,
        message: "Event Deleted Successfully",
        Event
        })      
    } catch (error) {
        next(error)
    }
} 