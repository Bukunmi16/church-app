import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, makeLeader, makeWorker, makeAssistant, deleteAssistant, deleteWorker } from "./department.service.js"

export const create = async (req, res, next) => {
    try {
        const department = await createDepartment(req.body)

        res.status(200).json({
            success: true,
            message: 'Department Created Successfully',
            department 
        })
    } catch (error) {
    next(error)    
}    
}

export const getAll = async (req, res, next) => {
    try {
        const departments = await getAllDepartments()

        res.status(200).json({
            success: true,
            departments
        })
        
    } catch (error) {
    next(error)        
    }
}

export const getOne = async (req, res, next) => {
    try {
        const department = await getDepartmentById(req.params.id)
        
        res.status(200).json({
            success: true,
            department
        })

    } catch (error) {
    next(error)        
}
}

export const update = async (req, res, next) => {
    try {
        const department = await updateDepartment(req.params.id, req.body)
        
        res.status(200).json({
            success: true,
            message: "Department Updated Successfully",
            department
        })        
        
    } catch (error) {
    next(error)            
}
}

export const deleteDepartment = async (req, res, next) => {
    try {
        const department = await removerDepartment(req.params.id)
        
        res.status(200).json({
            success: true,
            message: 'Department Deleted Successfully',
            department
        })        
    } catch (error) {
    next(error)    
    }
}

export const assignLeader = async (req, res, next) => {
    try {
        const {userId} = req.body
        const department = await makeLeader(userId, req.params.id)

        res.status(200).json({
            success: true,
            message: `User is now the leader of the ${department.name} Department`,
            department
        })
    } catch (error) {
        next(error)       
    }
}

export const assignWorker = async (req, res, next) => {
    try {
        const {userId} = req.body
        const department = await makeWorker(userId, req.params.id)

        res.status(200).json({
            success: true,
            message: `User is now a worker in the ${department.name} Department`,
            department
        })
    } catch (error) {
        next(error)       
    }
}

export const assignAssistant = async (req, res, next) => {
    try {
        const {userId} = req.body
        const department = await makeAssistant(userId, req.params.id)

        res.status(200).json({
            success: true,
            message: `User is now an Assistant in the ${department.name} Department`,
            department
        })
    } catch (error) {
        next(error)       
    }
}

export const removeWorker = async (req, res, next) => {
    try {
        const department = await deleteWorker( req.params.userId, req.params.id)

        res.status(200).json({
            success: true,
            message: `User has been removed from the Workers of the ${department.name} Department`,
            department
        })
    } catch (error) {
        next(error)       
    }
}

export const removeAssistant = async (req, res, next) => {
    try {
        const department = await deleteAssistant( req.params.userId, req.params.id)

        res.status(200).json({
            success: true,
            message: `User is been removed from the Assistant Heads of the ${department.name} Department`,
            department
        })
    } catch (error) {
        next(error)       
    }
}