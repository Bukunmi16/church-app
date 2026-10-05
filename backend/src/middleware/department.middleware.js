import Department from "../modules/departments/department.model.js"

const authorizeDepartmentLeader = async (req, res, next) => {
        
        const department = await Department.findById(req.params.id)

        if (!department) {
          return res.status(404).json({
            success: false,
            message: "Department not found",
          });
        }
        
        const userId = req.user._id.toString() 
        console.log(req.user.role);
        
        if(department.leader.toString() === userId || req.user.role === 'admin') {
            next()
        } else{
            return res.status(403).json({
                success: false,
                message: 'You are not permitted make this request'
            })
        }

    
}

export default authorizeDepartmentLeader