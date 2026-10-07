import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, makeLeader, makeWorker, makeAssistant, deleteAssistant, deleteWorker, removeDepartment } from "./department.service.js"

export const create = async (req, res, next) => {
    try {
        const department = await createDepartment(req.body, req.file)

        res.status(200).json({
            success: true,
            message: 'Department Created Successfully',
            department 
        })
    } catch (error) {
    return res.status(400).json({
        success: false,
        message: error.message
    })
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
    return res.status(400).json({
        success: false,
        message: error.message
    });        
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
        return res.status(400).json({
        success: false,
        message: error.message
    });
    }
}

export const update = async (req, res, next) => {
    try {
        const department = await updateDepartment(req.params.id, req.body, req.file)
        
        res.status(200).json({
            success: true,
            message: "Department Updated Successfully",
            department
        })        
        
    } catch (error) {
    return res.status(400).json({
        success: false,
        message: error.message
    });
}
}

export const deleteDepartment = async (req, res, next) => {
    try {
        const department = await removeDepartment(req.params.id)
        
        res.status(200).json({
            success: true,
            message: 'Department Deleted Successfully',
            department
        })        
    } catch (error) {
    return res.status(400).json({
        success: false,
        message: error.message
    });
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
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
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}