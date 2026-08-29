import { createTeaching, getAllTeachings, getOneTeaching, updateTeaching,removeTeaching } from "./teaching.service.js"

export const create = async (req, res, next) => {
    try {
        const teaching = await createTeaching(req.body, req.user.id)

        res.status(200).json({
            sucess: true,
            message: "Teaching Created Successfully",
            teaching
        })

    } catch (error) {
        next(error)
    }
} 

export const getAll = async (req, res, next) => {
    try {
        const teachings = await getAllTeachings(req.body)

        res.status(200).json({
            sucess: true,
            message: "All Teachingss Fetched Successfully",
            teachings
        })

    } catch (error) {
        next(error)
    }
} 

export const getOne = async (req, res, next) => {
    try {
        const teaching = await getOneTeaching(req.params.id)

        res.status(200).json({
            sucess: true,
            message: "One Teaching Fetched Successfully",
            teaching
        })

    } catch (error) {
        next(error)
    }
} 

export const update = async (req, res, next) => {
    try {
        const teaching = await updateTeaching(req.params.id, req.body)

        res.status(200).json({
            sucess: true,
            message: "Teaching Updated Successfully",
            teaching
        })

    } catch (error) {
        next(error)
    }
} 

export const deleteTeaching = async (req, res, next) => {
    try {
        const teaching = await removeTeaching(req.params.id)

        res.status(200).json({
            sucess: true,
            message: "Teaching Deleted Successfully",
            teaching
        })

    } catch (error) {
        next(error)
    }
} 
