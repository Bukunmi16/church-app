import { getAdminDashboardData, getMemberDashboardData, getWorkerDashboardData } from "./dashboard.service.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const dashboard = await getAdminDashboardData()

        return res.status(200).json({
            success: true,
            dashboard
        })
    } catch (error) {
        console.error("Dashboard Error:", error)
        
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        })
    }
} 
export const getWorkerDashboard = async (req, res) => {
    try {
        
        const dashboard = await getWorkerDashboardData(req.user._id)

        return res.status(200).json({
            message: 'Worker Dashboard',
            success: true,
            dashboard
        })
    } catch (error) {
        console.error("Dashboard Error:", error)
        
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        })
    }
} 
export const getMemberDashboard = async (req, res) => {
    try {
        const dashboard = await getMemberDashboardData(req.user._id)

        return res.status(200).json({
            success: true,
            dashboard
        })
    } catch (error) {
        console.error("Dashboard Error:", error)
        
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        })
    }
} 