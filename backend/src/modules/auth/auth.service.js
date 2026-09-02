import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'
import {uploadToCloudinary} from '../../utils/cloudinary.js'

export const registerUser = async (data, file) => {
    let imageData = null
    if (file) {
        await uploadToCloudinary(
            file.buffer,
            "church-app/users"
        )
    }

    const {name, email, phone, password, dateOfBirth, gender, address} = data

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new Error("Email is already registered")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
        name, 
        email, 
        phone, 
        password: hashedPassword, 
        dateOfBirth, 
        gender, 
        address, 
        profileImage: imageData
    })
    
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}


const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    )
}

export const loginUser = async (data) => {
    const {email, password} = data

    const user = await User.findOne({email})

    if(!user){
        throw new Error("User not Found")
    }

    if(!user.isActive){
        throw new Error("Your account has been deactivated")
    }
    
    const verifyPassword = await bcrypt.compare(password, user.password)
    
    if(!verifyPassword){
        throw new Error("Email or password is incorrect. Please try again")
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)


    return {
     user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
    accessToken,
    refreshToken
}
}