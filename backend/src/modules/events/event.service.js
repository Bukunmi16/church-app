import { defaultImages } from "../../config/defaultImages.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js"
import Event from "./event.model.js"
import User from "../user/user.model.js";
import Notification from "../notifications/notification.model.js";
import { notifyAllActiveUsers } from "../notifications/notification.service.js";

import { emailAllActiveUsers } from "../email/email.service.js"
import { emailTemplateCreate, emailTemplateUpdate } from "../../utils/email.js"


export const createEvent = async (data, userId, file) => {

    const imageData = file
    ? await uploadToCloudinary(file.buffer, "church-app/events")
    : {
      url: defaultImages.event,
      publicId: null,
    };

    const {title, description, startTime, startDate, endDate, location, host, guestMinisters, endTime } = data
    
    const eventCreatorId = userId
    
    if(new Date(endDate) < new Date(startDate)){
        throw new Error('End Date cannot be before Start Date')
    }
    
    const guests = (guestMinisters ?? "")
      .split(",")
      .map(name => name.trim())
      .filter(name => name.length > 0); // removes empty strings from trailing commas etc.
    
    const uniqueGuestMinisters = [...new Set(guests)];
    
    if (uniqueGuestMinisters.length !== guests.length) {
      throw new Error("Guest ministers cannot be duplicated");
    }
    
    const event = await Event.create({
        title: title,
        image: imageData,
        description: description,
        startTime: startTime, 
        startDate: startDate, 
        endDate: endDate, 
        location: location, 
        host: host, 
        guestMinisters: uniqueGuestMinisters,
        endTime: endTime,
        createdBy: eventCreatorId
    })

    await event.populate("createdBy", "name role")


    await notifyAllActiveUsers({
        title: "New Event",
        message: `${event.title} has been added to the Church calender`,
        type: "event",
        relatedId: event._id, 
        relatedModel: "Event"
    })

    await emailAllActiveUsers({
        subject: `New Event: ${event.title}`,
        html: emailTemplateCreate({
            title: event.title,
            relatedModel: "Event"
        })
    })


    return event
}

export const getAllEvents = async () => {
    const events = await Event.find().sort({ startDate: 1 });
    
    return events
}

export const getOneEvent = async (eventId) => {
    const event = await Event.findById(eventId)
    
    if(!event) {
        throw new Error('Event not found')
    }
    
    return event
}

export const updateEvent = async (eventId, data, file) => {
    const event = await Event.findById(eventId)
    
    if(!event){
        throw new Error('Event not found')
    }
    
    const {title, description, startTime, startDate, endDate, location, host, guestMinisters, endTime} = data


    if(new Date(endDate) < new Date(startDate)){
        throw new Error('End Date cannot be before Start Date')
    }

    const guests = (guestMinisters ?? "")
      .split(",")
      .map(name => name.trim())
      .filter(name => name.length > 0); // removes empty strings from trailing commas etc.

    const uniqueGuestMinisters = [...new Set(guests)];

    if (uniqueGuestMinisters.length !== guests.length) {
      throw new Error("Guest ministers cannot be duplicated");
    }
    
    if(file){
        if(event.image?.publicId){
            await deleteFromCloudinary(event.image.publicId)
        }

        const imageData = await uploadToCloudinary(
            file.buffer,
            "church-app/events"
        )

        event.image =  imageData
    }


    if(title) event.title = title
    if(description !== undefined) event.description = description
    if(startTime) event.startTime = startTime
    if(startDate) event.startDate = startDate
    if(endDate) event.endDate = endDate
    if(location) event.location = location
    if(host) event.host = host
    if(guestMinisters !== undefined) event.guestMinisters = uniqueGuestMinisters
    if(endTime) event.endTime = endTime

    await event.save()

    await notifyAllActiveUsers({
        title: "Event Updated",
        message: `${event.name} details has been updated. Check the event details for the latest information`,
        type: "event",
        relatedId: event._id,
        relatedModel: "Event",
    })

    await emailAllActiveUsers({
        subject: `Event Updated: ${event.title}`,
        html: emailTemplateUpdate({
            title: event.title,
            relatedModel: "Event"
        })
    })

    return event
}

export const removeEvent = async (eventId) => {
    const event = await Event.findById(eventId)
    
    if(!event){
        throw new Error('Event not found')
    }
    
    if(event.image?.publicId){
        await deleteFromCloudinary(event.image.publicId)
    }

    await Event.findByIdAndDelete(eventId)

    return event
}