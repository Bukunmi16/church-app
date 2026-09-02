import { getUsers, findUserById, updateUserRole, updateUserDetails, toggleStatus, removeUser } from "./user.service.js"

export const getAllUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 20
        
        const {search, role} = req.query
        let {isActive} = req.query
        
        const result = await getUsers(page,limit, search, role, isActive)

        res.json({
            success: true,
            ...result
        })
    } catch (error) {
    next(error)       
    }
}

export const getOneUser = async (req, res, next) => {
    try {
        const user = await findUserById(req.params.id)

    res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        next(error)
    }
}

export const changeUserRole = async (req, res, next) => {
    try {
        
        const {role} = req.body

        const user = await updateUserRole(req.params.id, role, req.user._id.toString())
        // console.log(user);/
        
        res.status(200).json({
            success: true,
            message: "User Role Updated Successfully",
            user
        })

    } catch (error) {
        next(error)
    }
}

export const changeUserStatus = async (req, res, next) => {
    try {
        const user = await toggleStatus(req.params.id)
        
        res.status(200).json({
            success: true,
            message: `User ${user.isActive === true ? 'Activated' : 'Deactivated'} Successfully`,
            user
        })

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const user = await removeUser(req.params.id, req.user._id.toString())
       
        res.status(200).json({
            success: true,
            message: `User Account Deleted Successfully`,
            user
        })

    } catch (error) {
        next(error)
    }
}

export const update = async (req, res) => {
    try {
        const user = await updateUserDetails(req.params.id, req.body, req.file)

        res.status(200).json({
            message: "User Details Updated Successfully",
            user
        })
    } catch (error) {
        next(error)
    }
}