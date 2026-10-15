import { ZodError } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        file: req.file
      });

      // Replace incoming data with validated data.
      req.validated = validatedData;

      next();
    } catch (error) {
      console.log(error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      next(error);
    }
  };
};