import Teaching from "../teachings/teaching.model.js"
import TeachingSeries from "./teaching-series.model.js"

export const createTeachingSeries = async (data, userId) => {
    const {title, description, month, year} = data

    const creatorId = userId

    const series = await TeachingSeries.create({
        title: title,
        description: description,
        month: month, 
        year: year,
        createdBy: creatorId
    })

    return series 
}

export const getAllTeachingSeries = async () => {
    const series = await TeachingSeries.find()

    return series
}

export const getOneTeachingSeries = async (seriesId) => {
    const series = await TeachingSeries.findById(seriesId)

    if(!series) {
        throw new Error('Teaching Series not found')
    }

    const teachings = await Teaching.find({series : seriesId})
    .populate("series", "title month year")
    .populate("department", "name")
    .populate("createdBy", "name role");

    return { series, teachings }
}

export const updateTeachingSeries = async (seriesId, data) => {
    const series = await TeachingSeries.findById(seriesId)

    if(!series){
        throw new Error('Teaching Series not found')
    }

    const {title, description, month, year} = data

    if(title) series.title = title
    if(description !== undefined) series.description = description
    if(month) series.month = month
    if(year) series.year = year


    await series.save()

    return series
}

export const removeSeries = async (seriesId) => {
    const series = await TeachingSeries.findById(seriesId)

    if(!series){
        throw new Error('Series not found')
    }
    await Teaching.updateMany(
      { series: seriesId },
      { $set: { series: null } }
    );

    await TeachingSeries.findByIdAndDelete(seriesId);

    return series
}