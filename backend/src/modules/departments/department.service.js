import Department from "./department.model.js";
import User from "../user/user.model.js";
import {uploadToCloudinary, deleteFromCloudinary} from '../../utils/cloudinary.js'

export const createDepartment = async (data, file) => {
    let imageData = null
    
    if(file){
        imageData = await uploadToCloudinary(
            file.buffer, 
            "church-app/departments"
        )
    }

    const {name, description} = data

    const existingDepartment = await Department.findOne({name})

    if(existingDepartment) {
        throw new Error('Department already exists')
    }

    const department = await Department.create({name, description, image: imageData})

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

    if(!department){
        throw new Error('Department not found')
    }

    return department
}

export const updateDepartment = async (departmentId, data, file) => {
    const department = await Department.findById(departmentId)

    if(!department) {
        throw new Error('Department not found')
    }

    const {name, description} = data

    if(file){
        if(department.image?.publicId){
            await deleteFromCloudinary(department.image.publicId)
        }   

        const imageData = await uploadToCloudinary(
            file.buffer,
            "church-app/departments"
        )

        department.image =  imageData
    }


    if(name) department.name = name
    if(description) department.description = description

    await department.save()

    return department
}

export const removerDepartment = async (departmentId) => {
    const department = await Department.findById(departmentId)
    if(!department){
        throw new Error('Department does not exist')
    }

    if(department.image?.publicId){
        await deleteFromCloudinary(department.image.publicId)
    }

    await Department.findByIdAndDelete(departmentId)
    
    return department
}

// RELATIONSHIPS

export const makeLeader = async (userId, departmentId) => {
    const department = await Department.findById(departmentId)
    
    if(!department) {
        throw new Error('Department not found')
    }

    const user = await User.findById(userId)

    if(!user){
        throw new Error('User not found')
    }

    if(user.role !== 'worker'){
        throw new Error('User is not a worker')
    }
    const isWorker = department.workers.some(
    (worker) => worker.toString() === userId
    );
    
    if(!isWorker){
        throw new Error('User is not a part of this Department')
    }

    const isAssistant = department.assistants.some(
    (assistant) => assistant.toString() === userId
    );
    
    if(isAssistant){
        department.assistants.pull(userId)
    }
        
    department.leader = userId
    await department.save()
    
    return department.populate("leader", "name email profileImg")
}

export const makeWorker = async (userId, departmentId) => {
    const department = await Department.findById(departmentId)
    
    if(!department) {
        throw new Error('Department not found')
    }

    const user = await User.findById(userId)

    if(!user){
        throw new Error('User not found')
    }

    if(user.role !== 'worker'){
        throw new Error('User is not a worker')
    }

    const alreadyWorker = department.workers.some(
        (worker) => worker.toString() === userId
    );

    if(alreadyWorker){
        throw new Error('User is already a part of this department')
    }
    
    department.workers.push(user._id)
    await department.save()
    
    return department.populate("workers", "name email profileImg")
}

export const makeAssistant = async (userId, departmentId) => {
    const department = await Department.findById(departmentId)

    if(!department){
        throw new Error('Department not found')
    }

    const user = await User.findById(userId)

    if(!user){
        throw new Error('User not found')
    }

    if(user.role !== 'worker'){
        throw new Error('User is not a worker')
    }    

    const isWorker = department.workers.some(
      (worker) => worker.toString() === userId);

    if(!isWorker){
        throw new Error('User must be a worker in this department')
    }

    const isAssistant = department.assistants.some(
      (assistant) => assistant.toString() === userId);

    if(isAssistant){
        throw new Error('User is already an Assistant')
    }

    if(department.leader?.toString() === userId)  {
        throw new Error('Request rejected. A user cannot be both an assistant and a leader')
    }

    department.assistants.push(userId)
    await department.save()

    return department.populate("assistants", "name email profileImg" )
}

export const deleteWorker = async (userId, departmentId) => {
    const department = await Department.findById(departmentId)

    if(!department){
        throw new Error('Department not found')
    }

    const user = await User.findById(userId)

    if(!user){
        throw new Error('User is not a worker')
    }

    const isWorker = department.workers.some(
    (worker) => worker.toString() === userId
    );

    if(!isWorker){
        throw new Error('User is not a worker')
    }
    
    if(department.leader?.toString() === userId){
        department.leader = null
    }
    
    // Remove from Assistants  
    const isAssistant = department.assistants.some(
    (assistant) => assistant.toString() === userId
    );

    if(isAssistant){
        department.assistants.pull(userId)
    }

    department.workers.pull(userId)
    await department.save()

    return department.populate("workers", "name email")
}

export const deleteAssistant = async (userId, departmentId) => {
    const department = await Department.findById(departmentId)

    if(!department){
        throw new Error('Department not found')
    }

    const user = await User.findById(userId)
    
    if(!user){
        throw new Error('User not found')
    } 

    const isAssistant = department.assistants.some(
      (assistant) => assistant.toString() === userId
    );
    
    if (!isAssistant) {
      throw new Error("User is not an assistant in this department");
    }
    
    department.assistants.pull(userId)
    await department.save()

    return department.populate("assistants", "name email")
}
