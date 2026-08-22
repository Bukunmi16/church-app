import Department from "./department.model.js";
import User from "../user/user.model.js";

export const createDepartment = async (data) => {
    const {name, description, image} = data

    const existingDepartment = await Department.findOne({name})

    if(existingDepartment) {
        throw new Error('Department already exists')
    }

    const department = await Department.create({name, description, image})

    return department
}

export const getAllDepartments = async () => {
    return await Department.find()
    .populate("leader", "name email profileImg")
    .populate("assistants", "name email profileImg")
    .populate("workers", "name email profileImg")
    .sort({createdAt: -1})
}

export const getDepartmentById = async (departmentId) => {
    
    const department = await Department.findById(departmentId)
        .populate("leader", "name email profileImg")
        .populate("assistants", "name email profileImg")
        .populate("workers", "name email profileImg")
        .sort({createdAt: -1})

    if(!department){
        throw new Error('Department not found')
    }

    return department
}

export const updateDepartment = async (departmentId, data) => {
    const department = await Department.findById(departmentId)

    if(!department) {
        throw new Error('Department not found')
    }

    const {name, description, image} = data

    if(name) department.name = name
    if(description) department.description = description
    if(image !== undefined) department.image = image

    await department.save()

    return department
}

export const removerDepartment = async (departmentId) => {
    const department = await Department.findById(departmentId)
    if(!department){
        throw new Error('Department does not exist')
    }

    await Department.findByIdAndDelete(departmentId)
    
    return department
}

export const makeLeader = async (userId, departmentId) => {
    const department = await Department.findById(departmentId)
    
    if(!department) {
        throw new Error('Department not found')
    }

    const user = await User.findById(userId)

    if(!user){
        throw new Error('User not found')
    }

    if(!user.role !== 'worker){
        throw new Error('User is not a worker')}
        
}      