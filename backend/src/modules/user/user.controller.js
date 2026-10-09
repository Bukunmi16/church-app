import { getUsers, findUserById, updateUserRole, updateUserDetails, toggleStatus, removeUser, updateUserPassword } from "./user.service.js"

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getUsers(req.query)

        res.json({
            success: true,
            users
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
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
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const changeUserRole = async (req, res, next) => {
    try {
        console.log(req.body);
        
        const {role} = req.body
        // console.log(role);

        const user = await updateUserRole(req.params.id, role, req.user._id.toString())
        // console.log(user);/
        
        res.status(200).json({
            success: true,
            message: "User Role Updated Successfully",
            user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
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
        res.status(400).json({
            success: false,
            message: error.message
        })
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
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const update = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await updateUserDetails(userId, req.body, req.file)

        res.status(200).json({
            message: "Your Details have been Updated Successfully",
            user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user._id
        const {currentPassword, newPassword} = req.body
        await updateUserPassword(userId, currentPassword, newPassword)

        res.status(200).json({
            message: "Your Password has been Updated Successfully",
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
};
        