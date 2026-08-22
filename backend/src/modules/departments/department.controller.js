import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, makeLeader } from "./department.service.js"

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
        const leader = await makeLeader(userId, req.params.id)

        res.status(200).json({
            success: true,
            message: `has been made the leader of the department`,
            leader
        })
    } catch (error) {
        
    }
}