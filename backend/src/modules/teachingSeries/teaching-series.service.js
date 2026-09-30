import { notifyAllActiveUsers } from "../notifications/notification.service.js"

import { emailAllActiveUsers } from "../email/email.service.js"
import { emailTemplateCreate } from "../../utils/email.js"

import Teaching from "../teachings/teaching.model.js"
import TeachingSeries from "./teaching-series.model.js"
import getPagination from "../../utils/pagination.js"
import buildFilter from "../../utils/buildFilter.js"
import { teachingSeriesQueryConfig } from "../../config/queryConfig.js"
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js"


export const createTeachingSeries = async (data, userId, file) => {
    const imageData = file
        ? await uploadToCloudinary(file.buffer, "church-app/teaching-series")
        : {
          url: defaultImages.series,
          publicId: null,
        };
    
    const {title, description, month, year, date} = data

    const creatorId = userId

    const series = await TeachingSeries.create({
        title: title,
        description: description,
        month: month, 
        year: year,
        date: date, 
        thumbnail: imageData,
        createdBy: creatorId
    })

    await notifyAllActiveUsers({
        title: `${series.month} Teaching Series`,
        message: `New Monthly Series! Check out the series for more details`,
        type: "teachingSeries",
        relatedId: series._id,
        relatedModel: "TeachingSeries",
    })

    await emailAllActiveUsers({
        subject: `New Teaching Series: ${series.title}`,
        html: emailTemplateCreate({
            title: series.title,
            relatedModel: "Teaching Series",
            description: series.description,
 
        })
    })


    return series 
}

export const getAllTeachingSeries = async (query) => {
       const { page, limit, skip } = getPagination(query);
     
       const { filter, sort } = buildFilter({
         query,
         ...teachingSeriesQueryConfig,
       });
     
       const [teachingSeries, totalItems] = await Promise.all([
         TeachingSeries.find(filter)
           .skip(skip)
           .limit(limit)
           .sort(sort)
           .lean(),
     
         TeachingSeries.countDocuments(filter),
       ]);
     
       // Get the IDs of the series on this page
       const seriesIds = teachingSeries.map((series) => series._id);
     
       // Count teachings belonging to each series
       const teachingCounts = await Teaching.aggregate([
         {
           $match: {
             series: { $in: seriesIds },
           },
         },
         {
           $group: {
             _id: "$series",
             teachingCount: { $sum: 1 },
           },
         },
       ]);
     
       // Attach the count to each series
       const countMap = new Map(
         teachingCounts.map((item) => [
           item._id.toString(),
           item.teachingCount,
         ])
       );
     
       const teachingSeriesWithCount = teachingSeries.map((series) => ({
         ...series,
         teachingCount: countMap.get(series._id.toString()) || 0,
       }));
     
       const totalPages = Math.ceil(totalItems / limit);
     
       return {
         teachingSeries: teachingSeriesWithCount,
         pagination: {
           currentPage: page,
           totalPages,
           totalItems,
           limit,
           hasNextPage: page < totalPages,
           hasPreviousPage: page > 1,
         },
       };
};

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

export const updateTeachingSeries = async (seriesId, data, file) => {
    const series = await TeachingSeries.findById(seriesId)

    if(!series){
        throw new Error('Teaching Series not found')
    }

    
    if(file){
        if(series.thumbnail?.publicId){
            await deleteFromCloudinary(series.thumbnail.publicId)
        }
     const imageData = await uploadToCloudinary(
            file.buffer,
            "church-app/teaching-series"
        )
         series.thumbnail =  imageData
    }

    const {title, description, month, year, date} = data

    if(title !== undefined) series.title = title
    if(description !== undefined) series.description = description
    if(date !== undefined) series.date = date 
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

    if(series.thumbnail?.publicId){
        await deleteFromCloudinary(series.thumbnail.publicId)
    }

    await Teaching.updateMany(
      { series: seriesId },
      { $set: { series: null } }
    );

    await TeachingSeries.findByIdAndDelete(seriesId);

    return series
}