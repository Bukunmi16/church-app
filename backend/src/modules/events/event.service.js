import Event from "./event.model.js"

export const createEvent = async (data, userId) => {
    const {title, description, startTime, startDate, endDate, location, host, guestMinisters, endTime, image } = data
    
    const eventCreatorId = userId
    
    if(new Date(endDate) < new Date(startDate)){
        throw new Error('End Date cannot be before Start Date')
    }
    
    const guests = guestMinisters ?? []
    const uniqueGuestMinisters = [...new Set(guests)];
    
    if (uniqueGuestMinisters.length !== guestMinisters.length) {
    throw new Error("Guest ministers cannot be duplicated");
    }
    
    const event = await Event.create({
        title: title,
        image: image,
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

export const getOneEvent = async (EventId) => {
    const event = await Event.findById(EventId)
    
    if(!event) {
        throw new Error('Event not found')
    }
    
    return event
}

export const updateEvent = async (EventId, data) => {
    const event = await Event.findById(EventId)
    
    if(!event){
        throw new Error('Event not found')
    }
    
    const {title, description, startTime, startDate, endDate, location, host, guestMinisters, endTime, image} = data

    
    if(new Date(endDate) < new Date(startDate)){
        throw new Error('End Date cannot be before Start Date')
    }

    const guests = guestMinisters ?? []
    const uniqueGuestMinisters = [...new Set(guests)];

    if (uniqueGuestMinisters.length !== guestMinisters.length) {
      throw new Error("Guest ministers cannot be duplicated");
    }


    if(title) event.title = title
    if(description !== undefined) event.description = description
    if(image !== undefined) event.image = image
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

    await event.findByIdAndDelete(EventId)

    return event
}