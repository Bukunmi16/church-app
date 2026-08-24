import { createTeachingSeries, getAllTeachingSeries, getOneTeachingSeries, removeSeries, updateTeachingSeries } from "./teaching-series.service.js"

export const create = async (req, res, next) => {
    try {
        const teachingSeries = await createTeachingSeries(req.body, req.user.id)

        res.status(200).json({
            sucess: true,
            message: "Teaching Series Created Successfully",
            teachingSeries
        })

    } catch (error) {
        next(error)
    }
}

export const getAll = async (req, res, next) => {
    try {
        const series = await getAllTeachingSeries()

        res.status(200).json({
            sucess: true,
            message: "All Series  Successfully",
            series
        })

    } catch (error) {
        next(error)
    }
}

export const getOne = async (req, res, next) => {
    try {
        const series = await getOneTeachingSeries(req.params.id)

        res.status(200).json({
            sucess: true,
            message: "Series Fetched Successfully",
            series
        })

    } catch (error) {
        next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const series = await updateTeachingSeries(req.params.id)

        res.status(200).json({
            sucess: true,
            message: "Teaching Series Updated Successfully",
            series
        })

    } catch (error) {
        next(error)
    }
}

export const deleteSeries = async (req, res, next) => {
    try {
        const series = await removeSeries(req.params.id)

        res.status(200).json({
            sucess: true,
            message: "Teaching Series Deleted Successfully",
            series
        })

    } catch (error) {
        next(error)
    }
}
