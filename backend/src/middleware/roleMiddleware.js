const authorize = (...allowedRole) => {
    return (req, res, next) =>{
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication Required'
            })
        }

        if(!allowedRole.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to perform this action'
            })
        };
        next()
    }
}

export default authorize