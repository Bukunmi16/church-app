import {Readable} from  "stream"
import cloudinary from "../config/cloudinary.js"

export const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {    
                if (error) {
                    reject(error)
                }else{
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    })
                }
            }
        )
        Readable.from(fileBuffer).pipe(uploadStream)
    })
}

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
        return;
    }

    const result = await cloudinary.uploader.destroy(publicId)

    return result
}
