import Service from '../services/service.model.js'
import TeachingSeries from '../teachingSeries/teaching-series.model.js'
import Department from '../departments/department.model.js'
import Teaching from '../teachings/teaching.model.js'

export const createTeaching = async (data, userId) => {
    const {title, description, preacher, service, series, videoUrl, audioUrl, thumbnail, department } = data

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
        thumbnail: thumbnail, 
        department: department,
        createdBy: creatorId
    })

    return teaching
    .populate("service", "title date day")
    .populate("series", "title month year")
    .populate("department", "name")
    .populate("createdBy", "name role")    
}

export const getAllTeachings = async () => {
    const teachings = await Teaching.find()
    
    return teachings
    .populate("service", "title date day")
    .populate("series", "title month year")
    .populate("department", "name")
    .populate("createdBy", "name role") 
}

export const getOneTeachings = async (teachingId) => {
    const teaching = await Teaching.findById(teachingId)
    
    if(!teaching){
        throw new Error('Cannot find Teaching')
    }

    return teachings
    .populate("service", "title date day")
    .populate("series", "title month year")
    .populate("department", "name")
    .populate("createdBy", "name role") 
}

export const updateTeaching = async (teachingId, data) => {
  const teaching = await Teaching.findById(teachingId);

  if (!teaching) {
    throw new Error("Teaching not found");
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
    thumbnail,
  } = data;

  // Basic fields
  if (title !== undefined) teaching.title = title;
  if (description !== undefined) teaching.description = description;
  if (preacher !== undefined) teaching.preacher = preacher;
  if (videoUrl !== undefined) teaching.videoUrl = videoUrl;
  if (audioUrl !== undefined) teaching.audioUrl = audioUrl;
  if (thumbnail !== undefined) teaching.thumbnail = thumbnail;

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

  return teaching;
}

export const removeTeaching = async (teachingId) => {
  const teaching = await Teaching.findById(teachingId);

  if (!teaching) {
    throw new Error("Teaching not found");
  }

  await Teaching.findByIdAndDelete(teachingId);

  return teaching;
}