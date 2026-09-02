import Service from '../services/service.model.js'
import TeachingSeries from '../teachingSeries/teaching-series.model.js'
import Department from '../departments/department.model.js'
import Teaching from '../teachings/teaching.model.js'
import {uploadToCloudinary, deleteFromCloudinary } from '../../utils/cloudinary.js'

export const createTeaching = async (data, userId, file) => {
    let imageData = null

    if(file){
      imageData = await uploadToCloudinary(
        file.buffer,
        "church-app/teachings"
      )
    }

    const {title, description, preacher, service, series, videoUrl, audioUrl, department } = data

    const departmentExists = await Department.findById(department)

    if(!departmentExists) {
        throw new Error('Department not found')
    }

    const serviceExists = await Service.findById(service)

    if(!serviceExists) {
        throw new Error('Service not found')
    }

    const seriesExists = await TeachingSeries.findById(series)

    if(!seriesExists) {
        throw new Error('Teaching Series not found')
    }

    const creatorId = userId

    const teaching = await Teaching.create({
        title: title, 
        description: description, 
        preacher: preacher, 
        service: service, 
        series: series, 
        videoUrl: videoUrl, 
        audioUrl: audioUrl, 
        thumbnail: imageData, 
        department: department,
        createdBy: creatorId
    })

    await teaching.populate([
      { path: "service", select: "title date day" },
      { path: "series", select: "title month year" },
      { path: "department", select: "name" },
      { path: "createdBy", select: "name role" },
    ]);

    return teaching    
}

export const getAllTeachings = async () => {
    const teachings = await Teaching.find()

    return teachings
}

export const getOneTeaching = async (teachingId) => {
    const teaching = await Teaching.findById(teachingId)
    
    if(!teaching){
        throw new Error('Cannot find Teaching')
    }

    await teaching.populate([
      { path: "service", select: "title date day" },
      { path: "series", select: "title month year" },
      { path: "department", select: "name" },
      { path: "createdBy", select: "name role" },
    ]);

    return teaching
}

export const updateTeaching = async (teachingId, data, file) => {
  const teaching = await Teaching.findById(teachingId);

  if (!teaching) {
    throw new Error("Teaching not found");
  }
  
  if(file){
    if(teaching.thumbnail?.publicId){
      await deleteFromCloudinary(teaching.thumbnail.publicId)
    }

    const imageData = await uploadToCloudinary(
      file.buffer,
      "church-app/teachings"
    )

    teaching.thumbnail = imageData

  }

  const {
    title,
    description,
    preacher,
    service,
    series,
    department,
    videoUrl,
    audioUrl,
  } = data;

  // Basic fields
  if (title !== undefined) teaching.title = title;
  if (description !== undefined) teaching.description = description;
  if (preacher !== undefined) teaching.preacher = preacher;
  if (videoUrl !== undefined) teaching.videoUrl = videoUrl;
  if (audioUrl !== undefined) teaching.audioUrl = audioUrl;

  // Service relationship
  if (service !== undefined) {
    if (service === null) {
      teaching.service = null;
    } else {
      const existingService = await Service.findById(service);

      if (!existingService) {
        throw new Error("Service not found");
      }

      teaching.service = service;
    }
  }

  // Teaching Series relationship
  if (series !== undefined) {
    if (series === null) {
      teaching.series = null;
    } else {
      const existingSeries = await TeachingSeries.findById(series);

      if (!existingSeries) {
        throw new Error("Teaching Series not found");
      }

      teaching.series = series;
    }
  }

  // Department relationship
  if (department !== undefined) {
    if (department === null) {
      throw new Error("Teaching must belong to a department");
    }

    const existingDepartment = await Department.findById(department);

    if (!existingDepartment) {
      throw new Error("Department not found");
    }

    teaching.department = department;
  }

  await teaching.save();

  await teaching.populate([
    { path: "service", select: "title date day" },
    { path: "series", select: "title month year" },
    { path: "department", select: "name" },
    { path: "createdBy", select: "name role" },
  ]);

  return teaching;
}

export const removeTeaching = async (teachingId) => {
  const teaching = await Teaching.findById(teachingId);

  if (!teaching) {
    throw new Error("Teaching not found");
  }

  if(teaching.thumbnail?.publicId){
    await deleteFromCloudinary(teaching.thumbnail.publicId)
  }

  await Teaching.findByIdAndDelete(teachingId);

  return teaching;
}