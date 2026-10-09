import { getChurchInfo, saveChurchInfo } from "./church-info.service.js";

export const fetchChurchInfo = async (req, res) => {
    try {
        const churchInfo = await getChurchInfo();
        
        res.status(200).json({
            success: true,
            churchInfo
        })
    } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        };

}

export const updateChurchInfo = async (req, res) => {
    try {
        const churchInfo = await saveChurchInfo(req.body, req.file);
        
        res.status(200).json({
            success: true,
            churchInfo
        })
    } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        };

}