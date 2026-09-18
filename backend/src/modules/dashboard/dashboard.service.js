import Service from "../services/service.model.js";
import Event from "../events/event.model.js";
import User from "../user/user.model.js";
import Department from "../departments/department.model.js";
import Notification from "../notifications/notification.model.js";
import Teaching from "../teachings/teaching.model.js";

export const getAdminDashboardData = async (userId) => {
  const now = new Date();

  const [
    upcomingService,
    upcomingEvents,
    memberCount,
    workerCount,
    departmentCount,
    recentActivity,
  ] = await Promise.all([
    Service.findOne({
      date: { $gte: now },
    })
      .sort({ date: 1 })
      .lean(),

    Event.find({
      endDate: { $gte: now },
    })
      .sort({ startDate: 1 })
      .limit(5)
      .lean(),

    User.countDocuments({ role: "member", isActive: true }),

    User.countDocuments({ role: "worker", isActive: true }),

    Department.countDocuments(),

    Notification.find({recipient: userId})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    upcomingService,
    upcomingEvents,
    recentActivity,
    stats: {
      members: memberCount,
      workers: workerCount,
      departments: departmentCount,
    },
  };
};

export const getWorkerDashboardData = async (userId) => {
    const now = new Date()

    const [upcomingService, upcomingEvents, latestTeachings, recentNotifications] = await Promise.all([
        Service.findOne({
            date: {$gte: now},
        })
        .sort({date: 1})
        .lean(),

    Event.find({
        endDate: {$gte: now},
    })
    .sort({startDate: 1})
    .limit(3)
    .lean(),

    Teaching.findOne()
        .sort({createdAt: -1})
        .lean(),
    
    Notification.find({ recipient : userId})
        .sort({createdAt: -1})
        .limit(5)
        .lean()
    ])

    return {
        upcomingService,
        upcomingEvents,
        latestTeachings,
        recentNotifications,
    }
}

export const getMemberDashboardData = async (userId) => {
  const now = new Date();

  const [
    upcomingService,
    upcomingEvents,
    latestTeaching,
    recentNotifications,
  ] = await Promise.all([
    Service.findOne({
      date: { $gte: now },
    })
      .sort({ date: 1 })
      .lean(),

    Event.find({
      endDate: { $gte: now },
    })
      .sort({ startDate: 1 })
      .limit(3)
      .lean(),

    Teaching.findOne()
      .sort({ createdAt: -1 })
      .lean(),

    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    upcomingService,
    upcomingEvents,
    latestTeaching,
    recentNotifications,
  };
};