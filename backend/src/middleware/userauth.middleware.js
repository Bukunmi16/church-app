const authorizeUserOwner = async (req, res, next) => {
    const userId = req.user._id.toString()
    const targetUserId = req.params.id 
    
    if(userId !== targetUserId) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to update this account"
        });
    }
    next()
}

export default authorizeUserOwner