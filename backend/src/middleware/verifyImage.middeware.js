import { fileTypeFromBuffer } from "file-type";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const verifyImageFile = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const detectedType = await fileTypeFromBuffer(req.file.buffer);

    if (!detectedType || !allowedTypes.has(detectedType.mime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image file.",
      });
    }

    req.file.detectedMimeType = detectedType.mime;

    next();
  } catch (error) {
    next(error);
  }
};
