import Service from "./service.model.js"
import Teaching from "../teachings/teaching.model.js"
import {uploadToCloudinary, deleteFromCloudinary} from '../../utils/cloudinary.js'
import { defaultImages } from "../../config/defaultImages.js";
import { notifyAllActiveUsers } from "../notifications/notification.service.js";

import { emailAllActiveUsers } from "../email/email.service.js"
import { emailTemplateCreate, emailTemplateUpdate } from "../../utils/email.js"


export const createService = async (data, file) => {

    const imageData = file
    ? await uploadToCloudinary(file.buffer, "church-app/services")
    : {
      url: defaultImages.event,
      publicId: null,
    };
    
    const {title, theme, preacher, serviceType, description, day, date, startTime, endTime} = data

    const service = await Service.create({
        title,
        theme,
        preacher,
        serviceImage: imageData,
        serviceType,
        description,
        day,
        date,
        startTime,
        endTime
    })

    await notifyAllActiveUsers({
        title: "New Service",
        message: `${service.title} has been added to the Church's calender`,
        type: "service",
        relatedId: service._id, 
        relatedModel: "Service"
    })

    await emailAllActiveUsers({
        subject: `New Service: ${service.title}`,
        html: emailTemplateCreate({
            title: service.title,
            relatedModel: "Service",
            description: service.description,
            image: service.serviceImage?.url
        })
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

    const teachings = await Teaching.find({service : serviceId})
    .populate("service", "title date day")
    .populate("department", "name")
    .populate("createdBy", "name role");
    

    return {service, teachings}
}

export const updateService = async (serviceId, data, file) => {
    const service = await Service.findById(serviceId)

    if(!service){
        throw new Error('Service not found')
    }

    if(file){
        if(service.serviceImage?.publicId){
            await deleteFromCloudinary(service.serviceImage.publicId)
        }

    const imageData = await uploadToCloudinary(
            file.buffer,
            "church-app/services"
        )

        service.serviceImage =  imageData
    }


    const { title, theme, preacher, serviceType, description,
        day, date, startTime, endTime } = data

    if(title) service.title = title
    if(theme) service.theme = theme
    if(preacher) service.preacher = preacher
    if(serviceType) service.serviceType = serviceType
    if(description !== undefined) service.description = description
    if(day) service.day = day
    if(date) service.date = date
    if(startTime) service.startTime = startTime
    if(endTime) service.endTime = endTime

    await service.save()
    
    await notifyAllActiveUsers({
        title: "Service Updated",
        message: `${service.name} details has been updated. Check the service details for the latest information`,
        type: "service",
        relatedId: service._id,
        relatedModel: "Service",
    })

    await emailAllActiveUsers({
        subject: `Service Updated: ${service.title}`,
        html: emailTemplateUpdate({
            title: service.title,
            relatedModel: "Service",
            description: service.description,
            image: service.serviceImage?.url,   
        })
    })
    
    return service
}

export const removeService = async (serviceId) => {
    const service = await Service.findById(serviceId)

    if(!service){
        throw new Error('Service not found')
    }

    if(service.serviceImage?.publicId){
        await deleteFromCloudinary(service.serviceImage.publicId)
    }

    await Service.findByIdAndDelete(serviceId)

    return service
}