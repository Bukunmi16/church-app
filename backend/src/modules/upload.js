import express from 'express'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/', upload.single("image") , async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please upload an Image"
            })
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "church-website/test"
        )

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
            publicId: result.public_id
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

export default router