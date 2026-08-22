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

        await User.findByIdAndDelete(userId)
    
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    }