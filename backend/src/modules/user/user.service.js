import bcrypt from "bcryptjs";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js";
import User from "./user.model.js";


export const getUsers = async (page = 1, limit = 20, search, role, isActive) => {
  const skip = (page - 1) * limit;

  const filter = {}

  if(search){
    filter.$or =[
        {name: {$regex: search, $options: "i"}},
        {email: {$regex: search, $options: "i"}},
        {phone: {$regex: search, $options: "i"}},
    ]
  }

  if(role){
    filter.role = role
  }

  if(isActive !== undefined){
    filter.isActive = isActive
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),
  ]);


  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findUserById = async (userId) => {
    const user = await User.findById(userId).select("-password -refeshToken")

    if(!user){
        throw new Error("User not found")
    }
    return user
} 

export const updateUserRole = async (userId, role, currentUserId) => {
    const allowedRoles = [ "admin", "worker", "member"]

    if(!allowedRoles.includes(role)){
        throw new Error("Invalid role")
    }

    if(userId === currentUserId){
        throw new Error("You cannot change your own role")
    }

    const user = await User.findById(userId)

    if(!user) { 
        throw new Error("User not found")
    }

    user.role = role
    await user.save()

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}

export const toggleStatus = async (userId, status, currentUserId) => {

    const user = await User.findById(userId)

    if(!user) { 
        throw new Error("User not found")
    }

    user.isActive = !user.isActive
    await user.save()

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    }
}
    
export const removeUser = async (userId, currentUserId) => {
    
        if(userId === currentUserId){
            throw new Error("You cannot delete your own account")
        }
        
        const user = await User.findById(userId)
        
        if(!user) { 
            throw new Error("User not found")
        }

        if(user.profileImage?.publicId) {
            await deleteFromCloudinary(user.profileImage.publicId)
        }

        await User.findByIdAndDelete(userId)
    
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    }

export const updateUserDetails = async (userId, data, file) => {
    const user = await User.findById(userId)

    if(!user){
        throw new Error('User does not exist')
    }

    if(file){
        if(user.profileImage?.publicId) {
            await deleteFromCloudinary(user.profileImage.publicId)
        }
    const imageData = await uploadToCloudinary(
        file.buffer,
        "church-app/users"
    )
        user.profileImage = imageData    
    }

    const {name, email, phone, password, dateOfBirth, gender, address} = data

    if (email !== undefined) {
        const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
         _id: { $ne: userId },
      });

    if (existingUser) {
        throw new Error("Email is already in use");
    }

      user.email = email
    }

    if (password !== undefined) {
     const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    }
    
    if(name !== undefined) user.name = name
    if(phone !== undefined) user.phone = phone
    if(dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth
    if(gender !== undefined) user.gender = gender 
    if(address !== undefined) user.address = address 

    await user.save()

    return user
}