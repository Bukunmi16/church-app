import { createService, getAllServices, getOneService, removeService, updateService } from "./service.service.js"


export const create = async (req, res, next) => {
    try {
        const service = await createService(req.body)

        res.status(200).json({
            sucess: true,
            message: "Service Created Successfully",
            service
        })

    } catch (error) {
        next(error)
    }
} 

export const getAll = async (req, res, next) => {
    try {
        const services = await getAllServices()

        res.status(200).json({
        sucess: true,
        message: "All Services Fetched Successfully",
        services
        })
    } catch (error) {
        next(error)
    }
} 

export const getOne = async (req, res, next) => {
    try {
        const service = await getOneService(req.params.id)
        
        res.status(200).json({
        sucess: true,
        message: "Service Fetched Successfully",
        service
        })    
    } catch (error) {
        next(error)
    }
} 

export const update = async (req, res, next) => {
    try {
        const service = await updateService(req.params.id, req.body)
        
        res.status(200).json({
        sucess: true,
        message: "Service Updated Successfully",
        service
        })
    } catch (error) {
        next(error)
    }
} 

export const deleteService = async (req, res, next) => {
    try {
        const service = await removeService(req.params.id)

        res.status(200).json({
        sucess: true,
        message: "Service Deleted Successfully",
        service
        })      
    } catch (error) {
        next(error)
    }
} 