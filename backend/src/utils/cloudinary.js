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
                    resolve(result)
                }
            }
        )
        Readable.from(fileBuffer).pipe(uploadStream)
    })
}