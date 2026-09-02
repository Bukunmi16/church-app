import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js"
import Event from "./event.model.js"

export const createEvent = async (data, userId, file) => {

    let imageData = null

    if(file){
        imageData = await uploadToCloudinary(
            file.buffer, 
            "church-app/events"
        )
    }

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

    return event.populate("createdBy", "name role")
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