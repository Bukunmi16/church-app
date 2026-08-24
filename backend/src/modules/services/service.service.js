import Service from "./service.model.js"

export const createService = async (data) => {
    const {title, theme, preacher, serviceType, description, day, date, startTime, endTime, serviceImage} = data

    const service = await Service.create({
        title,
        theme,
        preacher,
        serviceImage,
        serviceType,
        description,
        day,
        date,
        startTime,
        endTime
    })

    return service
}

export const getAllServices = async () => {
    const services = await Service.find().sort({ date: 1, startTime: 1 });

    return services
}

export const getOneService = async (serviceId) => {
    const service = await Service.findById(serviceId)

    if(!service) {
        throw new Error('Service not found')
    }

    return service
}

export const updateService = async (serviceId, data) => {
    const service = await Service.findById(serviceId)

    if(!service){
        throw new Error('Service not found')
    }

    const { title, theme, preacher, serviceImage, serviceType, description,
        day, date, startTime, endTime } = data

    if(title) service.title = title
    if(theme) service.theme = theme
    if(preacher) service.preacher = preacher
    if(serviceImage) service.serviceImage = serviceImage
    if(serviceType) service.serviceType = serviceType
    if(description !== undefined) service.description = description
    if(day) service.day = day
    if(date) service.date = date
    if(startTime) service.startTime = startTime
    if(endTime) service.endTime = endTime

    await service.save()

    return service
}

export const removeService = async (serviceId) => {
    const service = await Service.findById(serviceId)

    if(!service){
        throw new Error('Service not found')
    }

    await Service.findByIdAndDelete(serviceId)

    return service
}