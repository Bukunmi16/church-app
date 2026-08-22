import { loginUser, registerUser } from "./auth.service.js"


export const register = async (req, res, next) => {
    try {
     const user = await registerUser(req.body)

     res.status(200).json({
        succes: true,
        message: 'User Registered Successfully',
        user
     })

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
     const result = await loginUser(req.body)

     res.status(200).json({
        succes: true,
        message: `Login Success. Welcome back, ${result.user.name}!`,
        result
     })

    } catch (error) {
        next(error)
    }
}