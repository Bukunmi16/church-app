import Teaching from "../modules/teachings/teaching.model.js";
import Department from "../modules/departments/department.model.js";

export const authorizeTeachingDepartment = async (req, res, next) => {

    if (req.user.role === "admin") {
        return next()
    }    

  const teaching = await Teaching.findById(req.params.id);

  if (!teaching) {
    return res.status(404).json({
      success: false,
      message: "Teaching not found",
    });
  }

  const department = await Department.findById(teaching.department);

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    });
  }

  const userId = req.user._id.toString();

  const hasAccess =
    department.leader?.toString() === userId ||
    department.assistants.some(
      (assistant) => assistant.toString() === userId
    ) ||
    department.workers.some(
      (worker) => worker.toString() === userId
    );

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  next();
};

export const authorizeTeachingDepartmentCreate = async (req, res, next) => {
  // Admin can create for any department
  if (req.user.role === "admin") {
    return next();
  }

  const { department: departmentId } = req.body;

  if (!departmentId) {
    return res.status(400).json({
      success: false,
      message: "Department is required",
    });
  }

  const department = await Department.findById(departmentId);

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    });
  }

  const userId = req.user._id.toString();

  const hasAccess =
    department.leader?.toString() === userId ||
    department.assistants.some(
      (assistant) => assistant.toString() === userId
    ) ||
    department.workers.some(
      (worker) => worker.toString() === userId
    );

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to create a teaching for this department",
    });
  }

  next();
};